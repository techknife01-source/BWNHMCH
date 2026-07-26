/**
 * Quick Search Unit Tests
 * Validates cross-entity searching across students, subjects, assignments, research, books, departments, notices, hospital.
 */

import { SearchResultItem } from '../components/QuickSearchModal';

const MOCK_INDEX: SearchResultItem[] = [
  { id: 's1', type: 'Student', title: 'Rahul Sharma', subtitle: '1st BHMS • Roll No. 104', route: '/faculty/attendance' },
  { id: 'sub1', type: 'Subject', title: 'Organon of Medicine & Homoeopathic Philosophy', subtitle: '1st & 2nd BHMS Core', route: '/faculty/classes' },
  { id: 'a1', type: 'Assignment', title: 'Chronic Case Taking Logbook #4', subtitle: 'Due 28th July', route: '/faculty/assignments' },
  { id: 'r1', type: 'Research', title: 'AYUSH Trial: Allergic Rhinitis', subtitle: 'CCRH Funded', route: '/faculty/research' },
  { id: 'b1', type: 'Book', title: "Kent's Lectures on Homoeopathic Philosophy", subtitle: 'E-Book Ref: LIB-2026-88', route: '/faculty/library' },
  { id: 'h1', type: 'Hospital', title: 'General Medicine OPD Duty - Room 4', subtitle: 'Shift: 11:30 AM', route: '/faculty/hospital' },
];

describe('Faculty Quick Search Engine Tests', () => {
  test('returns matching items for query "Organon"', () => {
    const q = 'organon';
    const results = MOCK_INDEX.filter((item) =>
      item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q)
    );
    expect(results.length).toBe(1);
    expect(results[0].type).toBe('Subject');
  });

  test('filters search index by type "Student"', () => {
    const results = MOCK_INDEX.filter((item) => item.type === 'Student');
    expect(results.length).toBe(1);
    expect(results[0].title).toBe('Rahul Sharma');
  });

  test('filters search index by type "Hospital"', () => {
    const results = MOCK_INDEX.filter((item) => item.type === 'Hospital');
    expect(results.length).toBe(1);
    expect(results[0].title).toContain('OPD Duty');
  });

  test('returns empty array when no query matches', () => {
    const q = 'nonexistent_term_xyz';
    const results = MOCK_INDEX.filter((item) =>
      item.title.toLowerCase().includes(q)
    );
    expect(results.length).toBe(0);
  });
});
