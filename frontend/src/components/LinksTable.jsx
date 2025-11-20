import React from 'react';
import { Link } from 'react-router-dom';

export default function LinksTable({ links = [], onDelete }) {
  return (
    <div className="card overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left">
            <th className="p-2">Short code</th>
            <th className="p-2">Target URL</th>
            <th className="p-2">Clicks</th>
            <th className="p-2">Last clicked</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {links.length === 0 && (
            <tr><td colSpan="5" className="p-4 text-gray-500">No links yet</td></tr>
          )}
          {links.map(link => (
            <tr key={link.code} className="border-t">
              <td className="p-2 font-mono"><a href={`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/${link.code}`} target="_blank" rel="noreferrer">{link.code}</a></td>
              <td className="p-2 max-w-[36ch] truncate">{link.targetUrl}</td>
              <td className="p-2">{link.totalClicks || 0}</td>
              <td className="p-2">{link.lastClicked ? new Date(link.lastClicked).toLocaleString() : '-'}</td>
              <td className="p-2 space-x-2">
                <Link className="text-sky-600 hover:underline" to={`/code/${link.code}`}>Stats</Link>
                <button onClick={() => onDelete(link.code)} className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
