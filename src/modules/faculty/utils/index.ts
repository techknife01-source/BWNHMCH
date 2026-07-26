export const formatFacultyName = (name: string, designation?: string): string => {
  if (!name) return '';
  const prefix = name.toLowerCase().startsWith('dr.') || name.toLowerCase().startsWith('prof.') ? '' : 'Dr. ';
  return `${prefix}${name}${designation ? ` (${designation})` : ''}`;
};

export const calculateAttendancePercentage = (attended: number, total: number): number => {
  if (!total || total <= 0) return 0;
  return Number(((attended / total) * 100).toFixed(1));
};
