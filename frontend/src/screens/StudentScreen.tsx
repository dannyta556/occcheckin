import SearchPage from '../components/SearchPage';
import { Link, useParams } from 'react-router-dom';
import { useReducer, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';

const exampleInfo = {
  id: 'C012839231',
  MathLvl: 'Math 160',
};
const exampleCheckins = [
  {
    id: 1,
    date: '08-18-2024',
    semester: 'Fall 2024',
    checkin: '08:24',
    checkout: '12:24',
    total: '4:00',
  },
  {
    id: 2,
    date: '08-17-2024',
    semester: 'Fall 2024',
    checkin: '13:30',
    checkout: '16:00',
    total: '2:30',
  },
];

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        checkins: action.payload.checkins,
        studentInfo: action.payload.studentInfo,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function StudentScreen(props: any) {
  const params = useParams();
  const { studentID } = params;
  let [{ loading, error, checkins, studentInfo }, dispatch] = useReducer(
    reducer,
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
    </div>
  ) : error ? (
    <div>
      <SearchPage title="Error" altpage="admin" />
    </div>
  ) : (
    <div className="center-text center-content">
      <SearchPage
        title={`${studentInfo.firstname} ${studentInfo.lastname}`}
        altpage="admin"
      />
      <Link to="/editStudent">Edit Info</Link>
      <div>ID: {studentID}</div>
      <div>Math Level: {studentInfo.mathlvl}</div>
      <div>Enrolled</div>
      <div>
        {studentInfo.enrolled.map((semester: string) => {
          return <div>{semester}</div>;
        })}
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
              <tr key={checkin._id}>
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
