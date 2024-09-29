import occlogo from '../images/occlogoclear.png';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

interface altMap {
  [key: string]: string | undefined;
}
const altToPage: altMap = {
  login: '/login',
  admin: '/admin',
  home: '/',
};
export default function SearchPage({
  title,
  altpage,
}: {
  title: string;
  altpage: string;
}) {
  return (
    <div className="App">
      <header className="main-header">
        <h1 className="title">{title}</h1>
      </header>
      <Link to={`${altToPage[altpage]}`}>
        <div className="top-right">{altpage}</div>
      </Link>
      <div>
        <img className="bg-header top-left" src={occlogo} alt="occlogo" />
      </div>
      <ToastContainer position="bottom-center" limit={1} />
    </div>
  );
}
