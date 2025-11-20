import React, { useState } from 'react';
import { api } from '../services/api';

export default function LinkForm({ onCreated }) {
  const [targetUrl, setTargetUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const resp = await api.post('/links', { targetUrl, customCode: customCode || undefined });
      setTargetUrl('');
      setCustomCode('');
      onCreated && onCreated(resp.data);
    } catch (err) {
      if (err.response?.data?.message) setError(err.response.data.message);
      else setError('Unable to create link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="card mb-4 space-y-3">
      <div>
        <label className="block text-sm font-medium mb-1">Long URL</label>
        <input value={targetUrl} onChange={e=>setTargetUrl(e.target.value)} className="w-full border px-3 py-2 rounded" placeholder="https://example.com/very/long/path" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Custom code (optional)</label>
        <input value={customCode} onChange={e=>setCustomCode(e.target.value)} className="w-1/2 border px-3 py-2 rounded" placeholder="6-8 chars, alphanumeric" />
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div className="flex items-center gap-2">
        <button disabled={loading} className={`btn btn-primary ${loading ? 'opacity-70' : ''}`}>{loading ? 'Creating...' : 'Create'}</button>
        <button type="button" onClick={() => { setTargetUrl(''); setCustomCode(''); setError(null); }} className="btn">Reset</button>
      </div>
    </form>
  );
}
