import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import { addToPastes, updateToPastes } from '../redux/pasteSlice';

const ViewPaste = () => {
  const { id } = useParams();
  const allPastes = useSelector((state) => state.paste.pastes);

  const paste = allPastes.find((p) => p._id === id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white px-6 py-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 max-w-4xl mx-auto">
        <input
          className="w-full md:w-1/2 px-5 py-3 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-gray-800"
          type="text"
          placeholder="Enter Title Here"
          value={paste?.title || ''}
          disabled
        />
      </div>

      <div className="max-w-4xl mx-auto mt-6">
        <textarea
          className="w-full h-96 p-5 bg-[#0F172A] text-white rounded-xl border border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400 shadow-xl transition-all duration-300 resize-none"
          value={paste?.content || ''}
          placeholder="Enter Content Here"
          disabled
        />
      </div>
    </div>
  );
};

export default ViewPaste;
