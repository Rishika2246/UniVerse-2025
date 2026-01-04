const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../middleware/error');

const prisma = new PrismaClient();

// Create a new course (admin only)
const createCourse = async (req, res, next) => {
  try {
    const { code, name, semester, department } = req.body;

    // Check if course with same code already exists
    const existingCourse = await prisma.course.findUnique({
      where: { code },
    });

    if (existingCourse) {
      return next(new AppError('Course with this code already exists', 400));
    }

    const course = await prisma.course.create({
      data: {
        code,
        name,
        semester: parseInt(semester, 10),
        department,
      },
    });

    res.status(201).json({
      status: 'success',
      data: {
        course,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get all courses
const getAllCourses = async (req, res, next) => {
  try {
    // Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = prisma.course.findMany({
      where: JSON.parse(queryStr),
    });

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = prisma.course.findMany({
        where: JSON.parse(queryStr),
        orderBy: sortBy.split(' ').map((field) => ({
          [field.replace('-', '')]: field.startsWith('-') ? 'desc' : 'asc',
        })),
      });
    }

    // Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = prisma.course.findMany({
        select: fields.split(' ').reduce((acc, field) => {
          acc[field] = true;
          return acc;
        }, {}),
      });
    }

    // Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    const courses = await prisma.course.findMany({
      skip,
      take: limit,
    });

    // Count total documents
    const total = await prisma.course.count();

    // Send response
    res.status(200).json({
      status: 'success',
      results: courses.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: {
        courses,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get a single course
const getCourse = async (req, res, next) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
      include: {
        syllabus: true,
        exams: true,
      },
    });

    if (!course) {
      return next(new AppError('No course found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        course,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update a course (admin only)
const updateCourse = async (req, res, next) => {
  try {
    const { code, name, semester, department } = req.body;

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
    });

    if (!course) {
      return next(new AppError('No course found with that ID', 404));
    }

    // Check if new code is already taken
    if (code && code !== course.code) {
      const existingCourse = await prisma.course.findUnique({
        where: { code },
      });

      if (existingCourse) {
        return next(new AppError('Course with this code already exists', 400));
      }
    }

    const updatedCourse = await prisma.course.update({
      where: { id: req.params.id },
      data: {
        code: code || undefined,
        name: name || undefined,
        semester: semester ? parseInt(semester, 10) : undefined,
        department: department || undefined,
      },
    });

    res.status(200).json({
      status: 'success',
      data: {
        course: updatedCourse,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete a course (admin only)
const deleteCourse = async (req, res, next) => {
  try {
    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
    });

    if (!course) {
      return next(new AppError('No course found with that ID', 404));
    }

    // Delete course (cascading deletes will handle related records)
    await prisma.course.delete({
      where: { id: req.params.id },
    });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// Enroll student in a course (admin only)
const enrollStudent = async (req, res, next) => {
  try {
    const { studentId } = req.body;

    // Check if student exists
    const student = await prisma.user.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return next(new AppError('No student found with that ID', 404));
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
    });

    if (!course) {
      return next(new AppError('No course found with that ID', 404));
    }

    // Check if enrollment already exists
    const existingEnrollment = await prisma.studentCourse.findFirst({
      where: {
        studentId,
        courseId: req.params.id,
      },
    });

    if (existingEnrollment) {
      return next(new AppError('Student is already enrolled in this course', 400));
    }

    // Enroll student
    const enrollment = await prisma.studentCourse.create({
      data: {
        student: { connect: { id: studentId } },
        course: { connect: { id: req.params.id } },
      },
    });

    res.status(201).json({
      status: 'success',
      data: {
        enrollment,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get all students enrolled in a course
const getEnrolledStudents = async (req, res, next) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
      include: {
        studentCourses: {
          include: {
            student: {
              select: {
                id: true,
                fullName: true,
                email: true,
                rollNo: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      return next(new AppError('No course found with that ID', 404));
    }

    // Format the response
    const students = course.studentCourses.map((sc) => ({
      ...sc.student,
      enrolledAt: sc.enrolledAt,
    }));

    res.status(200).json({
      status: 'success',
      results: students.length,
      data: {
        students,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  enrollStudent,
  getEnrolledStudents,
};
