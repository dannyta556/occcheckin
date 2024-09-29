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
        let formatMins = '';
        let formatHours = '';
        formatMins = mins < 10 ? '0' + mins.toString() : mins.toString();
        formatHours = hours < 10 ? '0' + hours.toString() : hours.toString();
        let totalHrs = formatHours + ':' + formatMins;
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
    let formatID =
      req.params.studentID.charAt(0).toUpperCase() +
      req.params.studentID.slice(1);
    const student = await Student.findOne({ studentID: formatID });
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
    let formatID =
      req.body.studentID.charAt(0).toUpperCase() + req.body.studentID.slice(1);
    const student = await Student.findOne({ studentID: formatID });
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
      let formatFN =
        req.body.firstname.charAt(0).toUpperCase() +
        req.body.firstname.slice(1);
      let formatLN =
        req.body.lastname.charAt(0).toUpperCase() + req.body.lastname.slice(1);

      const newStudent = new Student({
        firstname: formatFN,
        lastname: formatLN,
        studentID: formatID,
        lastCheckin: getYesterday(),
        enrolled: enrolled,
        mathlvl: req.body.mathlvl,
      });
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
    let formatID =
      req.body.studentID.charAt(0).toUpperCase() + req.body.studentID.slice(1);
    const student = await Student.findOne({ studentID: formatID });
    const isAddSemester = req.body.type;

    if (student) {
      if (isAddSemester) {
        const updateStudent = await Student.findOneAndUpdate(
          {
            studentID: formatID,
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
        let formatFN =
          req.body.firstname.charAt(0).toUpperCase() +
          req.body.firstname.slice(1);
        let formatLN =
          req.body.lastname.charAt(0).toUpperCase() +
          req.body.lastname.slice(1);
        const updateStudent = await Student.findOneAndUpdate(
          {
            studentID: formatID,
          },
          {
            firstname: formatFN,
            lastname: formatLN,
            mathlvl: req.body.mathlvl,
          }
        );
        if (updateStudent) {
          res.status(201).send({ message: `Student ${formatID} is updated.` });
        } else {
          res
            .status(500)
            .send({ message: `Error updating Student: ${formatID}` });
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
    let formatID =
      req.body.studentID.charAt(0).toUpperCase() + req.body.studentID.slice(1);
    const student = await Student.findOneAndDelete({
      studentID: formatID,
    });
    // remove student's checkins

    const removeCheckins = await Checkin.deleteMany({
      studentID: req.body.studentID,
    });

    if (student && removeCheckins) {
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
    let formatID =
      req.body.studentID.charAt(0).toUpperCase() + req.body.studentID.slice(1);
    const student = await Student.findOneAndUpdate(
      {
        studentID: formatID,
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
