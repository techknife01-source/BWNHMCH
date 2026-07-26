import { calculateProfileCompleteness } from '../utils/profileCompleteness';
import { personalInfoSchema, changePasswordSchema } from '../schemas/profile.schema';
import { INITIAL_FULL_FACULTY_PROFILE } from '../services/profile.service';

describe('Faculty Profile Module Unit Tests', () => {
  it('should correctly calculate profile completeness percentage for default profile', () => {
    const result = calculateProfileCompleteness(INITIAL_FULL_FACULTY_PROFILE);
    expect(result.overallPercentage).toBeGreaterThanOrEqual(90);
    expect(result.sections.length).toBe(8);
  });

  it('should detect missing fields and reduce completeness percentage', () => {
    const incompleteProfile = {
      ...INITIAL_FULL_FACULTY_PROFILE,
      avatarUrl: '',
      academicQualifications: [],
      documents: [],
    };

    const result = calculateProfileCompleteness(incompleteProfile);
    expect(result.overallPercentage).toBeLessThan(90);
    expect(result.missingSections.some((s) => s.key === 'photo')).toBe(true);
    expect(result.missingSections.some((s) => s.key === 'academic')).toBe(true);
  });

  it('should validate valid personal information using Zod schema', () => {
    const validData = {
      fullName: 'Dr. Swapna Roy',
      fatherName: 'Mr. Animesh Roy',
      motherName: 'Mrs. Sunita Roy',
      dob: '1984-06-18',
      gender: 'Female',
      bloodGroup: 'O+',
      nationality: 'Indian',
      maritalStatus: 'Married',
      languagesKnown: ['English', 'Bengali'],
    };

    const parseResult = personalInfoSchema.safeParse(validData);
    expect(parseResult.success).toBe(true);
  });

  it('should fail validation when required password fields are missing or mismatched', () => {
    const invalidPassData = {
      currentPassword: '123',
      newPassword: 'Password123!',
      confirmPassword: 'MismatchPassword123!',
    };

    const parseResult = changePasswordSchema.safeParse(invalidPassData);
    expect(parseResult.success).toBe(false);
  });
});
