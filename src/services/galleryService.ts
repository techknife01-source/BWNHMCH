import toast from 'react-hot-toast';

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: 'Hospital & OPD' | 'Labs & Classrooms' | 'Events & Seminars' | 'Herbal Garden' | string;
  imageUrl: string;
  uploadDate: string;
  uploader: string;
  status: 'PUBLISHED' | 'HIDDEN' | 'DRAFT';
  displayOrder: number;
}

export interface GalleryFilterParams {
  search?: string;
  category?: string;
  status?: string; // 'ALL' | 'PUBLISHED' | 'HIDDEN' | 'DRAFT'
  sortBy?: 'displayOrder' | 'date' | 'title';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
  role?: string;
}

const STORAGE_KEY = 'bhmch_gallery_management_v1';

const INITIAL_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g1',
    title: '50-Bed Attached Teaching Hospital & OPD Building',
    category: 'Hospital & OPD',
    imageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800',
    description: 'Front facade of the hospital housing daily outpatient departments, casualty, and inpatient wards.',
    uploadDate: '2026-07-01',
    uploader: 'Principal Desk',
    status: 'PUBLISHED',
    displayOrder: 1,
  },
  {
    id: 'g2',
    title: 'Homoeopathic Pharmacy & HPLC Drug Standardization Lab',
    category: 'Labs & Classrooms',
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800',
    description: 'Students performing potentization and vehicle testing under senior pharmacy professors.',
    uploadDate: '2026-07-02',
    uploader: 'HOD Pharmacy',
    status: 'PUBLISHED',
    displayOrder: 2,
  },
  {
    id: 'g3',
    title: 'Annual Hahnemannian Oath Ceremony & Induction 2026',
    category: 'Events & Seminars',
    imageUrl: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=800',
    description: 'Fresh BHMS 2026 scholars taking the Hahnemannian Oath at the 250-seater air-conditioned auditorium.',
    uploadDate: '2026-07-05',
    uploader: 'Academic Administrator',
    status: 'PUBLISHED',
    displayOrder: 3,
  },
  {
    id: 'g4',
    title: 'Botanical Herbal Garden & Medicinal Flora Reserve',
    category: 'Herbal Garden',
    imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800',
    description: '250+ species of medicinal herbs preserved for practical drug identification and pharmacognosy study.',
    uploadDate: '2026-07-10',
    uploader: 'Materia Medica Dept',
    status: 'PUBLISHED',
    displayOrder: 4,
  },
  {
    id: 'g5',
    title: 'Central Digital Medical Library & E-Learning Workstations',
    category: 'Labs & Classrooms',
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800',
    description: 'Housing 12,000+ volumes of rare Homoeopathic treatises, WBUHS journals, and online databases.',
    uploadDate: '2026-07-12',
    uploader: 'Head Librarian',
    status: 'PUBLISHED',
    displayOrder: 5,
  },
  {
    id: 'g6',
    title: 'Free Rural Homoeopathic Medical Camp - Memari Village',
    category: 'Events & Seminars',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
    description: 'Interns and faculty doctors delivering free healthcare to over 600 rural patients in Purba Bardhaman.',
    uploadDate: '2026-07-15',
    uploader: 'NSS Coordinator',
    status: 'PUBLISHED',
    displayOrder: 6,
  },
  {
    id: 'g7',
    title: 'Anatomy Dissection Hall & Histology Microscope Room',
    category: 'Labs & Classrooms',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
    description: 'First year BHMS medical students exploring cadaveric dissection and tissue histology.',
    uploadDate: '2026-07-18',
    uploader: 'Anatomy HOD',
    status: 'PUBLISHED',
    displayOrder: 7,
  },
  {
    id: 'g8',
    title: 'Clinical Pathology Diagnostic & Culture Suite',
    category: 'Hospital & OPD',
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800',
    description: 'Equipped for hematology, biochemistry panels, and bacterial culture sensitivity testing.',
    uploadDate: '2026-07-20',
    uploader: 'Pathology Incharge',
    status: 'PUBLISHED',
    displayOrder: 8,
  },
];

