import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromPastes } from '../redux/pasteSlice';
import toast from 'react-hot-toast';
import { Trash2, Copy, Share2, Eye, Pencil, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Paste = () => {
  const pastes = useSelector((state) => state.paste.pastes);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const dispatch = useDispatch();

  const filterData = pastes.filter((paste) =>
    paste.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleDelete(pasteId) {
    dispatch(removeFromPastes(pasteId));
  }

  function handleShare(link) {
    setShareLink(link);
    setShowModal(true);
  }

  function copyAndClose() {
    navigator.clipboard.writeText(shareLink);
    toast.success('Link copied to clipboard!');
    setShowModal(false);
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-white text-gray-900 dark:bg-[#0F172A] dark:text-white transition-all duration-300">
      <input
        className="w-full px-5 py-3 mb-4 rounded-xl border border-gray-300 dark:border-slate-700 shadow-md bg-white dark:bg-slate-800 placeholder-gray-500 dark:placeholder-gray-400 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-300 transition-all duration-300"
        type="search"
        placeholder="Search Here"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <h2 className="text-3xl font-bold text-blue-800 dark:text-blue-400 mb-4 text-center">
        All Pastes
      </h2>

      <div className="flex flex-col gap-6">
        {filterData.length > 0 &&
          filterData.map((paste) => (
            <motion.div
              key={paste._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="absolute top-4 right-4 flex gap-3">
                <a
                  href={`/?pasteId=${paste._id}`}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-transform hover:scale-110"
                  title="Edit"
                >
                  <Pencil size={22} />
                </a>
                <a
                  href={`/pastes/${paste._id}`}
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-transform hover:scale-110"
                  title="View"
                >
                  <Eye size={22} />
                </a>
                <button
                  onClick={() => handleDelete(paste._id)}
                  className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-transform hover:scale-110"
                  title="Delete"
                >
                  <Trash2 size={22} />
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(paste.content);
                    toast.success('Copied to clipboard');
                  }}
                  className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-transform hover:scale-110"
                  title="Copy"
                >
                  <Copy size={22} />
                </button>
                <button
                  onClick={() => {
                    const shareURL = `${window.location.origin}/pastes/${paste._id}`;
                    handleShare(shareURL);
                  }}
                  className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 transition-transform hover:scale-110"
                  title="Share"
                >
                  <Share2 size={22} />
                </button>
              </div>

              <div className="text-2xl font-bold mb-1 text-left text-gray-900 dark:text-white">
                {paste.title}
              </div>
              <div className="mt-4 text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-left">
                {paste.content}
              </div>
              <div className="flex items-center justify-end gap-2 text-gray-600 dark:text-gray-400 mt-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>
                  {new Date(paste.createDate).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </motion.div>
          ))}
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-zinc-900 text-white p-6 rounded-xl shadow-2xl max-w-md w-full relative"
              initial={{ scale: 0.8, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: -20 }}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
              <h2 className="text-lg font-bold mb-2">Share link</h2>
              <p className="text-sm text-gray-400 mb-4">
                Anyone who has this link will be able to view this.
              </p>
              <div className="flex items-center bg-zinc-800 px-4 py-2 rounded-lg mb-4">
                <input
                  type="text"
                  readOnly
                  value={shareLink}
                  className="bg-transparent w-full text-blue-400 outline-none"
                />
                <button
                  onClick={copyAndClose}
                  className="ml-2 text-white hover:text-blue-400"
                >
                  <Copy size={18} />
                </button>
              </div>
              <div className="flex justify-around">
                <a
                  href={`https://twitter.com/intent/tweet?url=${shareLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-300"
                >
                  <img src="/Twitter.png" alt="X" className="w-7 h-7" />
                </a>
                <a
                  href={`https://t.me/share/url?url=${shareLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-300"
                >
                  <img src="/Telegram.png" alt="Telegram" className="w-7 h-7" />
                </a>
                <a
                  href={`https://api.whatsapp.com/send?text=${shareLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-300"
                >
                  <img src="/Whatsapp.png" alt="WhatsApp" className="w-7 h-7" />
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${shareLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-300"
                >
                  <img src="/Facebook.png" alt="Facebook" className="w-7 h-7" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Paste;
