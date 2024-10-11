import SearchPage from '../components/SearchPage';
import { Link, useParams } from 'react-router-dom';
import { useReducer, useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { toast } from 'react-toastify';
import { getError, createReducer, handleChange } from '../utils';
import axios from 'axios';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Button } from 'react-bootstrap';

const studentReducer = createReducer();

function StudentScreen() {
  const params = useParams();
  const [semester, setSemester] = useState('');
  const { studentID } = params;
  let [{ loading, error, checkins, studentInfo, totalHours }, dispatch] =
    useReducer(studentReducer, {
      checkins: [],
      studentInfo: {},
      totalHours: 0,
      loading: true,
      error: '',
    });

  const exportStudentCheckin = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Date,Semester,Check-in,Check-out,Total\r\n';
    checkins.forEach(function (checkin: any) {
      let row =
        checkin.date +
        ',' +
        checkin.semester +
        ',' +
        checkin.checkin.split(' ')[1] +
        ',' +
        checkin.checkout.split(' ')[1] +
        ',' +
        checkin.total +
        '\r\n';
      csvContent += row;
    });
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement('a');
    if (link.download !== undefined) {
      link.setAttribute('href', encodedUri);
      let semesterName = `${semester}` !== '' ? `${semester}` : 'All';
      link.setAttribute(
        'download',
        `${studentInfo.firstname}_${studentInfo.lastname}_data_${semesterName}.csv`
      );
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        console.log(semester);
        await axios
          .get(`/api/checkin/getStudentInfo/${studentID}?semester=${semester}`)
          .then((response) => {
            dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
          });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err });
        toast.error(getError(err));
      }
    };
    fetchData();
  }, [studentID, semester]);

  return loading ? (
    <div>
      <SearchPage title="Loading Student" altpage="admin" />
      <LoadingBox />
    </div>
  ) : error ? (
    <div>
      <SearchPage title="Error" altpage="admin" />
      <MessageBox variant="danger">{error}</MessageBox>
    </div>
  ) : (
    <div className="">
      <SearchPage
        title={`${studentInfo.firstname} ${studentInfo.lastname}`}
        altpage="admin"
      />
      <div className="center-text">
        <Link
          className="center-text"
          to={`/admin/editStudent/${studentInfo.studentID}`}
        >
          Edit Info
        </Link>
        <div className="border-box center-content">
          <div className="border-item">
            <span className="bold-text">ID:</span> {studentID}
          </div>
          <div className="border-item">
            <span className="bold-text">Math Level:</span> {studentInfo.mathlvl}
          </div>
          <div className="border-item bold-text">Enrolled</div>
          <div className="last-item">
            {studentInfo.enrolled.map((semester: string) => {
              return (
                <div className="border-item" key={semester}>
                  {semester}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="table-options center-content center-text">
        <select
          className="dropdown table-option"
          id="semester"
          value={semester}
          onChange={handleChange(setSemester)}
        >
          <option value={''}>All</option>
          {studentInfo.enrolled.map((s: string) => {
            return (
              <option key={s} value={s}>
                {s}
              </option>
            );
          })}
        </select>
        <span className="table-option total-hr-visual bold-text">
          Total Hours: {totalHours}
        </span>
        <Button
          className="table-option btn-export bold-text"
          onClick={exportStudentCheckin}
        >
          Export
        </Button>
      </div>
      <Table className="student-table center-box-container">
        <thead>
          <tr>
            <th>Date</th>
            <th>Semester</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {checkins.map((checkin: any) => {
            return (
              <tr key={checkin._id.toString()}>
                <td>{checkin.date}</td>
                <td>{checkin.semester}</td>
                <td>{checkin.checkin.split(' ')[1]}</td>
                <td>{checkin.checkout.split(' ')[1]}</td>
                <td>{checkin.total}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <div className="space"></div>
    </div>
  );
}

export default StudentScreen;
