'use client';
import { useState, useEffect } from 'react';

interface Member { 
  _id: string; 
  name: string; 
}

interface Course { 
  _id: string; 
  title: string; 
  capacity: number; // 確保有 capacity 欄位
  enrolledCount?: number; // 新增這行
}

// 更新 Enrollment 介面，支援顯示老師名稱
interface Enrollment {
  _id: string;
  memberId: { name: string };
  courseId: { 
    title: string;
    coachId?: { name: string }; // 接收深層 populate 的教練資料
  };
  enrollDate: string;
}

export default function EnrollPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    try {
      const [memRes, couRes, enrRes] = await Promise.all([
        fetch('/api/members'),
        fetch('/api/courses'),
        fetch('/api/enrollments')
      ]);
      const memData = await memRes.json();
      const couData = await couRes.json();
      const enrData = await enrRes.json();
      
      if (memData.success) setMembers(memData.data);
      if (couData.success) setCourses(couData.data);
      if (enrData.success) setEnrollments(enrData.data);
    } catch (error: unknown) {
      console.error("Fetch error:", error);
    }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchData(); }, []);

  const handleEnroll = async () => {
    if (!selectedMember || !selectedCourse) return alert("Please select both!");
    const res = await fetch('/api/enrollments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId: selectedMember, courseId: selectedCourse }),
    });
    const result = await res.json();
    if (result.success) {
      setMessage("Success!");
      setSelectedCourse('');
      fetchData();
    } else {
      setMessage(`Error: ${result.message}`);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this enrollment?')) return;
    const res = await fetch(`/api/enrollments?id=${id}`, { method: 'DELETE' });
    if ((await res.json()).success) fetchData();
  };

  return (
    <div className="p-8 max-w-2xl mx-auto text-black">
      <h1 className="text-2xl font-bold mb-6">Course Enrollment</h1>
      
      {/* 報名表單 */}
      <div className="space-y-4 bg-gray-50 p-6 rounded-lg shadow mb-8">
        <select 
          value={selectedMember} 
          onChange={(e) => setSelectedMember(e.target.value)} 
          className="w-full p-2 border rounded bg-white text-black"
        >
          <option value="">-- Select Member --</option>
          {members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
        </select>

        <select 
          value={selectedCourse} 
          onChange={(e) => setSelectedCourse(e.target.value)} 
          className="w-full p-2 border rounded bg-white text-black"
        >
          <option value="">-- Select Course (Enrolled/Capacity) --</option>
          {courses.map(c => {
          const isFull = (c.enrolledCount || 0) >= c.capacity;
    return (
          <option key={c._id} value={c._id} disabled={isFull}>
          {c.title} ({c.enrolledCount || 0} / {c.capacity}) {isFull ? ' - [FULL]' : ''}
      </option>
    );
  })}
        </select>

        <button 
          onClick={handleEnroll} 
          className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition"
        >
          Confirm Enrollment
        </button>
        {message && <p className="mt-2 text-center text-sm font-bold text-blue-600">{message}</p>}
      </div>

      {/* 報名清單 */}
      <h2 className="text-xl font-bold mb-4">Current Enrollments</h2>
      <div className="space-y-4">
        {enrollments.map((en) => (
          <div key={en._id} className="p-4 border flex justify-between items-center bg-white shadow-md rounded-lg">
            <div>
              <p className="font-bold text-lg">{en.memberId?.name || 'Unknown Member'}</p>
              <p className="text-sm text-gray-500">
                Enrolled in: <span className="text-purple-600 font-semibold">{en.courseId?.title || 'Unknown Course'}</span>
              </p>
              {/* 新增老師顯示介面 */}
              <p className="text-xs text-blue-600 font-medium mt-1">
                Teacher: {en.courseId?.coachId?.name || 'No Coach Assigned'}
              </p>
            </div>
            <button 
              onClick={() => handleCancel(en._id)} 
              className="text-red-500 text-sm font-bold hover:bg-red-50 px-3 py-1 rounded border border-red-100 transition"
            >
              Cancel
            </button>
          </div>
        ))}
        {enrollments.length === 0 && (
          <p className="text-gray-400 text-center italic">No enrollments yet.</p>
        )}
      </div>
    </div>
  );
}