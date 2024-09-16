import { Button, InputGroup } from 'react-bootstrap';
import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import SearchPage from '../components/SearchPage';

function HomeScreen() {
  const [noIDFound, setNoIDFound] = useState(false);
  const [idFound, setIdFound] = useState(true);

  type ButtonEvent = React.MouseEvent<HTMLFormElement>;
  const submitHandler = (e: ButtonEvent) => {
    e.preventDefault();
    // check if id exists
    let exists = false;
    if (exists) {
      // show check-in and check-out buttons
    } else {
      // show error
    }
  };
  return (
    <div className="App">
      <SearchPage title="LRNG 051N Student Check-in" altpage="admin" />
      <div>
        <Form className="search-box" onSubmit={submitHandler}>
          <InputGroup>
            <FormControl
              type="text"
              name="q"
              id="q"
              placeholder="Enter Student ID"
              aria-label="Search Student"
            ></FormControl>
            <Button variant="outline-primary" type="submit" id="button-search">
              Continue
            </Button>
          </InputGroup>
        </Form>
        {idFound === true ? (
          <div className="center-box">
            <div className="search-result">ID: C392432</div>
            <div className="search-result">First Name: John </div>
            <div className="search-result last-item">Last Name: Doe </div>
            <Button variant="standard">Check-in</Button>
            <Button variant="standard">Check-out</Button>
          </div>
        ) : (
          <></>
        )}
        {noIDFound === false ? (
          <></>
        ) : (
          <div className="error-message">
            This ID does not exist, please try again or ask the professor
          </div>
        )}
      </div>
    </div>
  );
}
export default HomeScreen;
