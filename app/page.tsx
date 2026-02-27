'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// 定義關聯的教練介面
interface CoachInfo {
  _id: string;
  name: string;
}

// 定義課程介面
interface RecentCourse {
  _id: string;
  title: string;
  capacity: number;
  coachId?: CoachInfo; // 這裡定義為物件，因為 API 使用了 populate
}

interface Stats {
  coachCount: number;
  memberCount: number;
  courseCount: number;
  recentCourses: RecentCourse[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(result => {
        if (result.success) setStats(result.data);
      });
  }, []);

  if (!stats) return <div className="p-8 text-center text-black font-bold">Loading Dashboard...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-black">Gym Management Dashboard</h1>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-blue-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition">
          <h2 className="text-xl font-semibold opacity-80">Coaches</h2>
          <p className="text-4xl font-bold mt-2">{stats.coachCount}</p>
          <Link href="/coaches" className="mt-4 block text-sm underline font-medium">Manage Coaches →</Link>
        </div>

        <div className="bg-green-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition">
          <h2 className="text-xl font-semibold opacity-80">Members</h2>
          <p className="text-4xl font-bold mt-2">{stats.memberCount}</p>
          <Link href="/members" className="mt-4 block text-sm underline font-medium">Manage Members →</Link>
        </div>

        <div className="bg-purple-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition">
          <h2 className="text-xl font-semibold opacity-80">Active Courses</h2>
          <p className="text-4xl font-bold mt-2">{stats.courseCount}</p>
          <Link href="/courses" className="mt-4 block text-sm underline font-medium">Manage Courses →</Link>
        </div>
      </div>

      {/* 快速捷徑與最近課程 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-xl font-bold mb-4 text-black border-b pb-2">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/enroll" className="bg-blue-50 p-4 rounded-lg text-center font-bold text-blue-700 hover:bg-blue-100 transition">
              Enroll Member
            </Link>
            <Link href="/courses" className="bg-purple-50 p-4 rounded-lg text-center font-bold text-purple-700 hover:bg-purple-100 transition">
              Create Course
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-xl font-bold mb-4 text-black border-b pb-2">Recent Courses</h2>
          <ul className="space-y-4">
            {stats.recentCourses.map((c) => (
              <li key={c._id} className="flex justify-between items-center border-b border-gray-50 pb-3">
                <div>
                  <p className="font-bold text-black">{c.title}</p>
                  <p className="text-xs text-gray-500 font-medium">
                    Coach: <span className="text-blue-600">{c.coachId?.name || 'Unassigned'}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-bold">
                    Cap: {c.capacity}
                  </span>
                </div>
              </li>
            ))}
            {stats.recentCourses.length === 0 && (
              <p className="text-gray-400 text-center py-4 text-sm italic">No courses scheduled yet.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}