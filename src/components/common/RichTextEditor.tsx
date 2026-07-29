import React, { useState, useRef } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Code,
  Eye,
  Edit3,
  RotateCcw,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write notice content here...',
  minHeight = '200px',
}) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'html'>('editor');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const applyFormat = (tagOpen: string, tagClose: string = '') => {
    if (!textareaRef.current) return;
    const el = textareaRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selectedText = el.value.substring(start, end) || 'text';
    const replacement = `${tagOpen}${selectedText}${tagClose}`;

    const newValue = el.value.substring(0, start) + replacement + el.value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + tagOpen.length, start + tagOpen.length + selectedText.length);
    }, 50);
  };

  const handleLink = () => {
    const url = prompt('Enter link URL (e.g. https://wbuhs.ac.in):', 'https://');
    if (url) {
      applyFormat(`<a href="${url}" target="_blank" class="text-blue-600 underline">`, '</a>');
    }
  };

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
      {/* Editor Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-100 dark:bg-slate-800/80 p-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => applyFormat('<strong>', '</strong>')}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-bold transition cursor-pointer"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('<em>', '</em>')}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 transition cursor-pointer"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('<u>', '</u>')}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 transition cursor-pointer"
            title="Underline"
          >
            <Underline className="w-4 h-4" />
          </button>

          <span className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700 mx-1" />

          <button
            type="button"
            onClick={() => applyFormat('<h2 className="text-lg font-bold">', '</h2>')}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 transition cursor-pointer"
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('<h3 className="text-base font-bold">', '</h3>')}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 transition cursor-pointer"
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </button>

          <span className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700 mx-1" />

          <button
            type="button"
            onClick={() => applyFormat('<ul className="list-disc ml-5 space-y-1">\n  <li>', '</li>\n</ul>')}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 transition cursor-pointer"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('<ol className="list-decimal ml-5 space-y-1">\n  <li>', '</li>\n</ol>')}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 transition cursor-pointer"
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('<blockquote className="border-l-4 border-emerald-500 pl-3 italic my-2">', '</blockquote>')}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 transition cursor-pointer"
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </button>

          <span className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700 mx-1" />

          <button
            type="button"
            onClick={handleLink}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 transition cursor-pointer"
            title="Insert Link"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('<code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono text-xs">', '</code>')}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 transition cursor-pointer"
            title="Inline Code"
          >
            <Code className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-rose-500 transition cursor-pointer"
            title="Clear All"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-700 p-0.5 rounded-lg text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`px-2 py-1 rounded-md transition cursor-pointer flex items-center gap-1 ${
              activeTab === 'editor' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Edit3 className="w-3 h-3" /> Visual
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-2 py-1 rounded-md transition cursor-pointer flex items-center gap-1 ${
              activeTab === 'preview' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Eye className="w-3 h-3 text-emerald-600" /> Preview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('html')}
            className={`px-2 py-1 rounded-md transition cursor-pointer flex items-center gap-1 ${
              activeTab === 'html' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Code className="w-3 h-3 text-blue-600" /> HTML
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="p-3">
        {activeTab === 'editor' && (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            style={{ minHeight }}
            className="w-full bg-transparent text-slate-900 dark:text-slate-100 text-sm focus:outline-none resize-y font-sans leading-relaxed"
          />
        )}

        {activeTab === 'html' && (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Edit raw HTML content..."
            style={{ minHeight }}
            className="w-full bg-slate-900 text-emerald-400 text-xs font-mono p-3 rounded-xl focus:outline-none resize-y leading-relaxed"
          />
        )}

        {activeTab === 'preview' && (
          <div
            style={{ minHeight }}
            className="prose dark:prose-invert max-w-none text-sm leading-relaxed p-2 text-slate-800 dark:text-slate-200"
            dangerouslySetInnerHTML={{ __html: value || '<p class="text-slate-400 italic">No content typed yet...</p>' }}
          />
        )}
      </div>
    </div>
  );
};
