'use client';
import { useState, useEffect } from 'react';

const CATEGORIES = [
  "Cardio", "Hyrox", "Weight Training", "Meditation", 
  "Boxing", "Pilates", "Spinning", "Stretching","Yoga",
  "CrossFit", "Zumba", "Aerobics", "Calisthenics", "TRX", "Kettlebell", "Functional Training"
];

interface Coach { _id: string; name: string; }
interface Course { 
  _id: string; 
  title: string; 
  capacity: number; 
  time: string; 
  coachId?: { _id: string, name: string }; 
  enrolledCount?: number; 
}

export default function CoursePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [capacity, setCapacity] = useState(10);
  const [selectedCoach, setSelectedCoach] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [couRes, coaRes] = await Promise.all([fetch('/api/courses'), fetch('/api/coaches')]);
      const couData = await couRes.json();
      const coaData = await coaRes.json();
      if (couData.success) setCourses(couData.data);
      if (coaData.success) setCoaches(coaData.data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchData(); }, []);

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleString('zh-TW', { 
      year: 'numeric', month: '2-digit', day: '2-digit', 
      hour: '2-digit', minute: '2-digit', hour12: false 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { 
      ...(editingId && { id: editingId }), 
      title, 
      capacity, 
      time,
      coachId: selectedCoach || null 
    };

    try {
      const res = await fetch('/api/courses', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const result = await res.json();
      if (result.success) {
        resetForm();
        fetchData();
      } else {
        alert("Save failed: " + result.error);
      }
    } catch (error) {
      alert("Network error, please check console.");
    }
  };

  const resetForm = () => {
    setEditingId(null); setTitle(''); setSelectedCoach(''); setCapacity(10); setTime('');
  };

  const startEdit = (c: Course) => {
    setEditingId(c._id);
    setTitle(c.title);
    setCapacity(c.capacity);
    const formattedTime = c.time ? new Date(c.time).toISOString().slice(0, 16) : '';
    setTime(formattedTime);
    setSelectedCoach(c.coachId?._id || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-8 max-w-2xl mx-auto text-black">
      <h1 className="text-2xl font-bold mb-6">Course Management</h1>
      
      <form onSubmit={handleSubmit} className={`mb-8 space-y-4 p-6 rounded-lg shadow-md border ${editingId ? 'bg-purple-50 border-purple-200' : 'bg-white border-gray-100'}`}>
        <h2 className="font-bold text-lg mb-4">{editingId ? 'Edit Course Details' : 'Schedule New Course'}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 課程類型 */}
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-700">Course Type</label>
            <select value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded bg-white text-black h-[42px]" required>
              <option value="">-- Select --</option>
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          {/* 時間選擇器 */}
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-700">Date & Time</label>
            <input 
              type="datetime-local" 
              value={time} 
              onChange={(e) => setTime(e.target.value)} 
              className="w-full p-2 border rounded bg-white text-black h-[42px]" 
              required 
            />
          </div>

          {/* 教練選擇 - 補回的部分 */}
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-700">Assign Coach</label>
            <select 
              value={selectedCoach} 
              onChange={(e) => setSelectedCoach(e.target.value)} 
              className="w-full p-2 border rounded bg-white text-black h-[42px]"
            >
              <option value="">-- No Coach Assigned --</option>
              {coaches.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* 人數上限 */}
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-700">Capacity</label>
            <input 
              type="number" 
              value={capacity} 
              onChange={(e) => setCapacity(Number(e.target.value))} 
              className="w-full p-2 border rounded bg-white text-black h-[42px]" 
              min="1"
              required 
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button type="submit" className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-bold hover:bg-purple-700 transition-all shadow-sm">
            {editingId ? 'Update Course' : 'Create Course'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="bg-gray-400 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-500">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* 課程列表 */}
      <h2 className="text-xl font-bold mb-4">Course List</h2>
      <ul className="space-y-3">
        {courses.map((c) => (
          <li key={c._id} className="p-4 border flex justify-between items-center bg-white shadow-sm rounded-xl hover:shadow-md transition-shadow">
            <div>
              <p className="font-bold text-lg text-black">{c.title}</p>
              <p className="text-sm text-gray-500 font-medium">📅 {formatDisplayDate(c.time)}</p>
              <p className="text-blue-600 text-xs mt-1 font-bold bg-blue-50 inline-block px-2 py-0.5 rounded">
                Coach: {c.coachId?.name || 'Unassigned'}
              </p>
              <p className="text-[10px] text-gray-400 mt-1 ml-1">
                Slots: {c.enrolledCount || 0} / {c.capacity}
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => startEdit(c)} className="text-purple-600 font-bold text-sm hover:text-purple-800 underline decoration-2">Edit</button>
              <button onClick={async () => { if(confirm('Delete this course?')){ await fetch(`/api/courses?id=${c._id}`, {method:'DELETE'}); fetchData(); } }} className="text-red-500 font-bold text-sm hover:text-red-700">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}