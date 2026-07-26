import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Input, InputProps } from './Input';

export interface DatePickerProps extends Omit<InputProps, 'type'> {}

export const DatePicker: React.FC<DatePickerProps> = (props) => {
  return <Input type="date" leftIcon={<CalendarIcon className="h-4 w-4" />} {...props} />;
};
