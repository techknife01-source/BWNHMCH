export interface AdmissionEvent {
  id: string;
  event: string;
  date: string;
  description?: string;
  status: 'Completed' | 'Active Now' | 'Upcoming';
  isPublished: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdmissionStage {
  id: string;
  name: string;
  description?: string;
  order: number;
  isCurrentActive: boolean;
  status: 'Completed' | 'Currently Open' | 'Upcoming';
  updatedAt?: string;
}

export interface AdmissionSettings {
  courseName: string;
  heading: string;
  subheading: string;
  totalSeats: number;
  stateQuotaSeats: number;
  allIndiaQuotaSeats: number;
  academicSession: string;
  helplinePhones: string;
  helplineEmail: string;
  officeHours: string;
}

const STORAGE_EVENTS_KEY = 'bhmc_admission_events_v2';
const STORAGE_STAGES_KEY = 'bhmc_admission_stages_v2';
const STORAGE_SETTINGS_KEY = 'bhmc_admission_settings_v2';

const INITIAL_EVENTS: AdmissionEvent[] = [
  {
    id: 'evt-1',
    event: 'NEET-UG 2026 Results Declaration',
    date: '14 June 2026',
    description: 'National Testing Agency declared NEET-UG qualifying percentile and scorecards.',
    status: 'Completed',
    isPublished: true,
    order: 1,
  },
  {
    id: 'evt-2',
    event: 'WBMCC State AYUSH Counselling Registration',
    date: '10 July - 25 July 2026',
    description: 'Online registration for 85% West Bengal State Quota seats on WBMCC portal.',
    status: 'Completed',
    isPublished: true,
    order: 2,
  },
  {
    id: 'evt-3',
    event: '1st Round Physical Document Verification at BHMC&H',
    date: '02 August - 05 August 2026',
    description: 'Physical verification of original certificates at college admission desk.',
    status: 'Active Now',
    isPublished: true,
    order: 3,
  },
  {
    id: 'evt-4',
    event: 'Merit List & Round 1 Seat Allotment Publication',
    date: '08 August 2026',
    description: 'Provisional allotment list release on state counseling portal.',
    status: 'Upcoming',
    isPublished: true,
    order: 4,
  },
  {
    id: 'evt-5',
    event: 'WBMCC & AACCC Choice Filling & Lock-In',
    date: '10 August - 14 August 2026',
    description: 'Candidates lock college choices for final seat confirmation.',
    status: 'Upcoming',
    isPublished: true,
    order: 5,
  },
  {
    id: 'evt-6',
    event: 'Final Fee Payment & Admission Confirmation',
    date: '15 August - 17 August 2026',
    description: 'Payment of college fees and generation of official admission token.',
    status: 'Upcoming',
    isPublished: true,
    order: 6,
  },
  {
    id: 'evt-7',
    event: 'Commencement of BHMS Academic Session 2026-27',
    date: '18 August 2026',
    description: 'Induction ceremony and 1st Professional BHMS classes begin.',
    status: 'Upcoming',
    isPublished: true,
    order: 7,
  },
];

const INITIAL_STAGES: AdmissionStage[] = [
  {
    id: 'stage-1',
    name: 'Admission Notification',
    description: 'Official NCH & WBMCC notice release for BHMS admissions',
    order: 1,
    isCurrentActive: false,
    status: 'Completed',
  },
  {
    id: 'stage-2',
    name: 'Online Registration',
    description: 'Candidate registration on AACCC and WBMCC counseling portal',
    order: 2,
    isCurrentActive: false,
    status: 'Completed',
  },
  {
    id: 'stage-3',
    name: 'Document Verification',
    description: 'Physical reporting and document verification at BHMC&H campus',
    order: 3,
    isCurrentActive: true,
    status: 'Currently Open',
  },
  {
    id: 'stage-4',
    name: 'Merit List Publication',
    description: 'State rank list and provisional seat allotment declaration',
    order: 4,
    isCurrentActive: false,
    status: 'Upcoming',
  },
  {
    id: 'stage-5',
    name: 'Counselling',
    description: 'Choice filling, lock-in, and seat acceptance rounds',
    order: 5,
    isCurrentActive: false,
    status: 'Upcoming',
  },
  {
    id: 'stage-6',
    name: 'Fee Payment',
    description: 'Admission fee payment and provisional admission slip generation',
    order: 6,
    isCurrentActive: false,
    status: 'Upcoming',
  },
  {
    id: 'stage-7',
    name: 'Final Admission',
    description: 'Final college reporting, roll allocation, and hostel allotment',
    order: 7,
    isCurrentActive: false,
    status: 'Upcoming',
  },
  {
    id: 'stage-8',
    name: 'Classes Commencement',
    description: 'Academic session orientation and commencement of 1st BHMS lectures',
    order: 8,
    isCurrentActive: false,
    status: 'Upcoming',
  },
];

const INITIAL_SETTINGS: AdmissionSettings = {
  courseName: 'BHMS (Bachelor of Homoeopathic Medicine and Surgery)',
  heading: 'BHMS Admissions',
  subheading: "Welcome prospective medical scholars! Enroll in Eastern India's leading Homoeopathic medical college for the BHMS degree program. Complete counseling guidance, seat matrix, fees structure, and document verification details provided below.",
  totalSeats: 50,
  stateQuotaSeats: 42,
  allIndiaQuotaSeats: 8,
  academicSession: '2026-27',
  helplinePhones: '+91 342 2634123 / +91 98321 88900',
  helplineEmail: 'admission@bhmc.ac.in',
  officeHours: 'Mon - Sat (10:00 AM - 5:00 PM)',
};

type Listener = () => void;
const listeners: Set<Listener> = new Set();

const notify = () => {
  listeners.forEach((fn) => fn());
};

export const admissionCmsService = {
  getEvents(publishedOnly = false): AdmissionEvent[] {
    try {
      const raw = localStorage.getItem(STORAGE_EVENTS_KEY);
      let list: AdmissionEvent[] = raw ? JSON.parse(raw) : INITIAL_EVENTS;
      if (publishedOnly) {
        list = list.filter((e) => e.isPublished);
      }
      return [...list].sort((a, b) => a.order - b.order);
    } catch {
      return INITIAL_EVENTS;
    }
  },

  getStages(): AdmissionStage[] {
    try {
      const raw = localStorage.getItem(STORAGE_STAGES_KEY);
      const list: AdmissionStage[] = raw ? JSON.parse(raw) : INITIAL_STAGES;
      return [...list].sort((a, b) => a.order - b.order);
    } catch {
      return INITIAL_STAGES;
    }
  },

  getSettings(): AdmissionSettings {
    try {
      const raw = localStorage.getItem(STORAGE_SETTINGS_KEY);
      return raw ? JSON.parse(raw) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  },

  addEvent(data: Omit<AdmissionEvent, 'id'>): AdmissionEvent {
    const list = this.getEvents(false);
    const newEvt: AdmissionEvent = {
      ...data,
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      order: data.order || list.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [...list, newEvt];
    localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(updated));
    notify();
    return newEvt;
  },

  updateEvent(id: string, updates: Partial<AdmissionEvent>): AdmissionEvent | null {
    const list = this.getEvents(false);
    const idx = list.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    const updatedEvt = {
      ...list[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    list[idx] = updatedEvt;
    localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(list));
    notify();
    return updatedEvt;
  },

  deleteEvent(id: string): boolean {
    const list = this.getEvents(false);
    const filtered = list.filter((e) => e.id !== id);
    if (filtered.length === list.length) return false;
    localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(filtered));
    notify();
    return true;
  },

  reorderEvents(eventIds: string[]) {
    const list = this.getEvents(false);
    const updated = list.map((item) => {
      const idx = eventIds.indexOf(item.id);
      if (idx !== -1) {
        return { ...item, order: idx + 1 };
      }
      return item;
    });
    localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(updated));
    notify();
  },

  setActiveStage(stageId: string): AdmissionStage | null {
    const stages = this.getStages();
    const target = stages.find((s) => s.id === stageId);
    if (!target) return null;

    const targetOrder = target.order;
    const updated = stages.map((s) => {
      if (s.id === stageId) {
        return {
          ...s,
          isCurrentActive: true,
          status: 'Currently Open' as const,
          updatedAt: new Date().toISOString(),
        };
      } else if (s.order < targetOrder) {
        return {
          ...s,
          isCurrentActive: false,
          status: 'Completed' as const,
          updatedAt: new Date().toISOString(),
        };
      } else {
        return {
          ...s,
          isCurrentActive: false,
          status: 'Upcoming' as const,
          updatedAt: new Date().toISOString(),
        };
      }
    });

    localStorage.setItem(STORAGE_STAGES_KEY, JSON.stringify(updated));
    notify();
    return updated.find((s) => s.id === stageId) || null;
  },

  addStage(data: Omit<AdmissionStage, 'id'>): AdmissionStage {
    const stages = this.getStages();
    const newStage: AdmissionStage = {
      ...data,
      id: `stage-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      order: data.order || stages.length + 1,
      updatedAt: new Date().toISOString(),
    };
    const updated = [...stages, newStage];
    localStorage.setItem(STORAGE_STAGES_KEY, JSON.stringify(updated));
    notify();
    return newStage;
  },

  updateStage(id: string, updates: Partial<AdmissionStage>): AdmissionStage | null {
    const stages = this.getStages();
    const idx = stages.findIndex((s) => s.id === id);
    if (idx === -1) return null;

    const updatedStage = {
      ...stages[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    stages[idx] = updatedStage;

    // If setting active via update, run setActiveStage
    if (updates.isCurrentActive) {
      return this.setActiveStage(id);
    }

    localStorage.setItem(STORAGE_STAGES_KEY, JSON.stringify(stages));
    notify();
    return updatedStage;
  },

  deleteStage(id: string): boolean {
    const stages = this.getStages();
    const filtered = stages.filter((s) => s.id !== id);
    if (filtered.length === stages.length) return false;
    localStorage.setItem(STORAGE_STAGES_KEY, JSON.stringify(filtered));
    notify();
    return true;
  },

  reorderStages(stageIds: string[]) {
    const stages = this.getStages();
    const updated = stages.map((s) => {
      const idx = stageIds.indexOf(s.id);
      if (idx !== -1) {
        return { ...s, order: idx + 1 };
      }
      return s;
    });
    localStorage.setItem(STORAGE_STAGES_KEY, JSON.stringify(updated));
    notify();
  },

  updateSettings(newSettings: Partial<AdmissionSettings>): AdmissionSettings {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(updated));
    notify();
    return updated;
  },

  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
