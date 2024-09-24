import express from 'express';
import Student from '../models/studentModel.js';
import expressAsyncHandler from 'express-async-handler';
import { getYesterday } from '../utils/dates.js';

const studentRouter = express.Router();

studentRouter.get(
  '/getStudentList',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const semester = query.semester || '';
    let studentList = [];
    if (semester == '') {
      studentList = await Student.find();
    } else {
      studentList = await Student.find({ enrolled: semester });
    }
    const semesterList = await Student.aggregate([
      { $unwind: '$enrolled' },
      { $group: { _id: null, uniqueEnrolled: { $addToSet: '$enrolled' } } },
      { $project: { _id: 0, uniqueEnrolled: 1 } },
    ]);

    if (studentList && semesterList) {
      res.send({
        studentList: studentList,
        semesterList: semesterList,
      });
    } else {
      res.send({
        studentList: [],
        semesterList: semesterList,
      });
    }
  })
);

studentRouter.get(
  '/getStudent/:studentID',
  expressAsyncHandler(async (req, res) => {
    const student = await Student.findOne({ studentID: req.params.studentID });
    if (student) {
      res.send({ student: student, message: 'Student exists', exists: true });
    } else {
      res
        .status(401)
        .send({ student: {}, message: 'Student not found', exists: false });
    }
  })
);

studentRouter.post(
  '/addStudent',
  expressAsyncHandler(async (req, res) => {
    console.log(req.body.studentID);
    const student = await Student.findOne({ studentID: req.body.studentID });
    if (student) {
      // student exists, just add new semester to student, update mathlvl

      const updateStudent = await Student.findOneAndUpdate(
        {
          studentID: req.body.studentID,
        },
        {
          $addToSet: {
            enrolled: req.body.enrolled,
          },
          mathlvl: req.body.mathlvl,
        }
      );
      if (updateStudent) {
        res.send({ message: 'Student is updated', success: true });
      } else {
        res.send({ message: 'Failed to update student', success: false });
      }
    } else {
      // create a new student
      let enrolled = [];
      enrolled.push(req.body.enrolled);
      const newStudent = new Student({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        studentID: req.body.studentID,
        lastCheckin: getYesterday(),
        enrolled: enrolled,
        mathlvl: req.body.mathlvl,
      });
      console.log('Saving new student');
      const saveStudent = await newStudent.save();
      if (saveStudent) {
        res.status(201).send({
          message: `Student: ${req.body.studentID} ${req.body.firstname} ${req.body.lastname} saved to the database`,
          success: true,
        });
      } else {
        res.status(500).send({
          message: `Failed to save student ${req.body.studentID} to database.`,
          success: false,
        });
      }
    }
  })
);

studentRouter.put(
  '/removeStudent',
  expressAsyncHandler(async (req, res) => {
    console.log(req.body.studentID);
    const student = await Student.findOneAndDelete({
      studentID: req.body.studentID,
    });
    if (student) {
      res.send({
        delete: true,
        message: `Student ${req.body.studentID} is deleted.`,
      });
    } else {
      res.status(401).send({
        delete: false,
        message: `StudentID: ${req.body.studentID} does not exist.`,
      });
    }
  })
);

export default studentRouter;
