'use client';
import { useState, useEffect } from 'react';

interface Member {
  _id: string;
  name: string;
  phone: string;
}

export default function MemberPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchMembers = async () => {
    const res = await fetch('/api/members');
    const result = await res.json();
    if (result.success) setMembers(result.data);
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchMembers(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone }),
    });
    if ((await res.json()).success) {
      setName(''); setPhone(''); fetchMembers();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this member?')) return;
    const res = await fetch(`/api/members?id=${id}`, { method: 'DELETE' });
    if ((await res.json()).success) fetchMembers();
  };

  return (
    <div className="p-8 max-w-2xl mx-auto text-black">
      <h1 className="text-2xl font-bold mb-6">Member Management</h1>
      <form onSubmit={handleSubmit} className="mb-8 space-y-4 bg-gray-50 p-6 rounded-lg shadow">
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full p-2 border rounded bg-white" required />
        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="w-full p-2 border rounded bg-white" required />
        <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 rounded font-bold">{loading ? 'Saving...' : 'Add Member'}</button>
      </form>
      <ul className="space-y-3">
        {members.map((m) => (
          <li key={m._id} className="p-4 border flex justify-between items-center bg-white shadow-sm rounded">
            <div><p className="font-bold">{m.name}</p><p className="text-gray-500 text-sm">{m.phone}</p></div>
            <button onClick={() => handleDelete(m._id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm font-bold">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}