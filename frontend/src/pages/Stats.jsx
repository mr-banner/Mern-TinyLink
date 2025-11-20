import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';

export default function Stats() {
  const { code } = useParams();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const resp = await api.get(`/links/${code}`);
        setLink(resp.data);
      } catch (err) {
        setLink(null);
      } finally { setLoading(false); }
    }
    load();
  }, [code]);

  if (loading) return <div className="card">Loading...</div>;
  if (!link) return <div className="card">Link not found</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Stats: {link.code}</h1>
      <div className="card space-y-3">
        <div><strong>Short URL:</strong> <a className="text-sky-600" href={`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/${link.code}`} target="_blank" rel="noreferrer">{`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/${link.code}`}</a></div>
        <div><strong>Target:</strong> {link.targetUrl}</div>
        <div><strong>Total clicks:</strong> {link.totalClicks || 0}</div>
        <div><strong>Last clicked:</strong> {link.lastClicked ? new Date(link.lastClicked).toLocaleString() : '-'}</div>
        <div><strong>Created at:</strong> {new Date(link.createdAt).toLocaleString()}</div>
      </div>
    </div>
  );
}
