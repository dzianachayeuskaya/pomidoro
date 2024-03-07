import React from 'react';
import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
      <h2>Nothing to see here!</h2>
      <p>404 - Page not found</p>
      <i style={{ cursor: 'pointer' }}>
        <Link to='/'>Go to the posts page</Link>
      </i>
    </div>
  );
}
