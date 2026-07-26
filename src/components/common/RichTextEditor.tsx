import React, { useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  Link as LinkIcon,
  Eye,
  Edit3,
  Trash2,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  label?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Type or paste formatted text content here...',
  minHeight = 'min-h-[160px]',
  label,
}) => {
  const [isPreview, setIsPreview] = useState(false);

  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('rich-text-textarea') as HTMLTextAreaElement;
    if (!textarea) {
      onChange(value + `${prefix}text${suffix}`);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || 'text';
    const replacement = `${prefix}${selectedText}${suffix}`;
    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear the editor text?')) {
      onChange('');
    }
  };

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-3xs font-extrabold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
            {label}
          </label>
          <span className="text-[10px] text-slate-400 font-medium">Supports Markdown/HTML</span>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs transition-all focus-within:ring-2 focus-within:ring-[#002147] dark:focus-within:ring-[#00A651]">
        {/* Formatting Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-1 p-2 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => insertFormatting('**', '**')}
              title="Bold"
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('*', '*')}
              title="Italic"
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('<u>', '</u>')}
              title="Underline"
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
            >
              <Underline className="w-3.5 h-3.5" />
            </button>

            <span className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

            <button
              type="button"
              onClick={() => insertFormatting('# ')}
              title="Heading 1"
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
            >
              <Heading1 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('## ')}
              title="Heading 2"
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
            >
              <Heading2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('### ')}
              title="Heading 3"
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
            >
              <Heading3 className="w-3.5 h-3.5" />
            </button>

            <span className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

            <button
              type="button"
              onClick={() => insertFormatting('- ')}
              title="Bullet List"
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('1. ')}
              title="Numbered List"
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>

            <span className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

            <button
              type="button"
              onClick={() => insertFormatting('> ')}
              title="Quote"
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('`', '`')}
              title="Inline Code"
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
            >
              <Code className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('[Link Text](', ')')}
              title="Insert Link"
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
            >
              <LinkIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsPreview(!isPreview)}
              className="flex items-center gap-1 px-2 py-1 bg-slate-200/70 dark:bg-slate-800 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-slate-300 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              {isPreview ? (
                <>
                  <Edit3 className="w-3 h-3 text-blue-500" />
                  <span>Editor</span>
                </>
              ) : (
                <>
                  <Eye className="w-3 h-3 text-emerald-500" />
                  <span>Preview</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleClear}
              title="Clear Content"
              className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Editor Body or Preview Body */}
        {isPreview ? (
          <div
            className={`p-4 text-xs dark:text-slate-200 leading-relaxed overflow-y-auto ${minHeight} bg-slate-50/50 dark:bg-slate-950/30 prose dark:prose-invert max-w-none`}
          >
            {value ? (
              <div dangerouslySetInnerHTML={{ __html: value.replace(/\n/g, '<br/>') }} />
            ) : (
              <p className="text-slate-400 italic">Nothing to preview yet...</p>
            )}
          </div>
        ) : (
          <textarea
            id="rich-text-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full p-4 text-xs bg-transparent border-0 focus:outline-none focus:ring-0 leading-relaxed resize-y ${minHeight} text-slate-900 dark:text-slate-100 placeholder-slate-400`}
          />
        )}
      </div>
    </div>
  );
};
