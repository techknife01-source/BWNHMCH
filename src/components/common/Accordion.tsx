import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({ items, allowMultiple = false, className }) => {
  const [openIds, setOpenIds] = useState<string[]>([]);

  const toggle = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={cn('divide-y divide-slate-200 rounded-2xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800', className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div key={item.id} className="bg-white dark:bg-slate-900">
            <button
              onClick={() => toggle(item.id)}
              className="flex w-full items-center justify-between px-5 py-4 text-left font-semibold text-slate-800 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/50"
            >
              <span>{item.title}</span>
              <ChevronDown className={cn('h-5 w-5 text-slate-400 transition-transform duration-200', isOpen && 'rotate-180')} />
            </button>
            {isOpen && <div className="px-5 pb-5 pt-1 text-sm text-slate-600 dark:text-slate-300">{item.content}</div>}
          </div>
        );
      })}
    </div>
  );
};
