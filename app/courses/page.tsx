'use client';
import { useState, useEffect } from 'react';

// 定義教練基本資料介面
interface Coach { 
  _id: string; 
  name: string; 
}

// 定義課程介面，將 coachId 定義為物件結構以配合 populate 
interface Course {
  enrolledCount: number; 
  _id: string; 
  title: string; 
  capacity: number; 
  coachId?: {
    _id: string;
    name: string;
  }; 
}

export default function CoursePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [title, setTitle] = useState('');
  const [capacity, setCapacity] = useState(10);
  const [selectedCoach, setSelectedCoach] = useState('');

  const fetchData = async () => {
    try {
      const [couRes, coaRes] = await Promise.all([fetch('/api/courses'), fetch('/api/coaches')]);
      const couData = await couRes.json();
      const coaData = await coaRes.json();
      if (couData.success) setCourses(couData.data);
      if (coaData.success) setCoaches(coaData.data);
    } catch (error: unknown) {
      console.error("Failed to fetch data:", error);
    }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, capacity, coachId: selectedCoach || null }),
      });
      setTitle(''); 
      setSelectedCoach(''); 
      fetchData();
    } catch (error: unknown) {
      alert("Failed to add course");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this course?')) return;
    try {
      await fetch(`/api/courses?id=${id}`, { method: 'DELETE' });
      fetchData();
    } catch (error: unknown) {
      alert("Delete failed");
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto text-black">
      <h1 className="text-2xl font-bold mb-6">Course Management</h1>
      <form onSubmit={handleSubmit} className="mb-8 space-y-4 bg-gray-50 p-6 rounded-lg shadow">
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Title" 
          className="w-full p-2 border rounded bg-white text-black" 
          required 
        />
        <select 
          value={selectedCoach} 
          onChange={(e) => setSelectedCoach(e.target.value)} 
          className="w-full p-2 border rounded bg-white text-black"
        >
          <option value="">-- Assign Coach --</option>
          {coaches.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded font-bold hover:bg-purple-700 transition">
          Add Course
        </button>
      </form>
      <ul className="space-y-3">
  {courses.map((c) => (
    <li key={c._id} className="p-4 border flex justify-between items-center bg-white shadow-sm rounded">
      <div>
        <p className="font-bold">{c.title}</p>
        <p className="text-blue-600 text-sm">Coach: {c.coachId?.name || 'N/A'}</p>
        {/* 新增：顯示報名進度條感 */}
        <p className="text-xs text-gray-500 mt-1">
          Occupancy: {c.enrolledCount || 0} / {c.capacity}
        </p>
      </div>
      <button onClick={() => handleDelete(c._id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm font-bold">Delete</button>
    </li>
  ))}
</ul>
    </div>
  );
}