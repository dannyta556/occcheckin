import occlogo from '../images/occlogo.png';

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
      <div className="top-right">{altpage}</div>
      <div>
        <img className="bg-header" src={occlogo} alt="occlogo" />
      </div>
    </div>
  );
}
