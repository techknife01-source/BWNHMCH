import toast from 'react-hot-toast';
import { adminHrService } from './adminHrService';

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
  isFeatured?: boolean;
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



const INITIAL_GALLERY_ITEMS: GalleryItem[] = [];

import { galleryApi } from './api/gallery.api';

const STORAGE_KEY = 'bhmch_gallery_management_v1';

class GalleryService {
  private items: GalleryItem[] = [];

  constructor() {
    this.cleanObsoleteStorage();
    this.items = [];
    this.syncFromBackend();
  }

  private cleanObsoleteStorage() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore if localStorage is restricted
    }
  }

  public async syncFromBackend() {
    try {
      const res = await galleryApi.getGalleryItems();
      if (res && res.success && Array.isArray(res.data)) {
        const fetched: GalleryItem[] = res.data.map((item: any, idx: number) => ({
          id: item.id || `g-${idx}`,
          title: item.title || 'Campus Gallery Photograph',
          description: item.description || '',
          category: item.category || 'Hospital & OPD',
          imageUrl: item.imageUrl || (item.image?.driveFileId ? `/api/v1/gallery/${item.id}/image?v=${item.image.driveFileId}` : ''),
          uploadDate: item.uploadDate || new Date().toISOString().split('T')[0],
          uploader: item.uploader || 'Administration',
          status: (item.status as any) || 'PUBLISHED',
          displayOrder: item.displayOrder || idx + 1,
          isFeatured: item.isFeatured ?? false,
        }));
        this.items = fetched;
        window.dispatchEvent(new Event('bhmch_gallery_updated'));
      }
    } catch (e) {
      console.warn('[GalleryService] Backend sync notice:', e);
    }
  }

  private notifyUpdate() {
    window.dispatchEvent(new Event('bhmch_gallery_updated'));
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
      role === 'OFFICE_ADMIN' ||
      role === 'ROLE_OFFICE_ADMIN' ||
      role === 'PRINCIPAL' ||
      role === 'ROLE_PRINCIPAL' ||
      role === 'VICE_PRINCIPAL' ||
      role === 'ROLE_VICE_PRINCIPAL' ||
      role === 'AUTHORIZED';

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
    const formattedTimestamp = `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    newItems.forEach((item, index) => {
      maxOrder += 1;
      const created: GalleryItem = {
        id: `gal-${Date.now()}-${index}-${Math.floor(Math.random() * 1000)}`,
        title: item.title || `Campus Gallery Photograph ${maxOrder}`,
        description: item.description || 'BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL campus gallery photograph.',
        category: item.category || 'Hospital & OPD',
        imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800',
        uploadDate: item.uploadDate || formattedTimestamp,
        uploader: item.uploader || uploaderName,
        status: item.status || 'PUBLISHED',
        displayOrder: item.displayOrder || maxOrder,
        isFeatured: item.isFeatured ?? false,
      };
      this.items.unshift(created);
      added.push(created);
    });

    this.notifyUpdate();
    this.safeLogAudit({
      module: 'GALLERY',
      action: 'UPLOAD_GALLERY_PHOTO',
      performedBy: uploaderName || 'Super Admin',
      userRole: 'ROLE_SUPER_ADMIN',
      details: `Uploaded ${added.length} new photo(s) to gallery category '${added[0]?.category || 'General'}'`,
      status: 'SUCCESS',
    });
    toast.success(`${added.length} gallery photo(s) uploaded successfully!`);
    return added;
  }

  public updateItem(id: string, updates: Partial<GalleryItem>): GalleryItem | undefined {
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1) {
      toast.error('Gallery image not found.');
      return undefined;
    }

    this.items[index] = {
      ...this.items[index],
      ...updates,
      uploadDate: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Updated)`,
    };

    this.notifyUpdate();
    this.safeLogAudit({
      module: 'GALLERY',
      action: 'EDIT_GALLERY_PHOTO',
      performedBy: 'Super Admin',
      userRole: 'ROLE_SUPER_ADMIN',
      details: `Edited gallery photo details/description for '${this.items[index].title}' (ID: ${id})`,
      status: 'SUCCESS',
    });
    toast.success('Gallery photo updated successfully!');
    return this.items[index];
  }

  public async deleteItem(id: string): Promise<boolean> {
    console.log('[Gallery Delete] BUTTON CLICKED');
    console.log('[Gallery Delete] ID:', id);
    console.log('[Gallery Delete] DELETE URL:', `/api/v1/gallery/${id}`);
    console.log('[Gallery Delete] CALLING BACKEND');
    try {
      const res = await galleryApi.deleteGalleryItem(id);
      console.log('[Gallery Delete] BACKEND RESPONSE:', res);
      console.log('[Gallery Delete] VERIFYING GET:');
      await this.syncFromBackend();
      const exists = this.items.some((item) => item.id === id);
      console.log('[Gallery Delete] VERIFY RESULT:', exists ? 'ID PRESENT (FAIL)' : 'ID ABSENT (PASS)');

      if (exists) {
        toast.error('Unable to delete photo. Server deletion failed.');
        return false;
      }

      this.safeLogAudit({
        module: 'GALLERY',
        action: 'DELETE_GALLERY_PHOTO',
        performedBy: 'Super Admin',
        userRole: 'ROLE_SUPER_ADMIN',
        details: `Deleted gallery photo ID '${id}'`,
        status: 'SUCCESS',
      });
      toast.success('Gallery photo deleted successfully!');
      return true;
    } catch (err: any) {
      console.error('[Gallery Delete Error]:', err);
      toast.error(`Unable to delete photo: ${err?.message || 'Server error'}`);
      return false;
    }
  }

  public toggleHide(id: string): void {
    const item = this.items.find((i) => i.id === id);
    if (item) {
      item.status = item.status === 'PUBLISHED' ? 'HIDDEN' : 'PUBLISHED';
      this.notifyUpdate();
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
    this.notifyUpdate();
    toast.success('Gallery display order updated.');
  }

  // Bulk Actions
  public async bulkDelete(ids: string[]): Promise<boolean> {
    if (ids.length === 0) return false;
    console.log('[Gallery Bulk Delete] BUTTON CLICKED, IDs:', ids);
    try {
      await galleryApi.bulkDeleteGalleryItems(ids);
      await this.syncFromBackend();
      toast.success(`${ids.length} gallery image(s) deleted.`);
      return true;
    } catch (err: any) {
      console.error('[Gallery Bulk Delete Error]:', err);
      toast.error(`Unable to delete photos: ${err?.message || 'Server error'}`);
      return false;
    }
  }

  public bulkPublish(ids: string[]): void {
    if (ids.length === 0) return;
    this.items.forEach((i) => {
      if (ids.includes(i.id)) i.status = 'PUBLISHED';
    });
    this.notifyUpdate();
    toast.success(`${ids.length} image(s) published.`);
  }

  public bulkHide(ids: string[]): void {
    if (ids.length === 0) return;
    this.items.forEach((i) => {
      if (ids.includes(i.id)) i.status = 'HIDDEN';
    });
    this.notifyUpdate();
    toast.success(`${ids.length} image(s) hidden.`);
  }

  public bulkCategoryUpdate(ids: string[], category: string): void {
    if (ids.length === 0) return;
    this.items.forEach((i) => {
      if (ids.includes(i.id)) i.category = category;
    });
    this.notifyUpdate();
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
      this.notifyUpdate();
      toast.success(`${count} gallery image(s) imported successfully!`);
      return count;
    } catch (e: any) {
      toast.error(`Import failed: ${e.message || 'Invalid file format'}`);
      return 0;
    }
  }
  private safeLogAudit(entry: {
    module: string;
    action: string;
    performedBy: string;
    userRole?: string;
    userEmail?: string;
    details: string;
    status?: string;
  }): void {
    try {
      if (adminHrService && typeof adminHrService.logAudit === 'function') {
        adminHrService.logAudit(entry);
      } else if (adminHrService && typeof adminHrService.addAuditLog === 'function') {
        adminHrService.addAuditLog(entry);
      } else {
        console.warn('[Gallery audit notice]: adminHrService audit method unavailable', entry);
      }
    } catch (e) {
      console.warn('[Gallery audit notice]: non-fatal audit log error', e);
    }
  }
}

export const galleryService = new GalleryService();
