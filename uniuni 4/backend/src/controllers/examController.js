const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../middleware/error');

const prisma = new PrismaClient();

// Create a new exam (admin only)
const createExam = async (req, res, next) => {
  try {
    const { courseId, examType, examDate, startTime, endTime } = req.body;

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return next(new AppError('No course found with that ID', 404));
    }

    // Check for overlapping exams
    const overlappingExam = await prisma.exam.findFirst({
      where: {
        courseId,
        OR: [
          {
            startTime: { lt: new Date(endTime) },
            endTime: { gt: new Date(startTime) },
          },
        ],
      },
    });

    if (overlappingExam) {
      return next(
        new AppError('There is already an exam scheduled during this time', 400)
      );
    }

    // Create exam
    const exam = await prisma.exam.create({
      data: {
        course: { connect: { id: courseId } },
        examType,
        examDate: new Date(examDate),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
      include: {
        course: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    });

    res.status(201).json({
      status: 'success',
      data: {
        exam,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get all exams (with optional filtering)
const getAllExams = async (req, res, next) => {
  try {
    const { courseId, examType, fromDate, toDate } = req.query;
    
    const where = {};
    
    if (courseId) where.courseId = courseId;
    if (examType) where.examType = examType;
    if (fromDate || toDate) {
      where.examDate = {};
      if (fromDate) where.examDate.gte = new Date(fromDate);
      if (toDate) where.examDate.lte = new Date(toDate);
    }

    const exams = await prisma.exam.findMany({
      where,
      include: {
        course: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
      orderBy: {
        examDate: 'asc',
      },
    });

    res.status(200).json({
      status: 'success',
      results: exams.length,
      data: {
        exams,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get a single exam
const getExam = async (req, res, next) => {
  try {
    const exam = await prisma.exam.findUnique({
      where: { id: req.params.id },
      include: {
        course: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    });

    if (!exam) {
      return next(new AppError('No exam found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        exam,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update an exam (admin only)
const updateExam = async (req, res, next) => {
  try {
    const { examType, examDate, startTime, endTime } = req.body;

    // Check if exam exists
    const exam = await prisma.exam.findUnique({
      where: { id: req.params.id },
    });

    if (!exam) {
      return next(new AppError('No exam found with that ID', 404));
    }

    // Check for overlapping exams (excluding current exam)
    if (startTime || endTime) {
      const overlappingExam = await prisma.exam.findFirst({
        where: {
          id: { not: req.params.id },
          courseId: exam.courseId,
          OR: [
            {
              startTime: { lt: endTime ? new Date(endTime) : exam.endTime },
              endTime: { gt: startTime ? new Date(startTime) : exam.startTime },
            },
          ],
        },
      });

      if (overlappingExam) {
        return next(
          new AppError('There is already an exam scheduled during this time', 400)
        );
      }
    }

    const updatedExam = await prisma.exam.update({
      where: { id: req.params.id },
      data: {
        examType: examType || undefined,
        examDate: examDate ? new Date(examDate) : undefined,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
      },
      include: {
        course: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    });

    res.status(200).json({
      status: 'success',
      data: {
        exam: updatedExam,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete an exam (admin only)
const deleteExam = async (req, res, next) => {
  try {
    // Check if exam exists
    const exam = await prisma.exam.findUnique({
      where: { id: req.params.id },
    });

    if (!exam) {
      return next(new AppError('No exam found with that ID', 404));
    }

    await prisma.exam.delete({
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

// Get all exams for a specific course
const getExamsByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return next(new AppError('No course found with that ID', 404));
    }

    const exams = await prisma.exam.findMany({
      where: { courseId },
      orderBy: {
        examDate: 'asc',
      },
    });

    res.status(200).json({
      status: 'success',
      results: exams.length,
      data: {
        exams,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createExam,
  getAllExams,
  getExam,
  updateExam,
  deleteExam,
  getExamsByCourse,
};
