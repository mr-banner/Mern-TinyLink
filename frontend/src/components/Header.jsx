import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-5xl mx-auto p-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold">TinyLink</Link>
      </div>
    </header>
  );
}
