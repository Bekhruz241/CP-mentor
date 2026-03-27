
import React from 'react';
import { AppState, DailySet } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  state: AppState;
}

const Dashboard: React.FC<Props> = ({ state }) => {
  // Explicitly cast Object.entries to ensure type safety for 'set' as DailySet
  const solvedData = (Object.entries(state.dailySets) as [string, DailySet][]).map(([date, set]) => ({
    date: date.split('-').slice(1).join('/'),
    count: set.solvedIds?.length || 0
  }));

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Hozirgi Reyting</p>
          <h3 className="text-3xl font-bold text-blue-600">{state.profile.currentRating}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Maqsad</p>
          <h3 className="text-3xl font-bold text-green-600">{state.profile.targetRating}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Belgilangan dam olish kunlari</p>
          <h3 className="text-3xl font-bold text-amber-600">{state.restDays.length}</h3>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h4 className="text-lg font-semibold mb-4">Aktivlik Grafigi</h4>
        <div className="h-64">
          {solvedData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={solvedData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={3} dot={{r: 4, fill: '#3B82F6'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">Hali ma'lumotlar yo'q</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h4 className="text-lg font-semibold mb-4">Roadmap: 1400+ yo'li</h4>
          <ul className="space-y-3">
            {[
                {m: "May 2024", t: "Implementation & Math"},
                {m: "Iyun 2024", t: "Greedy & Sorting"},
                {m: "Iyul 2024", t: "Searching & Brute force"},
                {m: "Avgust 2024", t: "Dynamic Programming basics"},
                {m: "Sentyabr 2024", t: "Data Structures basics"},
                {m: "Oktyabr-May", t: "Intensive practice & Olimpiadalar"}
            ].map((step, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-sm font-medium text-gray-700 w-24">{step.m}</span>
                <span className="text-sm text-gray-500">{step.t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h4 className="text-lg font-semibold mb-4">Dam olish kunlari</h4>
          <div className="flex flex-wrap gap-2">
            {state.restDays.length > 0 ? state.restDays.map(d => (
              <span key={d} className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-medium">
                {d}
              </span>
            )) : <p className="text-gray-400 text-sm italic">Hali dam olish kunlari belgilanmagan.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
