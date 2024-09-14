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
    <div>
      {type === 1 ? (
        <div>
          <div>Check in Success!</div>
          <div>
            {' '}
            {firstName} {lastName} chcecked in at {time}
          </div>
        </div>
      ) : (
        <></>
      )}
      {type === 2 ? (
        <div>
          <div>Check out Success!</div>
          <div>
            {firstName} {lastName} chcecked out at {time}
          </div>
        </div>
      ) : (
        <></>
      )}
      {type === 3 ? (
        <div>
          <div>Add Student Success! </div>
          <div>First Name: {firstName} </div>
          <div>Last Name: {lastName} </div>
          <div>Math Class: {mathLevel} </div>
          <div>ID: {id} </div>
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
    </div>
  );
}
