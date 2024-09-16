import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

export default function SuccessMessage({
  type,
  firstName,
  lastName,
  time,
  mathLevel,
  id,
}: {
  type: number;
  firstName: string;
  lastName: string;
  time?: string;
  mathLevel?: string;
  id?: string;
}) {
  // 1 = Check in success
  // 2 = Check out success
  // 3 = Add Student success
  // 4 = Remove Student success
  return (
    <div className="center-box">
      {type === 1 ? (
        <div className="center-box">
          <div className="center-box center-text success-text">
            Check in Success!
          </div>
          <div className="center-box center-text success-text">
            {firstName} {lastName} checked in at {time}
          </div>
        </div>
      ) : (
        <></>
      )}
      {type === 2 ? (
        <div className="center-box">
          <div className="center-box center-text success-text">
            Check out Success!
          </div>
          <div className="center-box center-text success-text">
            {firstName} {lastName} checked out at {time}
          </div>
        </div>
      ) : (
        <></>
      )}
      {type === 3 ? (
        <div>
          <div className="center-box center-text success-text">
            Add Student Success!{' '}
          </div>
          <div className="center-box center-text success-text">
            First Name: {firstName}{' '}
          </div>
          <div className="center-box center-text success-text">
            Last Name: {lastName}{' '}
          </div>
          <div className="center-box center-text success-text">
            Math Class: {mathLevel}{' '}
          </div>
          <div className="center-box center-text success-text">ID: {id} </div>
        </div>
      ) : (
        <></>
      )}
      {type === 4 ? (
        <div>
          <div>Remove Student Success! </div>
          <div>First Name: {firstName} </div>
          <div>Last Name: {lastName} </div>
          <div>Math Class: {mathLevel} </div>
          <div>ID: {id} </div>
        </div>
      ) : (
        <></>
      )}
      <div className="center-item center-box-container">
        <Link to="/">
          <Button variant="standard">Home</Button>
        </Link>
      </div>
    </div>
  );
}
