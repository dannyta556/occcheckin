import express from 'express';
import Course from '../models/courseModel.ts';
import expressAsyncHandler from 'express-async-handler';

const courseRouter = express.Router();

courseRouter.get(
  '/getCourseList',
  expressAsyncHandler(async (req, res) => {
    const courses = await Course.find();
    if (courses) {
      res.status(201).send({ courses: courses });
    } else {
      res
        .status(500)
        .send({ courses: [], message: 'Error in getting course list.' });
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
      let result = await course.save({});
      if (result) {
        res.send({
          message: `New Course: "${req.body.name}" Created`,
          result: true,
        });
      }
    } catch (e) {
      res.status(500).send({
        message: `Course: "${req.body.name}" already exsists`,
        result: false,
      });
    }
  })
);

courseRouter.put(
  '/deleteCourse',
  expressAsyncHandler(async (req, res) => {
    const course = await Course.findOneAndDelete({
      name: req.body.name,
    });

    if (course) {
      res.status(201).send({
        message: `Course: "${req.body.name}" succesfully removed from the database.`,
      });
    } else {
      res.status(500).send({
        message: `Error in removing "${req.body.name}".`,
      });
    }
  })
);

export default courseRouter;
