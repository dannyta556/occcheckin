import express from 'express';
import Course from '../models/courseModel.ts';

const seedRouter = express.Router();

const courseData = [
  { name: 'Math 100' },
  { name: 'Math 104' },
  { name: 'Math 115' },
  { name: 'Math 120' },
  { name: 'Math 140' },
  { name: 'Math 170' },
  { name: 'Math 180' },
  { name: 'Math 185' },
  { name: 'Math 280' },
  { name: 'Math 285' },
];

seedRouter.get('/', async (req, res) => {
  await Course.deleteMany({});
  await Course.insertMany(courseData);

  res.send({ message: 'Course data added.' });
});

export default seedRouter;
