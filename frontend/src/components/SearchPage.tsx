import occlogo from '../images/occlogo.png';
import { Link } from 'react-router-dom';

interface altMap {
  [key: string]: string | undefined;
}
const altToPage: altMap = {
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
        <img className="bg-header" src={occlogo} alt="occlogo" />
      </div>
    </div>
  );
}
