'use client';

import { useState } from 'react';

interface SearchFilters {
  date: string;
  category: string;
  status: string;
  keyword: string;
}

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
}

const CATEGORIES = [
  '全部',
  '周末班',
  '周二班',
  '周三班',
  '周四班',
  '周五班',
  '晚班'
];

const STATUS_OPTIONS = [
  { value: '', label: '全部状态' },
  { value: '招生中', label: '招生中' },
  { value: '上课中', label: '上课中' },
  { value: '已结课', label: '已结课' }
];

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    date: new Date().toISOString().split('T')[0],
    category: '',
    status: '',
    keyword: ''
  });

  const handleChange = (key: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            班级分类
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat === '全部' ? '' : cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            日期
          </label>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            班级状态
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            搜索班级
          </label>
          <input
            type="text"
            value={filters.keyword}
            onChange={(e) => handleChange('keyword', e.target.value)}
            placeholder="输入班级名称"
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>
    </div>
  );
}