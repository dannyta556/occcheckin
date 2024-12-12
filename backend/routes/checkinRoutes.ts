import express from 'express';
import Checkin from '../models/checkinModel.ts';
import Student from '../models/studentModel.ts';
import {
  getTodayDate,
  getTodayTime,
  getSemester,
  getTotalHours,
  formatTime,
} from '../utils/dates.js';
import expressAsyncHandler from 'express-async-handler';

const checkinRouter = express.Router();

export interface ICheckin extends Document {
  studentID: string;
  date: string;
  semester: string;
  checkin: string;
  checkout: string;
  total: string;
}

checkinRouter.get(
  '/getStudentInfo/:studentID',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const semester = query.semester || '';
    let checkinList: ICheckin[] = [];
    if (semester == '') {
      checkinList = await Checkin.find({ studentID: req.params.studentID });
    } else {
      checkinList = await Checkin.find({
        studentID: req.params.studentID,
        semester: semester,
      });
    }
    let hours = 0;
    let mins = 0;
    if (checkinList.length > 0) {
      for (let j = 0; j < checkinList.length; ++j) {
        hours += parseInt(checkinList[j].total.split(':')[0]);
        mins += parseInt(checkinList[j].total.split(':')[1]);
      }
      let subHours = Math.floor(mins / 60);
      let subMins = mins % 60;
      hours = hours + subHours;
      mins = subMins;
    }
    let totalHrs = formatTime(mins, hours);

    const studentInfo = await Student.findOne({
      studentID: req.params.studentID,
    });

    if (checkinList && studentInfo) {
      res.status(201).send({
        checkins: checkinList,
        studentInfo: studentInfo,
        totalHours: totalHrs,
        response: true,
        message: 'Success',
      });
    } else {
      res.status(500).send({
        checkins: [],
        studentInfo: {},
        totalHrs: 0,
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
    let studentCheckinDate = 'undefined';
    if (thisStudent.lastCheckin) {
      studentCheckinDate = thisStudent.lastCheckin.split(' ')[0];
    }

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
    if (thisStudent) {
      let todayDate = getTodayDate('/');
      let lastCheckin: any = [];
      if (thisStudent.lastCheckin) {
        lastCheckin = thisStudent.lastCheckin.split(' ');
      } else {
        lastCheckin = [todayDate, '8:00'];
      }

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
        const checkoutTime = getTodayTime();
        const total = getTotalHours(lastCheckin[1], checkoutTime);

        const makeCheckout = new Checkin({
          studentID: studentID,
          date: todayDate,
          semester: currentSemester,
          checkin: lastCheckin.join(' '),
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
            message: `Error in checking out ${thisStudent.firstname} ${thisStudent.lastname} ID : ${thisStudent.studentID}`,
          });
        }
      }
    }
  })
);

export default checkinRouter;
