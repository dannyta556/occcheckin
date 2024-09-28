import { useState } from 'react';
import SearchPage from '../components/SearchPage';
import { Button, InputGroup } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function AdminLoginScreen() {
  const navigate = useNavigate();
  const redirect = '/admin';
  const [pass, setPass] = useState('');
  type ButtonEvent = React.MouseEvent<HTMLFormElement>;
  const checkPassword = async (e: ButtonEvent) => {
    e.preventDefault();
    if (pass !== 'password') {
      toast.error('Incorrect Password');
      return;
    }
    navigate(redirect);
  };
  return (
    <div className="App">
      <SearchPage title="Admin Login" altpage="home" />
      <div>
        <Form
          className="search-box"
          autoComplete="off"
          onSubmit={checkPassword}
        >
          <InputGroup>
            <FormControl
              type="text"
              placeholder="Enter Password"
              onChange={(e) => {
                setPass((e.target as HTMLInputElement).value);
              }}
            ></FormControl>
            <Button
              variant={'outline-primary'}
              disabled={!pass}
              type="submit"
              id="button-search"
            >
              Continue
            </Button>
          </InputGroup>
        </Form>
      </div>
    </div>
  );
}

export default AdminLoginScreen;
