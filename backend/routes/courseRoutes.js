import express from 'express';
import Course from '../models/courseModel.js';
import expressAsyncHandler from 'express-async-handler';

const courseRouter = express.Router();

courseRouter.get(
  '/getCourseList',
  expressAsyncHandler(async (req, res) => {
    const courses = await Course.find();

    res.send({
      courses,
    });
  })
);

courseRouter.post(
  '/addCourse',
  expressAsyncHandler(async (req, res) => {
    let course = new Course({
      name: req.body.name,
    });
    try {
      let result = await course.save();
      if (result) {
        res.send({ message: 'New Article Created', result: true });
      }
    } catch (e) {
      res.status(401).send({ message: 'Failed to create a new course' });
    }
  })
);

export default courseRouter;
