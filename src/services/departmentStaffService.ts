import toast from 'react-hot-toast';
import { facultyApi } from './api/faculty.api';
import { departmentCmsService } from './departmentCmsService';
import { FacultyMemberCMS, DepartmentCMSData } from '../types/departmentCms';

export interface DepartmentStaffMember {
  id: string;
  name: string;
  facultyName?: string;
  departmentId: string;
  departmentName: string;
  department?: string;
  designation: string;
  qualification: string;
  specialization?: string;
  email: string;
  phone: string;
  photoUrl?: string;
  photo?: {
    driveFileId?: string;
    fileName?: string;
    mimeType?: string;
  };
  joiningDate?: string;
  promotionDate?: string;
  experienceYears?: number | string;
  registrationNumber?: string;
  registrationNo?: string;
  biography?: string;
  status: 'Active' | 'Inactive';
}

export interface StaffFilterParams {
  search?: string;
  departmentId?: string;
  status?: string; // 'ALL' | 'Active' | 'Inactive'
  sortBy?: 'name' | 'department' | 'designation';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export class DepartmentStaffService {
  private cachedStaff: DepartmentStaffMember[] | null = null;

  public static normalizeFacultyForApi(data: Partial<DepartmentStaffMember>): Record<string, any> {
    const name = data.name || data.facultyName || '';
    const departmentName = data.departmentName || data.department || '';
    const registrationNumber = data.registrationNumber || data.registrationNo || '';
    const joiningDate = data.joiningDate || (data as any).dateOfJoining || '';

    let cleanPhotoUrl = data.photoUrl || '';
    if (cleanPhotoUrl.startsWith('blob:')) {
      cleanPhotoUrl = '';
    }

    return {
      name,
      facultyName: name,
      department: departmentName,
      departmentName: departmentName,
      departmentId: data.departmentId,
      designation: data.designation || '',
      qualification: data.qualification || '',
      specialization: data.specialization || '',
      email: data.email || '',
      phone: data.phone || (data as any).mobile || '',
      registrationNumber,
      registrationNo: registrationNumber,
      joiningDate,
      promotionDate: data.promotionDate || '',
      experienceYears: data.experienceYears !== undefined ? data.experienceYears : '',
      biography: data.biography || (data as any).bio || '',
      status: data.status || 'Active',
      photoUrl: cleanPhotoUrl,
      photo: data.photo,
    };
  }



  public mapSingleFacultyFromApi(fac: any): DepartmentStaffMember {
    if (!fac) {
      return {
        id: `fac-${Date.now()}`,
        name: 'Faculty Member',
        facultyName: 'Faculty Member',
        departmentId: 'org',
        departmentName: 'Organon of Medicine',
        department: 'Organon of Medicine',
        designation: 'Faculty Member',
        qualification: 'M.D. (Hom.)',
        specialization: '',
        email: '',
        phone: '',
        registrationNumber: 'WB-NCH-1998-042',
        registrationNo: 'WB-NCH-1998-042',
        joiningDate: '2018-08-01',
        promotionDate: '',
        experienceYears: '10+ Years',
        biography: '',
        status: 'Active',
      };
    }

    const facId = fac.id || fac._id || `fac-${Date.now()}`;
    const name = fac.name || fac.facultyName || fac.fullName || '';
    const departmentName = fac.department || fac.departmentName || '';
    const departmentId = fac.departmentId || 'org';
    const designation = fac.designation || '';
    const qualification = fac.qualification !== undefined && fac.qualification !== null ? fac.qualification : '';
    const specialization = fac.specialization !== undefined && fac.specialization !== null ? fac.specialization : '';
    const email = fac.email !== undefined && fac.email !== null ? fac.email : '';
    const phone = fac.phone !== undefined && fac.phone !== null ? fac.phone : (fac.mobile || fac.phoneNumber || '');
    const registrationNumber = fac.registrationNumber !== undefined && fac.registrationNumber !== null ? fac.registrationNumber : (fac.registrationNo || fac.regNo || '');
    const joiningDate = fac.joiningDate !== undefined && fac.joiningDate !== null ? fac.joiningDate : (fac.dateOfJoining || '');
    const promotionDate = fac.promotionDate !== undefined && fac.promotionDate !== null ? fac.promotionDate : '';
    const experienceYears = fac.experienceYears !== undefined && fac.experienceYears !== null ? String(fac.experienceYears) : (fac.experience || '');
    const biography = fac.biography !== undefined && fac.biography !== null ? fac.biography : (fac.bio || '');
    const status = (fac.status as any) === 'Inactive' || (fac.status as any) === 'INACTIVE' ? 'Inactive' : 'Active';

    const photoUrl = fac.photo?.driveFileId
      ? facultyApi.getFacultyPhotoUrl(facId, fac.photo.driveFileId)
      : (fac.photoUrl || fac.imageUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400');

    return {
      id: facId,
      name,
      facultyName: name,
      departmentId,
      departmentName,
      department: departmentName,
      designation,
      qualification,
      specialization,
      email,
      phone,
      photoUrl,
      photo: fac.photo,
      joiningDate,
      promotionDate,
      experienceYears,
      registrationNumber,
      registrationNo: registrationNumber,
      biography,
      status,
    };
  }

  public async fetchStaffFromBackend(): Promise<DepartmentStaffMember[]> {
    try {
      const res = await facultyApi.getFacultyList();
      const rawList = Array.isArray(res)
        ? res
        : (Array.isArray(res?.data)
          ? res.data
          : (Array.isArray(res?.data?.content) ? res.data.content : null));

      if (Array.isArray(rawList)) {
        const mapped: DepartmentStaffMember[] = rawList.map((fac: any) => this.mapSingleFacultyFromApi(fac));
        this.cachedStaff = mapped;
        return mapped;
      }
    } catch (err) {
      console.warn('[DepartmentStaffService] Backend API fetch notice, falling back to cached state:', err);
    }
    if (this.cachedStaff !== null) {
      return this.cachedStaff;
    }
    return this.getAllStaff();
  }

  public async getFilteredStaffAsync(params: StaffFilterParams = {}): Promise<{
    data: DepartmentStaffMember[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const list = await this.fetchStaffFromBackend();
    let result = [...list];

    // Search filter
    if (params.search && params.search.trim() !== '') {
      const q = params.search.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.departmentName.toLowerCase().includes(q) ||
          s.designation.toLowerCase().includes(q) ||
          s.qualification.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.phone.includes(q) ||
          (s.registrationNumber && s.registrationNumber.toLowerCase().includes(q))
      );
    }

    // Department filter
    if (params.departmentId && params.departmentId !== 'ALL' && params.departmentId !== 'All') {
      result = result.filter((s) => s.departmentId === params.departmentId);
    }

    // Status filter
    if (params.status && params.status !== 'ALL') {
      result = result.filter((s) => s.status === params.status);
    }

    // Sort
    const sortBy = params.sortBy || 'name';
    const sortOrder = params.sortOrder || 'asc';
    result.sort((a, b) => {
      let comp = 0;
      if (sortBy === 'name') comp = a.name.localeCompare(b.name);
      else if (sortBy === 'department') comp = a.departmentName.localeCompare(b.departmentName);
      else if (sortBy === 'designation') comp = a.designation.localeCompare(b.designation);
      return sortOrder === 'desc' ? -comp : comp;
    });

    // Pagination
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const total = result.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const startIndex = (page - 1) * pageSize;
    const paginated = result.slice(startIndex, startIndex + pageSize);

    const retAsync = {
      data: paginated,
      total,
      page,
      pageSize,
      totalPages,
    };
    console.log('[FACULTY SERVICE ASYNC]', {
      time: performance.now(),
      count: retAsync.data.length,
      total: retAsync.total,
      names: retAsync.data.map((x) => x.name),
      source: 'getFilteredStaffAsync',
    });
    return retAsync;
  }

  public async getFacultyByIdAsync(id: string): Promise<DepartmentStaffMember | null> {
    try {
      const res = await facultyApi.getFacultyById(id);
      const target = res?.data || res;
      if (target) {
        return this.mapSingleFacultyFromApi(target);
      }
    } catch (err) {
      console.warn('[DepartmentStaffService] Single faculty API fetch notice:', err);
    }
    return null;
  }

  public getAllStaff(): DepartmentStaffMember[] {
    const depts = departmentCmsService.getDepartments();
    const staffList: DepartmentStaffMember[] = [];

    depts.forEach((dept) => {
      if (Array.isArray(dept.facultyList)) {
        dept.facultyList.forEach((fac) => {
          const photoUrl = fac.photo?.driveFileId
            ? facultyApi.getFacultyPhotoUrl(fac.id, fac.photo.driveFileId)
            : (fac.photoUrl || fac.imageUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400');

          staffList.push({
            id: fac.id,
            name: fac.name,
            departmentId: dept.id,
            departmentName: dept.name,
            designation: fac.designation,
            qualification: fac.qualification,
            specialization: fac.specialization || '',
            email: fac.email,
            phone: fac.phone || '',
            photoUrl,
            photo: fac.photo,
            joiningDate: fac.joiningDate || '2018-08-01',
            experienceYears: fac.experienceYears || '10+ Years',
            registrationNumber: fac.registrationNumber || 'WB-NCH-1998-042',
            biography: fac.biography || `${fac.designation} in ${dept.name} with academic and clinical experience.`,
            status: (fac.status as any) === 'Inactive' || (fac.status as any) === 'INACTIVE' ? 'Inactive' : 'Active',
          });
        });
      }
    });

    return staffList;
  }

  public getFilteredStaff(params: StaffFilterParams = {}): {
    data: DepartmentStaffMember[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  } {
    let result = this.getAllStaff();

    if (params.search && params.search.trim() !== '') {
      const q = params.search.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.departmentName.toLowerCase().includes(q) ||
          s.designation.toLowerCase().includes(q) ||
          s.qualification.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.phone.includes(q) ||
          (s.registrationNumber && s.registrationNumber.toLowerCase().includes(q))
      );
    }

    if (params.departmentId && params.departmentId !== 'ALL' && params.departmentId !== 'All') {
      result = result.filter((s) => s.departmentId === params.departmentId);
    }

    if (params.status && params.status !== 'ALL') {
      result = result.filter((s) => s.status === params.status);
    }

    const sortBy = params.sortBy || 'name';
    const sortOrder = params.sortOrder || 'asc';
    result.sort((a, b) => {
      let comp = 0;
      if (sortBy === 'name') comp = a.name.localeCompare(b.name);
      else if (sortBy === 'department') comp = a.departmentName.localeCompare(b.departmentName);
      else if (sortBy === 'designation') comp = a.designation.localeCompare(b.designation);
      return sortOrder === 'desc' ? -comp : comp;
    });

    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const total = result.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const startIndex = (page - 1) * pageSize;
    const paginated = result.slice(startIndex, startIndex + pageSize);

    const retSync = {
      data: paginated,
      total,
      page,
      pageSize,
      totalPages,
    };
    console.log('[FACULTY SERVICE SYNC]', {
      time: performance.now(),
      count: retSync.data.length,
      total: retSync.total,
      names: retSync.data.map((x) => x.name),
      source: 'getFilteredStaff',
    });
    return retSync;
  }

  public async addStaffAsync(staffData: Partial<DepartmentStaffMember>): Promise<DepartmentStaffMember> {
    try {
      const name = (staffData as any).name || (staffData as any).facultyName || 'New Faculty Member';
      const department = staffData.departmentName || (staffData as any).department || 'Organon of Medicine';
      const registrationNumber = staffData.registrationNumber || (staffData as any).registrationNo || '';

      const category = (staffData as any).category || 'ACADEMIC FACULTY';
      const roleCategory = (staffData as any).roleCategory || 'MEDICAL_STAFF';

      // Clean photoUrl to ensure blob URLs are never sent to API
      let cleanPhotoUrl = staffData.photoUrl || '';
      if (cleanPhotoUrl.startsWith('blob:')) {
        cleanPhotoUrl = '';
      }

      const payload = {
        name,
        facultyName: name,
        designation: staffData.designation || 'Assistant Professor',
        department,
        departmentName: department,
        departmentId: staffData.departmentId || 'org',
        category,
        roleCategory,
        qualification: staffData.qualification || 'M.D. (Hom.)',
        specialization: staffData.specialization || '',
        email: staffData.email || '',
        phone: staffData.phone || '',
        registrationNumber,
        registrationNo: registrationNumber,
        joiningDate: staffData.joiningDate || new Date().toISOString().split('T')[0],
        promotionDate: staffData.promotionDate || '',
        experienceYears: String(staffData.experienceYears || '5+ Years'),
        biography: staffData.biography || '',
        status: staffData.status || 'Active',
        photoUrl: cleanPhotoUrl,
      };
      const res = await facultyApi.createFaculty(payload);
      const target = res?.data || res;
      if (target && (target.id || target._id || target.name || target.facultyName)) {
        toast.success(`Faculty member "${name}" saved to MongoDB!`);
        return this.mapSingleFacultyFromApi(target);
      }
      throw new Error(res?.message || 'Failed to create faculty member on backend');
    } catch (err: any) {
      console.error('[DepartmentStaffService] Add faculty API error:', err);
      throw err;
    }
  }


  public async updateStaffAsync(id: string, updates: Partial<DepartmentStaffMember>): Promise<DepartmentStaffMember> {
    try {
      const payload = DepartmentStaffService.normalizeFacultyForApi(updates);
      if (updates.department || updates.departmentName) {
        const deptStr = (updates.department || updates.departmentName)!.trim();
        payload.department = deptStr;
        payload.departmentName = deptStr;
      }

      console.log('[FACULTY SERVICE] updateStaffAsync payload:', { id, payload });

      const res = await facultyApi.updateFaculty(id, payload);
      const target = res?.data || res;
      if (target && (target.id || target._id || target.name || target.facultyName)) {
        return this.mapSingleFacultyFromApi(target);
      }
      throw new Error(res?.message || 'Failed to update faculty member in MongoDB Atlas');
    } catch (err: any) {
      console.error('[DepartmentStaffService] Update faculty API error:', err);
      throw err;
    }
  }

  public async deleteStaffAsync(id: string): Promise<boolean> {
    try {
      const res = await facultyApi.deleteFaculty(id);
      if (res && res.success) {
        if (this.cachedStaff) {
          this.cachedStaff = this.cachedStaff.filter((s) => s.id !== id);
        }
        this.deleteStaff(id, false);
        window.dispatchEvent(new Event('bhmch_department_cms_updated'));
        toast.success(`Faculty record deleted permanently.`);
        return true;
      }
      throw new Error(res?.message || 'Failed to delete faculty record from MongoDB Atlas');
    } catch (err: any) {
      console.error('[DepartmentStaffService] Delete faculty API error:', err);
      throw err;
    }
  }

  public addStaff(staffData: Partial<DepartmentStaffMember>): DepartmentStaffMember {
    const depts = departmentCmsService.getDepartments();
    const targetDeptId = staffData.departmentId || depts[0]?.id || 'org';
    const targetDept = depts.find((d) => d.id === targetDeptId) || depts[0];

    const newFacultyId = `fac-${Date.now()}`;
    const newFaculty: FacultyMemberCMS = {
      id: newFacultyId,
      name: staffData.name || 'New Faculty Member',
      designation: staffData.designation || 'Assistant Professor',
      qualification: staffData.qualification || 'M.D. (Hom.)',
      specialization: staffData.specialization || 'Clinical Homoeopathy',
      email: staffData.email || 'faculty@bhmch.ac.in',
      phone: staffData.phone || '+91 98300 00000',
      imageUrl: staffData.photoUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
      photoUrl: staffData.photoUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
      joiningDate: staffData.joiningDate || new Date().toISOString().split('T')[0],
      experienceYears: String(staffData.experienceYears || '5+ Years'),
      registrationNumber: staffData.registrationNumber || 'WB-NCH-2020-001',
      biography: staffData.biography || '',
      status: staffData.status || 'Active',
    };

    if (!targetDept.facultyList) targetDept.facultyList = [];
    targetDept.facultyList.push(newFaculty);

    departmentCmsService.saveDepartment(targetDept);
    window.dispatchEvent(new Event('bhmch_department_cms_updated'));
    toast.success(`Faculty member "${newFaculty.name}" added to ${targetDept.name}!`);

    return {
      ...staffData,
      id: newFacultyId,
      departmentId: targetDept.id,
      departmentName: targetDept.name,
      name: newFaculty.name,
      designation: newFaculty.designation,
      qualification: newFaculty.qualification,
      specialization: newFaculty.specialization,
      email: newFaculty.email,
      phone: newFaculty.phone,
      photoUrl: newFaculty.imageUrl,
      status: newFaculty.status as 'Active' | 'Inactive',
    } as DepartmentStaffMember;
  }

  public updateStaff(id: string, updates: Partial<DepartmentStaffMember>): boolean {
    const depts = departmentCmsService.getDepartments();
    let foundDept: DepartmentCMSData | null = null;
    let facultyIndex = -1;

    for (const d of depts) {
      if (Array.isArray(d.facultyList)) {
        const idx = d.facultyList.findIndex((f) => f.id === id);
        if (idx !== -1) {
          foundDept = d;
          facultyIndex = idx;
          break;
        }
      }
    }

    if (!foundDept || facultyIndex === -1) {
      toast.error('Faculty record not found.');
      return false;
    }

    const currentFac = foundDept.facultyList[facultyIndex];

    // Check if transferring to a different department
    if (updates.departmentId && updates.departmentId !== foundDept.id) {
      const newDept = depts.find((d) => d.id === updates.departmentId);
      if (newDept) {
        // Remove from old department
        foundDept.facultyList.splice(facultyIndex, 1);
        departmentCmsService.saveDepartment(foundDept);

        // Update properties
        const updatedFac: FacultyMemberCMS = {
          ...currentFac,
          name: updates.name ?? currentFac.name,
          designation: updates.designation ?? currentFac.designation,
          qualification: updates.qualification ?? currentFac.qualification,
          specialization: updates.specialization ?? currentFac.specialization,
          email: updates.email ?? currentFac.email,
          phone: updates.phone ?? currentFac.phone,
          imageUrl: updates.photoUrl ?? currentFac.imageUrl ?? currentFac.photoUrl,
          photoUrl: updates.photoUrl ?? currentFac.photoUrl ?? currentFac.imageUrl,
          photo: updates.photo ?? currentFac.photo,
          joiningDate: updates.joiningDate ?? currentFac.joiningDate,
          experienceYears: String(updates.experienceYears ?? currentFac.experienceYears ?? '5+ Years'),
          registrationNumber: updates.registrationNumber ?? currentFac.registrationNumber,
          biography: updates.biography ?? currentFac.biography,
          status: updates.status ?? currentFac.status ?? 'Active',
        };

        if (!newDept.facultyList) newDept.facultyList = [];
        newDept.facultyList.push(updatedFac);
        departmentCmsService.saveDepartment(newDept);

        window.dispatchEvent(new Event('bhmch_department_cms_updated'));
        toast.success(`Faculty "${updatedFac.name}" transferred to ${newDept.name}!`);
        return true;
      }
    }

    // Same department update
    foundDept.facultyList[facultyIndex] = {
      ...currentFac,
      name: updates.name ?? currentFac.name,
      designation: updates.designation ?? currentFac.designation,
      qualification: updates.qualification ?? currentFac.qualification,
      specialization: updates.specialization ?? currentFac.specialization,
      email: updates.email ?? currentFac.email,
      phone: updates.phone ?? currentFac.phone,
      imageUrl: updates.photoUrl ?? currentFac.imageUrl ?? currentFac.photoUrl,
      photoUrl: updates.photoUrl ?? currentFac.photoUrl ?? currentFac.imageUrl,
      photo: updates.photo ?? currentFac.photo,
      joiningDate: updates.joiningDate ?? currentFac.joiningDate,
      experienceYears: String(updates.experienceYears ?? currentFac.experienceYears ?? '5+ Years'),
      registrationNumber: updates.registrationNumber ?? currentFac.registrationNumber,
      biography: updates.biography ?? currentFac.biography,
      status: updates.status ?? currentFac.status ?? 'Active',
    };

    departmentCmsService.saveDepartment(foundDept);
    window.dispatchEvent(new Event('bhmch_department_cms_updated'));
    toast.success(`Faculty profile for "${foundDept.facultyList[facultyIndex].name}" updated!`);
    return true;
  }

  public deleteStaff(id: string, showToast = true): boolean {
    const depts = departmentCmsService.getDepartments();
    for (const d of depts) {
      if (Array.isArray(d.facultyList)) {
        const idx = d.facultyList.findIndex((f) => f.id === id);
        if (idx !== -1) {
          const [deleted] = d.facultyList.splice(idx, 1);
          departmentCmsService.saveDepartment(d);
          window.dispatchEvent(new Event('bhmch_department_cms_updated'));
          if (showToast) {
            toast.success(`Faculty member "${deleted.name}" removed from ${d.name}.`);
          }
          return true;
        }
      }
    }
    if (showToast) {
      toast.error('Staff member not found.');
    }
    return false;
  }

  // Bulk operations
  public bulkDelete(ids: string[]): boolean {
    if (ids.length === 0) return false;
    const depts = departmentCmsService.getDepartments();
    let count = 0;

    depts.forEach((d) => {
      if (Array.isArray(d.facultyList)) {
        const origLen = d.facultyList.length;
        d.facultyList = d.facultyList.filter((f) => !ids.includes(f.id));
        if (d.facultyList.length !== origLen) {
          count += origLen - d.facultyList.length;
          departmentCmsService.saveDepartment(d);
        }
      }
    });

    window.dispatchEvent(new Event('bhmch_department_cms_updated'));
    toast.success(`${count} faculty member(s) deleted.`);
    return true;
  }

  public bulkTransfer(ids: string[], newDeptId: string): boolean {
    if (ids.length === 0) return false;
    const depts = departmentCmsService.getDepartments();
    const targetDept = depts.find((d) => d.id === newDeptId);
    if (!targetDept) {
      toast.error('Target department not found.');
      return false;
    }

    const transferredFaculties: FacultyMemberCMS[] = [];

    depts.forEach((d) => {
      if (d.id !== newDeptId && Array.isArray(d.facultyList)) {
        const keep: FacultyMemberCMS[] = [];
        d.facultyList.forEach((f) => {
          if (ids.includes(f.id)) {
            transferredFaculties.push(f);
          } else {
            keep.push(f);
          }
        });
        if (d.facultyList.length !== keep.length) {
          d.facultyList = keep;
          departmentCmsService.saveDepartment(d);
        }
      }
    });

    if (transferredFaculties.length > 0) {
      if (!targetDept.facultyList) targetDept.facultyList = [];
      targetDept.facultyList.push(...transferredFaculties);
      departmentCmsService.saveDepartment(targetDept);
      window.dispatchEvent(new Event('bhmch_department_cms_updated'));
      toast.success(`${transferredFaculties.length} faculty member(s) transferred to ${targetDept.name}!`);
      return true;
    }

    return false;
  }

  public bulkStatusUpdate(ids: string[], status: 'Active' | 'Inactive'): void {
    if (ids.length === 0) return;
    const depts = departmentCmsService.getDepartments();
    let updatedCount = 0;

    depts.forEach((d) => {
      if (Array.isArray(d.facultyList)) {
        let modified = false;
        d.facultyList.forEach((f) => {
          if (ids.includes(f.id)) {
            f.status = status;
            modified = true;
            updatedCount++;
          }
        });
        if (modified) departmentCmsService.saveDepartment(d);
      }
    });

    window.dispatchEvent(new Event('bhmch_department_cms_updated'));
    toast.success(`${updatedCount} staff member(s) set to ${status}.`);
  }

  public exportStaff(ids?: string[]): string {
    const all = this.getAllStaff();
    const targetList = ids && ids.length > 0 ? all.filter((s) => ids.includes(s.id)) : all;
    return JSON.stringify(targetList, null, 2);
  }

  public importStaff(jsonString: string): number {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) throw new Error('Expected array format in JSON.');
      let imported = 0;

      parsed.forEach((item) => {
        if (item.name) {
          this.addStaff(item);
          imported++;
        }
      });

      toast.success(`${imported} staff record(s) imported successfully!`);
      return imported;
    } catch (e: any) {
      toast.error(`Import error: ${e.message || 'Invalid format'}`);
      return 0;
    }
  }
}

export const departmentStaffService = new DepartmentStaffService();
