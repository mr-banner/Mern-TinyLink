import React, { useEffect, useState } from 'react';
import LinkForm from '../components/LinkForm';
import LinksTable from '../components/LinksTable';
import { api } from '../services/api';

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const resp = await api.get('/links');
      setLinks(resp.data);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchLinks(); }, []);

  const handleCreated = () => {
    fetchLinks();
  };

  const handleDelete = async (code) => {
    if (!confirm('Delete this link?')) return;
    try {
      await api.delete(`/links/${code}`);
      setLinks(prev => prev.filter(l => l.code !== code));
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <LinkForm onCreated={handleCreated} />
      <h2 className="text-lg font-medium mb-2">All links</h2>
      {loading ? <div className="card">Loading...</div> :
        <LinksTable links={links} onDelete={handleDelete} />}
    </div>
  );
}
