import express from 'express';
import Course from '../models/courseModel.js';
import expressAsyncHandler from 'express-async-handler';

const courseRouter = express.Router();

courseRouter.get(
  '/getCourseList',
  expressAsyncHandler(async (req, res) => {
    const courses = await Course.find();
    if (courses) {
      res.send(courses);
    } else {
      res.send([]);
    }
  })
);

courseRouter.post(
  '/addCourse',
  expressAsyncHandler(async (req, res) => {
    let course = new Course({
      name: req.body.name,
    });
    try {
      let result = await course.save({ upsert: true });
      if (result) {
        res.send({
          message: `New Course: "${req.body.name}" Created`,
          result: true,
        });
      }
    } catch (e) {
      res.send({
        message: `Course: "${req.body.name}" already exsists`,
        result: false,
      });
    }
  })
);

export default courseRouter;
