import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { addToPastes, updateToPastes } from '../redux/pasteSlice';
import { Copy, Sparkles, Globe,} from 'lucide-react';
import toast from 'react-hot-toast';

const Home = () => {
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [summary, setSummary] = useState('');
  const [translated, setTranslated] = useState('');
  const [language, setLanguage] = useState('fr');
  const [loadingType, setLoadingType] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [speaking, setSpeaking] = useState(false);
  const pasteId = searchParams.get('pasteId');
  const dispatch = useDispatch();
  const allPastes = useSelector((state) => state.paste.pastes);

  useEffect(() => {
    if (pasteId) {
      const paste = allPastes.find((p) => p._id === pasteId);
      if (paste) {
        setTitle(paste.title);
        setValue(paste.content);
      }
    }
  }, [pasteId]);

  useEffect(() => {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }, []);

  function speakText(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    const langMap = {
      fr: 'fr-FR',
      es: 'es-ES',
      hi: 'hi-IN',
    };
    utterance.lang = langMap[language] || 'en-US';

    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(voice => voice.lang === utterance.lang);
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function createPaste() {
    if (!title.trim() || !value.trim()) {
      toast.error("Please fill in both Title and Content");
      return;
    }

    const paste = {
      title,
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
    setSummary('');
    setTranslated('');
    setSearchParams({});
  }

  async function handleSummarize() {
    if (!value.trim()) return;
    if (value.length > 1024) {
      toast.error("Please enter content below 1024 characters for best summarization.");
      return;
    }

    setLoadingType('summarize');
    setSummary('');
    try {
      const response = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: value }),
      });

      const data = await response.json();
      setSummary(data[0]?.summary_text || 'No summary found.');
    } catch {
      setSummary('❌ Error generating summary.');
    } finally {
      setLoadingType(null);
    }
  }

  async function handleTranslate() {
    if (!value.trim()) return;

    setLoadingType('translate');
    setTranslated('');
    try {
      const response = await fetch(`https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-en-${language}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: value }),
      });

      const data = await response.json();
      setTranslated(data[0]?.translation_text || 'No translation found.');
    } catch {
      setTranslated('❌ Error generating translation.');
    } finally {
      setLoadingType(null);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-gray-950 px-6 py-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 max-w-4xl mx-auto">
        <input
          className="w-full md:w-1/2 px-5 py-3 rounded-lg border border-gray-300 dark:border-slate-700 shadow-md bg-white dark:bg-slate-800 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      <div className="max-w-4xl mx-auto mt-4 text-right">
        <label className="text-sm text-gray-700 dark:text-gray-300 mr-2">Translate to:</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white px-3 py-1 rounded-md border border-gray-300 dark:border-slate-700"
        >
          <option value="fr">French</option>
          <option value="es">Spanish</option>
          <option value="hi">Hindi</option>
        </select>
      </div>

      <div className="relative max-w-4xl mx-auto mt-6 bg-[#0F172A] dark:bg-slate-900 rounded-xl border border-blue-600 shadow-xl overflow-hidden">
        <div className="flex justify-between items-center px-4 py-2 bg-[#0F172A] border-b border-blue-600">
          <div className="flex gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full" />
            <span className="w-3 h-3 bg-yellow-400 rounded-full" />
            <span className="w-3 h-3 bg-green-500 rounded-full" />
          </div>
          <button
            title="Copy"
            onClick={() => {
              navigator.clipboard.writeText(value);
              toast.success('Copied to clipboard');
            }}
            className="text-white hover:text-cyan-400 transition"
          >
            <Copy size={18} />
          </button>
        </div>

        <textarea
          className="w-full h-96 p-5 bg-[#0F172A] text-white placeholder-slate-400 focus:outline-none resize-none"
          value={value}
          placeholder="Write Your Content Here...."
          onChange={(e) => setValue(e.target.value)}
        />

        <div className="absolute bottom-4 right-4 flex gap-3">
          <button
            onClick={handleSummarize}
            title="Summarize with AI"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition transform hover:scale-105 hover:rotate-1"
          >
            <Sparkles size={18} className={`transition-all duration-300 ${loadingType === 'summarize' ? 'animate-bounce' : ''}`} />
            {loadingType === 'summarize' ? '...' : 'Summarize'}
          </button>

          <button
            onClick={handleTranslate}
            title="Translate with AI"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition transform hover:scale-105 hover:-rotate-1"
          >
            <Globe size={18} className={`transition-all duration-300 ${loadingType === 'translate' ? 'animate-bounce' : ''}`} />
            {loadingType === 'translate' ? '...' : 'Translate'}
          </button>
        </div>
      </div>

      {summary && (
        <div className="max-w-4xl mx-auto mt-6 p-5 rounded-xl bg-slate-100 dark:bg-slate-800 text-gray-800 dark:text-gray-100 border dark:border-slate-700 shadow-md relative">
          <button
            onClick={() => {
              navigator.clipboard.writeText(summary);
              toast.success('Summary copied!');
            }}
            className="absolute top-4 right-4 text-blue-700 dark:text-blue-400 hover:text-blue-500"
            title="Copy Summary"
          >
            <Copy size={18} />
          </button>
          <h3 className="text-lg font-semibold mb-4 text-blue-700 dark:text-blue-400 text-center">AI Summary:</h3>
          <p className="whitespace-pre-wrap">{summary}</p>
        </div>
      )}

      {translated && (
        <div className="max-w-4xl mx-auto mt-4 p-5 rounded-xl bg-slate-100 dark:bg-slate-800 text-gray-800 dark:text-gray-100 border dark:border-slate-700 shadow-md relative">
          <div className="absolute top-4 right-4 flex items-center gap-3">
            <button
              onClick={() => speakText(translated)}
              className={`text-green-700 dark:text-green-400 hover:text-green-500 transition-all duration-300 ${speaking ? 'animate-bounce' : ''}`}
              title="Listen Translation"
            >
              🔊
            </button>
          </div>

          <h3 className="text-lg font-semibold mb-4 text-green-700 dark:text-green-400 text-center">
            AI Translation:
          </h3>

          <p className="whitespace-pre-wrap">{translated}</p>
        </div>
      )}
    </div>
  );
};

export default Home;
