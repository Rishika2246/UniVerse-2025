const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../middleware/error');

const prisma = new PrismaClient();

// Create a new syllabus (admin only)
const createSyllabus = async (req, res, next) => {
  try {
    const { courseId, content, sourcePdfUrl } = req.body;

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return next(new AppError('No course found with that ID', 404));
    }

    // Check if syllabus already exists for this course
    const existingSyllabus = await prisma.syllabus.findFirst({
      where: { courseId },
    });

    if (existingSyllabus) {
      return next(new AppError('Syllabus already exists for this course', 400));
    }

    const syllabus = await prisma.syllabus.create({
      data: {
        course: { connect: { id: courseId } },
        content,
        sourcePdfUrl,
      },
    });

    res.status(201).json({
      status: 'success',
      data: {
        syllabus,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get syllabus for a course
const getSyllabus = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const syllabus = await prisma.syllabus.findFirst({
      where: { courseId },
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

    if (!syllabus) {
      return next(new AppError('No syllabus found for this course', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        syllabus,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update syllabus (admin only)
const updateSyllabus = async (req, res, next) => {
  try {
    const { content, sourcePdfUrl } = req.body;

    // Check if syllabus exists
    const syllabus = await prisma.syllabus.findFirst({
      where: { id: req.params.id },
    });

    if (!syllabus) {
      return next(new AppError('No syllabus found with that ID', 404));
    }

    const updatedSyllabus = await prisma.syllabus.update({
      where: { id: req.params.id },
      data: {
        content: content || undefined,
        sourcePdfUrl: sourcePdfUrl !== undefined ? sourcePdfUrl : syllabus.sourcePdfUrl,
      },
    });

    res.status(200).json({
      status: 'success',
      data: {
        syllabus: updatedSyllabus,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete syllabus (admin only)
const deleteSyllabus = async (req, res, next) => {
  try {
    // Check if syllabus exists
    const syllabus = await prisma.syllabus.findUnique({
      where: { id: req.params.id },
    });

    if (!syllabus) {
      return next(new AppError('No syllabus found with that ID', 404));
    }

    await prisma.syllabus.delete({
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

module.exports = {
  createSyllabus,
  getSyllabus,
  updateSyllabus,
  deleteSyllabus,
};
