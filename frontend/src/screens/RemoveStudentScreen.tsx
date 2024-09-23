import SearchPage from '../components/SearchPage';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import { useState } from 'react';
import { Button, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getError } from '../utils';
function RemoveStudent() {
  const [id, setID] = useState('');
  type ButtonEvent = React.MouseEvent<HTMLFormElement>;
  const submitHandler = async (e: ButtonEvent) => {
    e.preventDefault();
    // check if id exists
    console.log(id);
    try {
      await axios
        .put('/api/students/removeStudent', {
          studentID: id,
        })
        .then((response) => {
          toast.success(response.data.message);
        });
    } catch (err) {
      toast.error(getError(err));
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
              onChange={(e) => setID((e.target as HTMLInputElement).value)}
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
