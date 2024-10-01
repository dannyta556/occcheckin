import express from 'express';
import Checkin from '../models/checkinModel.js';
import Student from '../models/studentModel.js';
import {
  getTodayDate,
  getTodayTime,
  getSemester,
  getTotalHours,
  checkValidDate,
} from '../utils/dates.js';
import expressAsyncHandler from 'express-async-handler';

const checkinRouter = express.Router();

checkinRouter.get(
  '/getStudentInfo/:studentID',
  expressAsyncHandler(async (req, res) => {
    const checkins = await Checkin.find({ studentID: req.params.studentID });

    const studentInfo = await Student.findOne({
      studentID: req.params.studentID,
    });

    if (checkins && studentInfo) {
      res.status(201).send({
        checkins: checkins,
        studentInfo: studentInfo,
        response: true,
        message: 'Success',
      });
    } else {
      res.status(500).send({
        checkins: [],
        studentInfo: {},
        response: false,
        message: `Error retrieving student info. Student ID ${req.params.studentID} may not be enrolled. Please contact the professor.`,
      });
    }
  })
);

// Make Checkin (maybe in student)
// check in time format: mm/dd/yyyy hh:mm
checkinRouter.post(
  '/checkin',
  expressAsyncHandler(async (req, res) => {
    const thisStudent = await Student.findOne({
      studentID: req.body.studentID,
    });
    if (!thisStudent) {
      res
        .status(500)
        .send({ message: `Student: ${req.body.studentID} not found.` });
      return;
    }
    let studentCheckinDate = thisStudent.lastCheckin.split(' ')[0];

    const thisSemester = getSemester(getTodayDate('/'));

    let isEnrolledThisSemester = false;
    for (let i = 0; i < thisStudent.enrolled.length; ++i) {
      if (thisSemester === thisStudent.enrolled[i]) {
        isEnrolledThisSemester = true;
      }
    }
    if (isEnrolledThisSemester === false) {
      res.status(500).send({
        message: `${thisStudent.firstname} ${thisStudent.lastname} is not enrolled in this semester, please contact the professor.`,
      });
    } else {
      if (
        thisStudent.isCheckedin === true &&
        studentCheckinDate === getTodayDate('/')
      ) {
        // student already is checked in
        res.status(500).send({
          response: false,
          message: `${thisStudent.firstname} ${thisStudent.lastname} is already checked in.`,
        });
      } else {
        const todayDate = getTodayDate('/');
        const todayTime = getTodayTime();
        const updateStudent = await Student.findOneAndUpdate(
          { studentID: thisStudent.studentID },
          { isCheckedin: true, lastCheckin: todayDate + ' ' + todayTime }
        );
        if (updateStudent) {
          res.send({
            message: `${updateStudent.firstname} ${updateStudent.lastname} has checked in at
          ${todayDate} ${todayTime}.`,
          });
        } else {
          res.status(500).send({
            message: `Error checking in ID: ${thisStudent.studentID}`,
          });
        }
      }
    }
  })
);
// Checkout
// need last checkin time from student
checkinRouter.post(
  '/checkout',
  expressAsyncHandler(async (req, res) => {
    const thisStudent = await Student.findOne({
      studentID: req.body.studentID,
    });
    const todayDate = getTodayDate('/');
    let lastCheckin = thisStudent.lastCheckin.split(' ');
    let currentSemester = getSemester(todayDate);
    if (
      thisStudent.isCheckedin === false ||
      todayDate !== lastCheckin[0] ||
      currentSemester === 'none'
    ) {
      res.status(500).send({
        message: `${thisStudent.firstname} ${thisStudent.lastname} is not checked in or is not checked in during a school semester.`,
      });
    } else {
      const studentID = req.body.studentID;

      // split time from thisStudent.lastCheckin
      let checkin = thisStudent.lastCheckin;
      let checkinTime = checkin.split(' ')[1];
      const checkoutTime = getTodayTime();
      const total = getTotalHours(checkinTime, checkoutTime);

      const makeCheckout = new Checkin({
        studentID: studentID,
        date: todayDate,
        semester: currentSemester,
        checkin: checkin,
        checkout: todayDate + ' ' + checkoutTime,
        total: total,
      });

      const saveCheckout = await makeCheckout.save();
      if (saveCheckout) {
        const updateCheckout = await Student.findOneAndUpdate(
          { studentID: thisStudent.studentID },
          {
            isCheckedin: false,
          }
        );
        if (updateCheckout) {
          res.status(201).send({
            message: `${updateCheckout.firstname} ${updateCheckout.lastname} has checked out at ${saveCheckout.checkout}`,
          });
        }
      } else {
        res.status(500).send({
          message: `Error in checking out ${saveCheckout.firstname} ${saveCheckout.lastname} ID : ${saveCheckout.studentID}`,
        });
      }
    }
  })
);

export default checkinRouter;
