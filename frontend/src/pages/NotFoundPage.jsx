import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>404 – Page not found</h2>
      <Link to="/login">Go to login</Link>
    </div>
  );
}

export default NotFoundPage;
