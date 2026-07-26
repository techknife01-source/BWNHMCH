import React from 'react';
import { X, Eye, EyeOff, ArrowUp, ArrowDown, RotateCcw, Check, LayoutGrid } from 'lucide-react';
import { useDashboardSettings } from '../hooks/useDashboardSettings';

interface DashboardCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DashboardCustomizerModal: React.FC<DashboardCustomizerModalProps> = ({ isOpen, onClose }) => {
  const { allWidgets, toggleWidgetVisibility, moveWidget, restoreDefaultLayout } = useDashboardSettings();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/50 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Personalize Dashboard Layout
              </h3>
              <p className="text-2xs text-slate-500">
                Show, hide, or reorder cards to suit your daily academic & clinical workflow
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={restoreDefaultLayout}
              className="px-3 py-1.5 rounded-xl text-xs font-extrabold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Default</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Widgets List */}
        <div className="p-4 flex-1 overflow-y-auto space-y-2">
          {allWidgets.map((widget, idx) => (
            <div
              key={widget.id}
              className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 ${
                widget.visible
                  ? 'bg-white dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700'
                  : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200/40 dark:border-slate-800/40 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 font-mono text-3xs font-extrabold text-slate-500 flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>

                <div className="min-w-0">
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                    {widget.title}
                  </h4>
                  <span className="text-3xs font-black uppercase text-slate-400">
                    Category: {widget.category}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {/* Move Up */}
                <button
                  onClick={() => moveWidget(widget.id, 'up')}
                  disabled={idx === 0}
                  className="p-1.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                  title="Move Up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>

                {/* Move Down */}
                <button
                  onClick={() => moveWidget(widget.id, 'down')}
                  disabled={idx === allWidgets.length - 1}
                  className="p-1.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                  title="Move Down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>

                {/* Toggle Visibility */}
                <button
                  onClick={() => toggleWidgetVisibility(widget.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer ${
                    widget.visible
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-emerald-100'
                      : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 hover:bg-rose-100'
                  }`}
                >
                  {widget.visible ? (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Visible</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hidden</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>
            Active Cards: <strong className="text-emerald-600">{allWidgets.filter((w) => w.visible).length}</strong> / {allWidgets.length}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Save & Apply Layout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
