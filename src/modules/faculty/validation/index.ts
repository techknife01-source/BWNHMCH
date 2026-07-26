export const validateProfileData = (data: Record<string, any>) => {
  const errors: Record<string, string> = {};
  if (!data.fullName) errors.fullName = 'Full Name is required';
  if (!data.email) errors.email = 'Email address is required';
  if (!data.phone) errors.phone = 'Phone number is required';
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateAssignmentInput = (title: string, subjectId: string, dueDate: string) => {
  const errors: Record<string, string> = {};
  if (!title) errors.title = 'Assignment title is required';
  if (!subjectId) errors.subjectId = 'Subject selection is required';
  if (!dueDate) errors.dueDate = 'Due date is required';
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
