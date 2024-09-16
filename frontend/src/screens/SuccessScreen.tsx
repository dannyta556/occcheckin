import SearchPage from '../components/SearchPage';
import SuccessMessage from '../components/SuccessMessage';

function SuccessScreen() {
  return (
    <div>
      <SearchPage title="Success" altpage="home" />
      <SuccessMessage
        type={1}
        firstName={'John'}
        lastName={'Doe'}
        time={'13:00'}
      />
    </div>
  );
}

export default SuccessScreen;
