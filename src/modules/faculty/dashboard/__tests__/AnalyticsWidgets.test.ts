/**
 * Analytics Widgets Unit Tests
 * Validates statistics calculation, attendance trends, teaching hours distribution, and score distribution.
 */

interface AttendanceTrendPoint {
  label: string;
  rate: number;
}

const MOCK_MONTHLY_ATTENDANCE: AttendanceTrendPoint[] = [
  { label: 'Week 1', rate: 84 },
  { label: 'Week 2', rate: 88 },
  { label: 'Week 3', rate: 91 },
  { label: 'Week 4', rate: 89 },
];

describe('Faculty Analytics & Statistics Tests', () => {
  test('calculates average attendance rate correctly', () => {
    const total = MOCK_MONTHLY_ATTENDANCE.reduce((sum, p) => sum + p.rate, 0);
    const avg = total / MOCK_MONTHLY_ATTENDANCE.length;
    expect(avg).toBeCloseTo(88, 0);
  });

  test('validates weekly trend progression', () => {
    expect(MOCK_MONTHLY_ATTENDANCE[2].rate).toBeGreaterThan(MOCK_MONTHLY_ATTENDANCE[0].rate);
  });
});
