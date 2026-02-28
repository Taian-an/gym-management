'use client';
import { useState, useEffect } from 'react';

interface Member { _id: string; name: string; phone: string; }

export default function MemberPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchData = async () => {
    const res = await fetch('/api/members');
    const result = await res.json();
    if (result.success) setMembers(result.data);
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const body = editingId ? { id: editingId, name, phone } : { name, phone };
    const res = await fetch('/api/members', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if ((await res.json()).success) {
      setName(''); setPhone(''); setEditingId(null); fetchData();
    }
  };

  const startEdit = (m: Member) => {
    setEditingId(m._id); setName(m.name); setPhone(m.phone);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return;
    await fetch(`/api/members?id=${id}`, { method: 'DELETE' });
    fetchData();
  };

  return (
    <div className="p-8 max-w-2xl mx-auto text-black">
      <h1 className="text-2xl font-bold mb-6">Member Management</h1>
      <form onSubmit={handleSubmit} className={`mb-8 space-y-4 p-6 rounded-lg shadow ${editingId ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50'}`}>
        <h2 className="font-bold">{editingId ? 'Edit Member' : 'Add Member'}</h2>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full p-2 border rounded bg-white" required />
        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="w-full p-2 border rounded bg-white" required />
        <div className="flex gap-2">
          <button type="submit" className={`flex-1 text-white py-2 rounded font-bold ${editingId ? 'bg-green-700' : 'bg-green-600'}`}>{editingId ? 'Update' : 'Save'}</button>
          {editingId && <button onClick={() => {setEditingId(null); setName(''); setPhone('');}} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>}
        </div>
      </form>
      <ul className="space-y-3">
        {members.map((m) => (
          <li key={m._id} className="p-4 border flex justify-between items-center bg-white shadow-sm rounded">
            <div><p className="font-bold">{m.name}</p><p className="text-gray-500 text-sm">{m.phone}</p></div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(m)} className="text-green-600 font-bold text-sm">Edit</button>
              <button onClick={() => handleDelete(m._id)} className="text-red-500 font-bold text-sm">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}