class GalleryService {
  private items: GalleryItem[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.items = parsed;
          return;
        }
      }
    } catch (e) {
      console.error('Failed to parse gallery storage:', e);
    }
    this.items = [...INITIAL_GALLERY_ITEMS];
    this.saveToStorage();
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
      window.dispatchEvent(new Event('bhmch_gallery_updated'));
    } catch (e) {
      console.error('Failed to persist gallery to storage:', e);
    }
  }

  public getItems(params: GalleryFilterParams = {}): {
    data: GalleryItem[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  } {
    let result = [...this.items];

    // Role-based visibility check: non-authorized roles only see PUBLISHED items
    const role = (params.role || '').toUpperCase();
    const isAuthorized =
      role === 'SUPER_ADMIN' ||
      role === 'ROLE_SUPER_ADMIN' ||
      role === 'ADMIN' ||
      role === 'ROLE_ADMIN' ||
      role === 'PRINCIPAL' ||
      role === 'ROLE_PRINCIPAL' ||
      role === 'VICE_PRINCIPAL' ||
      role === 'ROLE_VICE_PRINCIPAL';

    if (!isAuthorized) {
      result = result.filter((item) => item.status === 'PUBLISHED');
    } else if (params.status && params.status !== 'ALL') {
      result = result.filter((item) => item.status === params.status);
    }

    // Category filter
    if (params.category && params.category !== 'All' && params.category !== 'ALL') {
      result = result.filter((item) => item.category === params.category);
    }

    // Search query
    if (params.search && params.search.trim() !== '') {
      const q = params.search.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.uploader.toLowerCase().includes(q)
      );
    }

    // Sorting
    const sortBy = params.sortBy || 'displayOrder';
    const sortOrder = params.sortOrder || 'asc';
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'displayOrder') {
        comparison = (a.displayOrder || 0) - (b.displayOrder || 0);
      } else if (sortBy === 'date') {
        comparison = new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      } else if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    // Pagination
    const page = params.page || 1;
    const pageSize = params.pageSize || 12;
    const total = result.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const startIndex = (page - 1) * pageSize;
    const paginated = result.slice(startIndex, startIndex + pageSize);

    return {
      data: paginated,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  public getAllPublished(): GalleryItem[] {
    return this.items
      .filter((i) => i.status === 'PUBLISHED')
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }

  public addMultiple(newItems: Array<Partial<GalleryItem>>, uploaderName = 'Admin'): GalleryItem[] {
    const added: GalleryItem[] = [];
    let maxOrder = this.items.reduce((max, i) => Math.max(max, i.displayOrder || 0), 0);

    newItems.forEach((item, index) => {
      maxOrder += 1;
      const created: GalleryItem = {
        id: `gal-${Date.now()}-${index}-${Math.floor(Math.random() * 1000)}`,
        title: item.title || `Gallery Upload ${maxOrder}`,
        description: item.description || 'Campus gallery photograph.',
        category: item.category || 'Hospital & OPD',
        imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800',
        uploadDate: new Date().toISOString().split('T')[0],
        uploader: item.uploader || uploaderName,
        status: item.status || 'PUBLISHED',
        displayOrder: item.displayOrder || maxOrder,
      };
      this.items.unshift(created);
      added.push(created);
    });

    this.saveToStorage();
    toast.success(`${added.length} image(s) uploaded successfully!`);
    return added;
  }

  public updateItem(id: string, updates: Partial<GalleryItem>): GalleryItem | undefined {
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1) return undefined;

    this.items[index] = {
      ...this.items[index],
      ...updates,
    };

    this.saveToStorage();
    toast.success('Gallery item updated successfully!');
    return this.items[index];
  }

  public deleteItem(id: string): boolean {
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1) return false;

    const [deleted] = this.items.splice(index, 1);
    this.saveToStorage();
    toast.success(`Image "${deleted.title}" deleted.`);
    return true;
  }

  public toggleHide(id: string): void {
    const item = this.items.find((i) => i.id === id);
    if (item) {
      item.status = item.status === 'PUBLISHED' ? 'HIDDEN' : 'PUBLISHED';
      this.saveToStorage();
      toast.success(item.status === 'PUBLISHED' ? 'Image unhidden & published!' : 'Image hidden from public gallery.');
    }
  }

  public reorderItem(id: string, direction: 'up' | 'down'): void {
    const sorted = [...this.items].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    const index = sorted.findIndex((i) => i.id === id);
    if (index === -1) return;

    if (direction === 'up' && index > 0) {
      const prevOrder = sorted[index - 1].displayOrder;
      sorted[index - 1].displayOrder = sorted[index].displayOrder;
      sorted[index].displayOrder = prevOrder;
    } else if (direction === 'down' && index < sorted.length - 1) {
      const nextOrder = sorted[index + 1].displayOrder;
      sorted[index + 1].displayOrder = sorted[index].displayOrder;
      sorted[index].displayOrder = nextOrder;
    }

    this.items = sorted;
    this.saveToStorage();
    toast.success('Gallery display order updated.');
  }

  // Bulk Actions
  public bulkDelete(ids: string[]): boolean {
    if (ids.length === 0) return false;
    this.items = this.items.filter((i) => !ids.includes(i.id));
    this.saveToStorage();
    toast.success(`${ids.length} gallery image(s) deleted.`);
    return true;
  }

  public bulkPublish(ids: string[]): void {
    if (ids.length === 0) return;
    this.items.forEach((i) => {
      if (ids.includes(i.id)) i.status = 'PUBLISHED';
    });
    this.saveToStorage();
    toast.success(`${ids.length} image(s) published.`);
  }

  public bulkHide(ids: string[]): void {
    if (ids.length === 0) return;
    this.items.forEach((i) => {
      if (ids.includes(i.id)) i.status = 'HIDDEN';
    });
    this.saveToStorage();
    toast.success(`${ids.length} image(s) hidden.`);
  }

  public bulkCategoryUpdate(ids: string[], category: string): void {
    if (ids.length === 0) return;
    this.items.forEach((i) => {
      if (ids.includes(i.id)) i.category = category;
    });
    this.saveToStorage();
    toast.success(`${ids.length} image(s) moved to ${category}.`);
  }

  public exportItems(ids?: string[]): string {
    const exportList = ids && ids.length > 0 ? this.items.filter((i) => ids.includes(i.id)) : this.items;
    return JSON.stringify(exportList, null, 2);
  }

  public importItems(jsonString: string): number {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) throw new Error('Invalid JSON format: expected an array.');
      let count = 0;
      parsed.forEach((item, index) => {
        if (item.title && item.imageUrl) {
          const newItem: GalleryItem = {
            id: item.id || `gal-imp-${Date.now()}-${index}`,
            title: item.title,
            description: item.description || '',
            category: item.category || 'Hospital & OPD',
            imageUrl: item.imageUrl,
            uploadDate: item.uploadDate || new Date().toISOString().split('T')[0],
            uploader: item.uploader || 'Imported Data',
            status: item.status || 'PUBLISHED',
            displayOrder: item.displayOrder || this.items.length + 1,
          };
          this.items.push(newItem);
          count++;
        }
      });
      this.saveToStorage();
      toast.success(`${count} gallery image(s) imported successfully!`);
      return count;
    } catch (e: any) {
      toast.error(`Import failed: ${e.message || 'Invalid file format'}`);
      return 0;
    }
  }
}

export const galleryService = new GalleryService();
