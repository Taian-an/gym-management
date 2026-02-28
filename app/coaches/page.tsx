'use client';
import { useState, useEffect } from 'react';

const CATEGORIES = [
  "Cardio", "Hyrox", "Weight Training", "Meditation", 
  "Boxing", "Pilates", "Spinning", "Stretching","Yoga"
  ,"CrossFit", "Zumba", "Aerobics", "Calisthenics", "TRX", "Kettlebell", "Functional Training"
];

interface Coach {
  _id: string;
  name: string;
  expertise: string[]; // 修改為陣列
}

export default function CoachPage() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [name, setName] = useState('');
  const [expertise, setExpertise] = useState<string[]>([]); // 修改為陣列
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null); 

  const fetchCoaches = async () => {
    const res = await fetch('/api/coaches');
    const result = await res.json();
    if (result.success) setCoaches(result.data);
  };

  useEffect(() => { fetchCoaches(); }, []);

  // 處理 Checkbox 切換邏輯
  const handleToggleExpertise = (cat: string) => {
    setExpertise(prev => 
      prev.includes(cat) 
        ? prev.filter(item => item !== cat) // 已選中則移除
        : [...prev, cat] // 未選中則加入
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (expertise.length === 0) return alert("Please select at least one expertise!");
    setLoading(true);

    const method = editingId ? 'PUT' : 'POST';
    const body = editingId ? { id: editingId, name, expertise } : { name, expertise };

    try {
      const res = await fetch('/api/coaches', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await res.json();
      if (result.success) {
        resetForm();
        fetchCoaches();
      }
    } catch (error) {
      alert('Action failed');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setExpertise([]);
    setEditingId(null);
  };

  const startEdit = (coach: Coach) => {
    setEditingId(coach._id);
    setName(coach.name);
    // 確保編輯時傳入的是陣列
    setExpertise(Array.isArray(coach.expertise) ? coach.expertise : [coach.expertise]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    await fetch(`/api/coaches?id=${id}`, { method: 'DELETE' });
    fetchCoaches();
  };

  return (
    <div className="p-8 max-w-2xl mx-auto text-black">
      <h1 className="text-2xl font-bold mb-6">Coach Management</h1>

      <form onSubmit={handleSubmit} className={`mb-8 space-y-4 p-6 rounded-lg shadow ${editingId ? 'bg-yellow-50 border-2 border-yellow-200' : 'bg-gray-50'}`}>
        <h2 className="font-bold text-lg">{editingId ? 'Edit Coach Mode' : 'Add New Coach'}</h2>
        
        <div>
          <label className="block text-sm font-medium mb-1">Coach Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="e.g. John Doe" 
            className="w-full p-2 border rounded bg-white text-black" 
            required 
          />
        </div>

        {/* 改為 Checkbox 多選介面 */}
        <div>
          <label className="block text-sm font-medium mb-2">Expertise (Select Multiple)</label>
          <div className="grid grid-cols-2 gap-2 bg-white p-3 border rounded">
            {CATEGORIES.map(cat => (
              <label key={cat} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition">
                <input
                  type="checkbox"
                  checked={expertise.includes(cat)}
                  onChange={() => handleToggleExpertise(cat)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm">{cat}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="flex gap-2">
          <button type="submit" disabled={loading} className={`flex-1 text-white py-2 rounded font-bold transition ${editingId ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {loading ? 'Saving...' : editingId ? 'Update Coach' : 'Add Coach'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="bg-gray-400 text-white px-4 py-2 rounded font-bold">Cancel</button>
          )}
        </div>
      </form>

      <ul className="space-y-3">
        {coaches.map((c) => (
          <li key={c._id} className="p-4 border flex justify-between items-center bg-white shadow-sm rounded">
            <div>
              <p className="font-bold text-lg">{c.name}</p>
              {/* 顯示多個標籤 */}
              <div className="flex flex-wrap gap-1 mt-1">
                {Array.isArray(c.expertise) ? (
                  c.expertise.map(exp => (
                    <span key={exp} className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                      {exp}
                    </span>
                  ))
                ) : (
                  <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">{c.expertise}</span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(c)} className="bg-blue-50 text-blue-600 px-3 py-1 rounded text-sm font-bold hover:bg-blue-100">Edit</button>
              <button onClick={() => handleDelete(c._id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm font-bold">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}