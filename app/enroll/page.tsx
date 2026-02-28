'use client';
import { useState, useEffect } from 'react';

interface Member { _id: string; name: string; }
interface Course { 
  _id: string; 
  title: string; 
  time: string;
  capacity: number;
  enrolledCount: number;
  coachId?: { name: string };
}
interface Enrollment { 
  _id: string; 
  memberId: Member; 
  courseId: Course; 
}

export default function EnrollmentPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  const fetchData = async () => {
    try {
      const [enRes, memRes, couRes] = await Promise.all([
        fetch('/api/enrollments'), 
        fetch('/api/members'), 
        fetch('/api/courses')
      ]);
      const enData = await enRes.json();
      const memData = await memRes.json();
      const couData = await couRes.json();
      
      if (enData.success) setEnrollments(enData.data);
      if (memData.success) setMembers(memData.data);
      if (couData.success) setCourses(couData.data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchData(); }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'TBD';
    const d = new Date(dateStr);
    return d.toLocaleString('zh-TW', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: false
    });
  };

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/enrollments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId: selectedMember, courseId: selectedCourse }),
    });
    const result = await res.json();
    if (result.success) {
      setSelectedCourse('');
      fetchData();
    } else {
      alert(result.error || "Enrollment failed");
    }
  };

  // 【新增：刪除功能】
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this enrollment?')) return;
    
    try {
      const res = await fetch(`/api/enrollments?id=${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        fetchData(); // 刪除成功後重新整理清單
      } else {
        alert("Delete failed");
      }
    } catch (error) {
      alert("Error deleting enrollment");
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto text-black">
      <h1 className="text-2xl font-bold mb-6">Course Enrollment</h1>

      <form onSubmit={handleEnroll} className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-100">
        <div>
          <label className="block text-sm font-bold mb-1 text-blue-900">Select Member</label>
          <select value={selectedMember} onChange={(e) => setSelectedMember(e.target.value)} className="w-full p-2 border rounded bg-white text-black" required>
            <option value="">-- Choose Member --</option>
            {members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold mb-1 text-blue-900">Select Course</label>
          <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="w-full p-2 border rounded bg-white text-black" required>
            <option value="">-- Choose Course --</option>
            {courses.map(c => {
              const isFull = (c.enrolledCount || 0) >= c.capacity;
              return (
                <option key={c._id} value={c._id} disabled={isFull}>
                  {c.title} | {c.coachId?.name || 'No Coach'} | {formatDate(c.time)} ({c.enrolledCount}/{c.capacity}) {isFull ? '[FULL]' : ''}
                </option>
              );
            })}
          </select>
        </div>
        <button type="submit" className="md:col-span-2 bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95">
          Confirm Enrollment
        </button>
      </form>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-bold text-gray-700">Member</th>
              <th className="p-4 font-bold text-gray-700">Course</th>
              <th className="p-4 font-bold text-gray-700">Time</th>
              <th className="p-4 font-bold text-gray-700">Coach</th>
              <th className="p-4 font-bold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((en) => (
              <tr key={en._id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                <td className="p-4 font-semibold text-blue-900">{en.memberId?.name || 'Deleted Member'}</td>
                <td className="p-4 text-gray-800">{en.courseId?.title || 'Deleted Course'}</td>
                <td className="p-4 text-sm text-gray-600 font-mono">
                  {en.courseId?.time ? formatDate(en.courseId.time) : 'N/A'}
                </td>
                <td className="p-4">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold">
                    {en.courseId?.coachId?.name || 'Unassigned'}
                  </span>
                </td>
                {/* 補上刪除按鈕 */}
                <td className="p-4">
                  <button 
                    onClick={() => handleDelete(en._id)}
                    className="text-red-500 hover:text-white hover:bg-red-500 border border-red-500 px-2 py-1 rounded text-xs font-bold transition-all"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}