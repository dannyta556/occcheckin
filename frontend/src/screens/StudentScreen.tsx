import SearchPage from '../components/SearchPage';
import { Link, useParams } from 'react-router-dom';
import { useReducer, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { toast } from 'react-toastify';
import { getError, createReducer } from '../utils';
import axios from 'axios';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

const studentReducer = createReducer();

function StudentScreen() {
  const params = useParams();
  const { studentID } = params;
  let [{ loading, error, checkins, studentInfo }, dispatch] = useReducer(
    studentReducer,
    {
      checkins: [],
      studentInfo: {},
      loading: true,
      error: '',
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        await axios
          .get(`/api/checkin/getStudentInfo/${studentID}`)
          .then((response) => {
            dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
          });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err });
        toast.error(getError(err));
      }
    };
    fetchData();
  }, [studentID]);

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
    <div className="center-text">
      <SearchPage
        title={`${studentInfo.firstname} ${studentInfo.lastname}`}
        altpage="admin"
      />
      <Link to={`/admin/editStudent/${studentInfo.studentID}`}>Edit Info</Link>
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

      <Table className="student-table center-box-container ">
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
    </div>
  );
}

export default StudentScreen;
