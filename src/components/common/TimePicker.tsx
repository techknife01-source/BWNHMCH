import React from 'react';
import { Clock } from 'lucide-react';
import { Input, InputProps } from './Input';

export interface TimePickerProps extends Omit<InputProps, 'type'> {}

export const TimePicker: React.FC<TimePickerProps> = (props) => {
  return <Input type="time" leftIcon={<Clock className="h-4 w-4" />} {...props} />;
};
