import SearchPage from '../components/SearchPage';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import { Button, InputGroup } from 'react-bootstrap';
function RemoveStudent() {
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
      <SearchPage title="Admin Remove Student" altpage="admin" />

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
      </div>
    </div>
  );
}
export default RemoveStudent;
