import express from 'express';
import Student from '../models/studentModel.js';
import Checkin from '../models/checkinModel.js';
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

    // get Total Hours for each student
    // loop through list of students
    let studentTotalHrs = {};
    if (studentList) {
      for (let i = 0; i < studentList.length; ++i) {
        // get all checkins
        let hours = 0;
        let mins = 0;
        let checkins = await Checkin.find({
          studentID: studentList[i].studentID,
        });

        if (checkins) {
          // loop through every checkin and add it's hours and mins
          for (let j = 0; j < checkins.length; ++j) {
            hours += parseInt(checkins[j].total.split(':')[0]);
            mins += parseInt(checkins[j].total.split(':')[1]);
          }
          let subHours = Math.floor(mins / 60);
          let subMins = mins % 60;
          hours = hours + subHours;
          mins = subMins;
        }
        let totalHrs = hours.toString() + ':' + mins.toString();
        studentTotalHrs[studentList[i].studentID] = totalHrs;
      }
    }

    if (studentList && semesterList) {
      res.status(201).send({
        studentList: studentList,
        semesterList: semesterList,
        studentTotalHrs: studentTotalHrs,
        message: 'Success',
      });
    } else {
      res.status(500).send({
        studentList: [],
        semesterList: semesterList,
        studentTotalHrs: studentTotalHrs,
        message: 'Error',
      });
    }
  })
);

studentRouter.get(
  '/getStudent/:studentID',
  expressAsyncHandler(async (req, res) => {
    const student = await Student.findOne({ studentID: req.params.studentID });
    if (student) {
      res.send({ student: student, message: 'Student exists' });
    } else {
      res.status(401).send({ student: {}, message: 'Student not found' });
    }
  })
);

studentRouter.post(
  '/addStudent',
  expressAsyncHandler(async (req, res) => {
    const student = await Student.findOne({ studentID: req.body.studentID });
    const mathlvl = req.body.mathlvl || student.mathlvl;
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
          mathlvl: mathlvl,
        }
      );
      if (updateStudent) {
        res.status(201).send({ message: 'Student is updated', success: true });
      } else {
        res
          .status(500)
          .send({ message: 'Failed to update student', success: false });
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
studentRouter.post(
  '/updateStudent',
  expressAsyncHandler(async (req, res) => {
    const student = await Student.findOne({ studentID: req.body.studentID });
    const isAddSemester = req.body.type;

    if (student) {
      if (isAddSemester) {
        const updateStudent = await Student.findOneAndUpdate(
          {
            studentID: req.body.studentID,
          },
          {
            $addToSet: {
              enrolled: req.body.enrolled,
            },
          }
        );
        if (updateStudent) {
          res
            .status(201)
            .send({ message: `Student ${req.body.studentID} is updated.` });
        } else {
          res
            .status(500)
            .send({ message: `Error updating Student: ${req.body.studentID}` });
        }
      } else {
        const updateStudent = await Student.findOneAndUpdate(
          {
            studentID: req.body.studentID,
          },
          {
            studentID: req.body.studentID,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            mathlvl: req.body.mathlvl,
          }
        );
        if (updateStudent) {
          res
            .status(201)
            .send({ message: `Student ${req.body.studentID} is updated.` });
        } else {
          res
            .status(500)
            .send({ message: `Error updating Student: ${req.body.studentID}` });
        }
      }
    } else {
      res
        .status(500)
        .send({ message: 'Student ID does not exist in database.' });
    }
  })
);

studentRouter.put(
  '/removeStudent',
  expressAsyncHandler(async (req, res) => {
    const student = await Student.findOneAndDelete({
      studentID: req.body.studentID,
    });
    // remove student's checkins
    /*
    const removeCheckins = await Checkin.deleteMany({
      studentID: req.body.studentID,
    });
    */

    if (student) {
      res.status(201).send({
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

studentRouter.put(
  '/removeSemester',
  expressAsyncHandler(async (req, res) => {
    const student = await Student.findOneAndUpdate(
      {
        studentID: req.body.studentID,
      },
      {
        $pull: { enrolled: { $in: [req.body.semester] } },
      }
    );
    if (student) {
      res.status(201).send({
        message: `Semester ${req.body.semester} is removed.`,
      });
    } else {
      res.status(500).send({
        message: `Error in removing ${req.body.semester}.`,
      });
    }
  })
);

export default studentRouter;
