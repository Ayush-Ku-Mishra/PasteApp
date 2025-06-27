import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { addToPastes, updateToPastes } from '../redux/pasteSlice';
import { Copy } from 'lucide-react';

const Home = () => {
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const pasteId = searchParams.get('pasteId');
  const dispatch = useDispatch();
  const allPastes = useSelector((state) => state.paste.pastes);

  useEffect(() => {
    if (pasteId) {
      const paste = allPastes.find((p) => p._id === pasteId);
      setTitle(paste.title);
      setValue(paste.content);
    }
  }, [pasteId]);

  function createPaste() {
    const paste = {
      title: title,
      content: value,
      _id: pasteId || Date.now().toString(36),
      createDate: new Date().toISOString(),
    };

    if (pasteId) {
      dispatch(updateToPastes(paste));
    } else {
      dispatch(addToPastes(paste));
    }

    setTitle('');
    setValue('');
    setSearchParams({});
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white px-6 py-10">
      {/* Title and Button */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 max-w-4xl mx-auto">
        <input
          className="w-full md:w-1/2 px-5 py-3 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-gray-800"
          type="text"
          placeholder="Title Here"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button
          onClick={createPaste}
          className="px-6 py-3 bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
        >
          {pasteId ? 'Update My Paste' : 'Create My Paste'}
        </button>
      </div>

      {/* Textarea Box */}
      <div className="max-w-4xl mx-auto mt-6 bg-[#0F172A] rounded-xl border border-blue-600 shadow-xl overflow-hidden">
        {/* Dots + Copy Button */}
        <div className="flex justify-between items-center px-4 py-2 bg-[#0F172A] border-b border-blue-600">
          <div className="flex gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          </div>
          <button
          title='Copy'
            onClick={() => {
              navigator.clipboard.writeText(value);
            }}
            className="text-white hover:text-cyan-400 transition"
          >
            <Copy size={18} />
          </button>
        </div>

        {/* Actual Textarea */}
        <textarea
          className="w-full h-96 p-5 bg-[#0F172A] text-white placeholder-slate-400 focus:outline-none resize-none"
          value={value}
          placeholder="Write Your Content Here...."
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Home;


