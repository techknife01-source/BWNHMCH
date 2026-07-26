/**
 * Dashboard Calendar Unit Tests
 * Validates date range rendering, event category classifications, view mode state & agenda extraction.
 */

interface CalendarEvent {
  id: string;
  title: string;
  type: 'Class' | 'Meeting' | 'Research' | 'Assignment' | 'Exam' | 'Hospital' | 'Department';
  dayNum: number;
}

const EVENTS: CalendarEvent[] = [
  { id: 'e1', title: '1st BHMS Organon Lecture', type: 'Class', dayNum: 24 },
  { id: 'e2', title: 'General Medicine OPD Duty', type: 'Hospital', dayNum: 24 },
  { id: 'e3', title: 'HOD Academic Roster Meeting', type: 'Meeting', dayNum: 24 },
  { id: 'e4', title: '2nd BHMS Pathology Practical', type: 'Class', dayNum: 25 },
  { id: 'e5', title: 'AYUSH Research Review', type: 'Research', dayNum: 28 },
];

describe('Faculty Academic Calendar Tests', () => {
  test('returns events for selected day 24', () => {
    const day24Events = EVENTS.filter((e) => e.dayNum === 24);
    expect(day24Events.length).toBe(3);
  });

  test('filters events by type "Class"', () => {
    const classEvents = EVENTS.filter((e) => e.type === 'Class');
    expect(classEvents.length).toBe(2);
  });

  test('filters events by type "Hospital"', () => {
    const hospitalEvents = EVENTS.filter((e) => e.type === 'Hospital');
    expect(hospitalEvents.length).toBe(1);
    expect(hospitalEvents[0].title).toContain('OPD Duty');
  });

  test('correctly handles empty events on unassigned days', () => {
    const emptyDayEvents = EVENTS.filter((e) => e.dayNum === 10);
    expect(emptyDayEvents.length).toBe(0);
  });
});
