import express from 'express';
import Student from '../models/studentModel.ts';
import Checkin from '../models/checkinModel.ts';
import { ICheckin } from './checkinRoutes.ts';
import expressAsyncHandler from 'express-async-handler';
import { getYesterday, sortSemesters, formatTime } from '../utils/dates.ts';

const studentRouter = express.Router();

interface IStudent extends Document {
  firstname: string;
  lastname: string;
  studentID: string;
  enrolled: string;
  mathlvl: string;
  lastCheckin: string;
  isCheckedin: string;
}

studentRouter.get(
  '/getStudentList',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const semester = query.semester || '';
    let studentList: IStudent[] = [];
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
        let checkins: ICheckin[] = await Checkin.find({
          studentID: studentList[i].studentID,
        });

        if (checkins) {
          // loop through every checkin and add it's hours and mins
          for (let j = 0; j < checkins.length; ++j) {
            if (checkins[j].total) {
              hours += parseInt(checkins[j].total.split(':')[0]);
              mins += parseInt(checkins[j].total.split(':')[1]);
            }
          }
          let subHours = Math.floor(mins / 60);
          let subMins = mins % 60;
          hours = hours + subHours;
          mins = subMins;
        }

        studentTotalHrs[studentList[i].studentID] = formatTime(mins, hours);
      }
    }
    let sortedSemesters = sortSemesters(semesterList[0].uniqueEnrolled);
    if (studentList && semesterList) {
      res.status(201).send({
        students: studentList,
        semesters: sortedSemesters,
        studentTotalHrs: studentTotalHrs,
        message: 'Success',
      });
    } else {
      res.status(500).send({
        students: [],
        semesters: semesterList,
        studentTotalHrs: studentTotalHrs,
        message: 'Error in retrieving student list.',
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
      res.send({ student: student, message: `Student ${formatID} exists` });
    } else {
      res
        .status(401)
        .send({ student: {}, message: `Student ${formatID} not found` });
    }
  })
);

studentRouter.post(
  '/addStudent',
  expressAsyncHandler(async (req, res) => {
    let formatID =
      req.body.studentID.charAt(0).toUpperCase() + req.body.studentID.slice(1);
    const student = await Student.findOne({ studentID: formatID });
    let mathlvl = req.body.mathlvl;
    if (student) {
      // student exists, just add new semester to student, update mathlvl
      mathlvl = student.mathlvl;
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
        res.status(201).send({ message: `Student ${formatID} is updated` });
      } else {
        res.status(500).send({
          message: `Failed to update student ${formatID}`,
        });
      }
    } else {
      // create a new student
      let enrolled: string[] = [];
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
          message: `Student: ${req.body.studentID}, ${req.body.firstname} ${req.body.lastname} saved to the database`,
        });
      } else {
        res.status(500).send({
          message: `Failed to save student ${req.body.studentID} to database.`,
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
            .send({ message: `Student: ${req.body.studentID} is updated.` });
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
      res.status(500).send({
        message: `Student ID: ${formatID} does not exist in the database.`,
      });
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
      studentID: formatID,
    });

    if (student && removeCheckins) {
      res.status(201).send({
        message: `Student ID: ${req.body.studentID} is deleted.`,
      });
    } else {
      res.status(500).send({
        message: `Student ID: ${req.body.studentID} does not exist.`,
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
