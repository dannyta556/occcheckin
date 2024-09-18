import express from 'express';
import Student from '../models/studentModel.js';
import expressAsyncHandler from 'express-async-handler';

const studentRouter = express.Router();

studentRouter.get(
  '/getStudentList',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const semester = query.semester || '';

    const semesterFilter = semester && semester !== 'all' ? { semester } : {};

    const studentList = await Student.find({ ...semesterFilter });

    if (studentList) {
      res.send({
        studentList,
      });
    } else {
      res.send({
        studentList: [],
      });
    }
  })
);

studentRouter.get(
  '/getStudent',
  expressAsyncHandler(async (req, res) => {
    const student = await Student.findOne({ studentID: req.params.studentID });
    if (student) {
      res.send(student);
    } else {
      res.status(404).send({ message: 'Student not found' });
    }
  })
);

studentRouter.post(
  '/addStudent',
  expressAsyncHandler(async (req, res) => {
    const student = await Student.findOne(req.body.studentID);
    if (student) {
      // student exists, just add new semester to student, update mathlvl
      const updateStudent = await Student.findOneAndUpdate(
        {
          studentID: req.body.studentID,
        },
        {
          $push: {
            enrolled: req.body.semester,
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
      enrolled.push(req.body.semester);
      const newStudent = new Student({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        studentID: req.body.studentID,
        enrolled: enrolled,
        mathlvl: req.body.mathlvl,
      });
      const saveStudent = await newStudent.save();
      if (saveStudent) {
        res.status(201).send({
          message: `Student: ${req.body.studentID} saved to the database`,
        });
      } else {
        res.status(500).send({ message: 'Failed to save student to database' });
      }
    }
  })
);

studentRouter.put(
  '/removeStudent',
  expressAsyncHandler(async (req, res) => {
    const student = await Student.findOneAndDelete({
      studentID: req.params.studentID,
    });
    if (student) {
      res.send({ delete: true });
    } else {
      res.send({ delete: false });
    }
  })
);
