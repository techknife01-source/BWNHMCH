import toast from 'react-hot-toast';
import { departmentCmsService } from './departmentCmsService';
import { FacultyMemberCMS, DepartmentCMSData } from '../types/departmentCms';

export interface DepartmentStaffMember {
  id: string;
  name: string;
  departmentId: string;
  departmentName: string;
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
  experienceYears?: number | string;
  registrationNumber?: string;
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

class DepartmentStaffService {
  public getAllStaff(): DepartmentStaffMember[] {
    const depts = departmentCmsService.getDepartments();
    const staffList: DepartmentStaffMember[] = [];

    depts.forEach((dept) => {
      if (Array.isArray(dept.facultyList)) {
        dept.facultyList.forEach((fac) => {
          const photoUrl = fac.photo?.driveFileId
            ? `/api/v1/faculty/${fac.id}/photo?v=${fac.photo.driveFileId}`
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

    return {
      data: paginated,
      total,
      page,
      pageSize,
      totalPages,
    };
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

  public deleteStaff(id: string): boolean {
    const depts = departmentCmsService.getDepartments();
    for (const d of depts) {
      if (Array.isArray(d.facultyList)) {
        const idx = d.facultyList.findIndex((f) => f.id === id);
        if (idx !== -1) {
          const [deleted] = d.facultyList.splice(idx, 1);
          departmentCmsService.saveDepartment(d);
          window.dispatchEvent(new Event('bhmch_department_cms_updated'));
          toast.success(`Faculty member "${deleted.name}" removed from ${d.name}.`);
          return true;
        }
      }
    }
    toast.error('Staff member not found.');
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
