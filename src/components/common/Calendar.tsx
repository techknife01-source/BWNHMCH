import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { cn } from '../../lib/utils';

export interface CalendarEvent {
  date: Date;
  title: string;
}

export interface CalendarProps {
  events?: CalendarEvent[];
  onDateSelect?: (date: Date) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ events = [], onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    if (onDateSelect) onDateSelect(day);
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <div className="flex space-x-1">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="h-4 w-4 text-slate-600 dark:text-slate-300" />
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ChevronRight className="h-4 w-4 text-slate-600 dark:text-slate-300" />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400">
        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, monthStart);
          const hasEvent = events.some((e) => isSameDay(e.date, day));

          return (
            <button
              key={idx}
              onClick={() => handleDateClick(day)}
              className={cn(
                'relative flex h-9 items-center justify-center rounded-xl text-xs font-medium transition-all cursor-pointer',
                !isCurrentMonth && 'text-slate-300 dark:text-slate-700',
                isCurrentMonth && 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800',
                isSelected && 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:text-white'
              )}
            >
              <span>{format(day, 'd')}</span>
              {hasEvent && (
                <span className={cn('absolute bottom-1 h-1 w-1 rounded-full bg-emerald-500', isSelected && 'bg-white')} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
