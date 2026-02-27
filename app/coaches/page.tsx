'use client';

import { useState, useEffect } from 'react';

// 定義 Coach 介面以確保型別安全並消除紅線
interface Coach {
  _id: string;
  name: string;
  expertise: string;
}

export default function CoachPage() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [name, setName] = useState('');
  const [expertise, setExpertise] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. 取得教練資料
  const fetchCoaches = async () => {
    try {
      const res = await fetch('/api/coaches');
      const result = await res.json();
      if (result.success) {
        setCoaches(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch coaches:", error);
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, []);

  // 2. 提交表單 (新增教練)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/coaches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, expertise }),
      });

      const result = await res.json();
      if (result.success) {
        setName('');
        setExpertise('');
        fetchCoaches(); // 重新讀取清單
      } else {
        alert(result.message || 'Add failed');
      }
    } catch (error) {
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  // 3. 刪除教練功能
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coach?')) return;

    try {
      // 透過 URL Query 傳遞 ID 给 DELETE 方法
      const res = await fetch(`/api/coaches?id=${id}`, {
        method: 'DELETE',
      });
      
      const result = await res.json();
      if (result.success) {
        fetchCoaches(); // 刪除成功後更新列表
      } else {
        alert(result.message || 'Delete failed');
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert('Network error during deletion');
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-black">Coach Management</h1>

      {/* 新增表單 */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4 bg-gray-50 p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-black">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded text-black bg-white"
            placeholder="e.g. John Doe"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black">Expertise</label>
          <input
            type="text"
            value={expertise}
            onChange={(e) => setExpertise(e.target.value)}
            className="w-full p-2 border rounded text-black bg-white"
            placeholder="e.g. Weight Training"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 font-bold w-full transition"
        >
          {loading ? 'Saving...' : 'Add Coach'}
        </button>
      </form>

      {/* 教練列表 */}
      <h2 className="text-xl font-semibold mb-4 text-black border-b pb-2">Current Coach List</h2>
      <ul className="space-y-3">
        {coaches.map((coach) => (
          <li key={coach._id} className="p-4 border flex justify-between items-center bg-white shadow-sm rounded">
            <div>
              <p className="font-bold text-black text-lg">{coach.name}</p>
              <p className="text-gray-600 text-sm">{coach.expertise}</p>
            </div>
            
            {/* 刪除按鈕 */}
            <button
              onClick={() => handleDelete(coach._id)}
              className="bg-red-500 text-white px-4 py-2 rounded text-sm font-bold hover:bg-red-600 transition shadow-sm"
            >
              Delete
            </button>
          </li>
        ))}
        {coaches.length === 0 && (
          <p className="text-gray-500 text-center py-4 italic">No coaches found.</p>
        )}
      </ul>
    </div>
  );
}