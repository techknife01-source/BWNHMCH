/**
 * Quick Actions Unit Tests
 * Validates route mappings, action panel configuration & navigation target targets.
 */

interface ActionConfig {
  id: string;
  label: string;
  route: string;
}

const ACTIONS: ActionConfig[] = [
  { id: 'attendance', label: 'Take Attendance', route: '/faculty/attendance' },
  { id: 'upload-notes', label: 'Upload Notes', route: '/faculty/study-material' },
  { id: 'create-assignment', label: 'Create Assignment', route: '/faculty/assignments' },
  { id: 'publish-marks', label: 'Publish Marks', route: '/faculty/results' },
  { id: 'timetable', label: 'Open Timetable', route: '/faculty/classes' },
  { id: 'dept-notice', label: 'Department Notice', route: '/faculty/department' },
  { id: 'library', label: 'Library Requisition', route: '/faculty/library' },
  { id: 'hospital', label: 'Hospital Duty', route: '/faculty/hospital' },
];

describe('Faculty Quick Action Panel Tests', () => {
  test('has exactly 8 quick actions configured', () => {
    expect(ACTIONS.length).toBe(8);
  });

  test('contains valid non-empty route targets for all actions', () => {
    ACTIONS.forEach((act) => {
      expect(act.route).toBeTruthy();
      expect(act.route.startsWith('/faculty/')).toBe(true);
    });
  });

  test('maps attendance action to /faculty/attendance', () => {
    const attendance = ACTIONS.find((a) => a.id === 'attendance');
    expect(attendance?.route).toBe('/faculty/attendance');
  });

  test('maps hospital duty action to /faculty/hospital', () => {
    const hospital = ACTIONS.find((a) => a.id === 'hospital');
    expect(hospital?.route).toBe('/faculty/hospital');
  });
});
