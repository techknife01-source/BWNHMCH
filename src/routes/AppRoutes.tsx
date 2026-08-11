import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from '../components/layout/PublicLayout';
import { AuthLayout } from '../components/layout/AuthLayout';
import { DashboardLayout } from '../components/layout/DashboardLayout';

// Public Pages
import { HomePage } from '../pages/public/HomePage';
import { AboutPage } from '../pages/public/AboutPage';
import { PrincipalDeskPage } from '../pages/public/PrincipalDeskPage';
import { DepartmentsPage } from '../pages/public/DepartmentsPage';
import { CoursesPage } from '../pages/public/CoursesPage';
import { AdmissionPage } from '../pages/public/AdmissionPage';
import { HospitalPage } from '../pages/public/HospitalPage';
import { DoctorsPage } from '../pages/public/DoctorsPage';
import { StaffPage } from '../pages/public/StaffPage';
import { GalleryPage } from '../pages/public/GalleryPage';
import { ContactPage } from '../pages/public/ContactPage';
import { NoticePage } from '../pages/public/NoticePage';
import { NewsPage } from '../pages/public/NewsPage';
import { EventsPage } from '../pages/public/EventsPage';
import { DownloadsPage } from '../pages/public/DownloadsPage';
import { LibraryPage } from '../pages/public/LibraryPage';
import { AcademicActivityPage } from '../pages/public/AcademicActivityPage';
import { FacultyDirectoryPage } from '../pages/public/FacultyDirectoryPage';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { StudentLoginPage } from '../pages/auth/StudentLoginPage';
import { FacultyLoginPage } from '../pages/auth/FacultyLoginPage';
import { AdminLoginPage } from '../pages/auth/AdminLoginPage';

// Portal Pages
import { DashboardPage } from '../pages/portals/DashboardPage';
import { StudentPortalPage } from '../pages/portals/StudentPortalPage';
import { FacultyPortalPage } from '../pages/portals/FacultyPortalPage';
import { PrincipalPortalPage } from '../pages/portals/PrincipalPortalPage';
import { AdminPortalPage } from '../pages/portals/AdminPortalPage';
import { HospitalPortalPage } from '../pages/portals/HospitalPortalPage';
import { LibrarianPortalPage } from '../pages/portals/LibrarianPortalPage';
import { ReceptionPortalPage } from '../pages/portals/ReceptionPortalPage';
import { AccountPortalPage } from '../pages/portals/AccountPortalPage';
import { SuperAdminPortalPage } from '../pages/portals/SuperAdminPortalPage';

// CMS Module Pages
import { CmsDashboardPage } from '../modules/cms/pages/CmsDashboardPage';

// Faculty Module Pages
import { DashboardPage as FacultyDashboardPage } from '../modules/faculty/pages/DashboardPage';
import { ProfilePage as FacultyProfilePage } from '../modules/faculty/pages/ProfilePage';
import { ClassesPage as FacultyClassesPage } from '../modules/faculty/pages/ClassesPage';
import { AttendancePage as FacultyAttendancePage } from '../modules/faculty/pages/AttendancePage';
import { AssignmentsPage as FacultyAssignmentsPage } from '../modules/faculty/pages/AssignmentsPage';
import { StudyMaterialPage as FacultyStudyMaterialPage } from '../modules/faculty/pages/StudyMaterialPage';
import { ExaminationsPage as FacultyExaminationsPage } from '../modules/faculty/pages/ExaminationsPage';
import { ResultsPage as FacultyResultsPage } from '../modules/faculty/pages/ResultsPage';
import { ResearchPage as FacultyResearchPage } from '../modules/faculty/pages/ResearchPage';
import { LibraryPage as FacultyLibraryPage } from '../modules/faculty/pages/LibraryPage';
import { HospitalPage as FacultyHospitalPage } from '../modules/faculty/pages/HospitalPage';
import { DepartmentPage as FacultyDepartmentPage } from '../modules/faculty/pages/DepartmentPage';
import { SettingsPage as FacultySettingsPage } from '../modules/faculty/pages/SettingsPage';

// Common Pages
import { ProfilePage } from '../pages/common/ProfilePage';
import { SettingsPage } from '../pages/common/SettingsPage';
import { NotFoundPage } from '../pages/common/NotFoundPage';
import { UnauthorizedPage } from '../pages/common/UnauthorizedPage';

// Route Guards
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { GuestRoute } from './GuestRoute';
import { RoleBasedRoute } from './RoleBasedRoute';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/principal-desk" element={<PrincipalDeskPage />} />
        <Route path="/departments" element={<DepartmentsPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/admission" element={<AdmissionPage />} />
        <Route path="/hospital" element={<HospitalPage />} />
        <Route path="/investigation" element={<HospitalPage defaultTab="investigations" />} />
        <Route path="/investigations" element={<HospitalPage defaultTab="investigations" />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/staff" element={<StaffPage />} />
        <Route path="/hospital-staff" element={<StaffPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/notice" element={<NoticePage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/downloads" element={<DownloadsPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/academic-activity" element={<AcademicActivityPage />} />
        <Route path="/academic-activities" element={<AcademicActivityPage />} />
        <Route path="/faculty-directory" element={<FacultyDirectoryPage />} />
      </Route>

      {/* Auth Pages (Guest Only) */}
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/student" element={<StudentLoginPage />} />
          <Route path="/login/faculty" element={<FacultyLoginPage />} />
          <Route path="/login/admin" element={<AdminLoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>
      </Route>

      {/* Protected Portal Pages */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/portal/dashboard" element={<DashboardPage />} />
          <Route path="/portal/profile" element={<ProfilePage />} />
          <Route path="/portal/settings" element={<SettingsPage />} />

          {/* Student Portal */}
          <Route element={<RoleBasedRoute allowedRoles={['ROLE_STUDENT', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN']} />}>
            <Route path="/portal/student" element={<StudentPortalPage />} />
          </Route>

          {/* Faculty Portal */}
          <Route element={<RoleBasedRoute allowedRoles={['ROLE_FACULTY', 'ROLE_PRINCIPAL', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN']} />}>
            <Route path="/portal/faculty" element={<FacultyPortalPage />} />
          </Route>

          {/* Principal Portal */}
          <Route element={<RoleBasedRoute allowedRoles={['ROLE_PRINCIPAL', 'ROLE_SUPER_ADMIN']} />}>
            <Route path="/portal/principal" element={<PrincipalPortalPage />} />
          </Route>

          {/* Admin Portal & CMS Management */}
          <Route element={<RoleBasedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_PRINCIPAL', 'ROLE_SUPER_ADMIN']} />}>
            <Route path="/portal/admin" element={<AdminPortalPage />} />
            <Route path="/portal/cms" element={<CmsDashboardPage />} />
          </Route>

          {/* Hospital Portal */}
          <Route element={<RoleBasedRoute allowedRoles={['ROLE_HOSPITAL_STAFF', 'ROLE_DOCTOR', 'ROLE_FACULTY', 'ROLE_SUPER_ADMIN']} />}>
            <Route path="/portal/hospital" element={<HospitalPortalPage />} />
          </Route>

          {/* Digital Library Portal (Faculty & Student E-Library) */}
          <Route element={<RoleBasedRoute allowedRoles={['ALL']} />}>
            <Route path="/portal/library" element={<LibrarianPortalPage />} />
          </Route>

          {/* Reception Portal */}
          <Route element={<RoleBasedRoute allowedRoles={['ROLE_RECEPTIONIST', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN']} />}>
            <Route path="/portal/reception" element={<ReceptionPortalPage />} />
          </Route>

          {/* Account Portal */}
          <Route element={<RoleBasedRoute allowedRoles={['ROLE_ACCOUNTANT', 'ROLE_SUPER_ADMIN']} />}>
            <Route path="/portal/accounts" element={<AccountPortalPage />} />
          </Route>

          {/* Super Admin Portal */}
          <Route element={<RoleBasedRoute allowedRoles={['ROLE_SUPER_ADMIN']} />}>
            <Route path="/portal/super-admin" element={<SuperAdminPortalPage />} />
          </Route>
        </Route>

        {/* Dedicated Faculty Module Routes */}
        <Route element={<RoleBasedRoute allowedRoles={['ROLE_FACULTY', 'ROLE_PRINCIPAL', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN']} />}>
          <Route path="/faculty" element={<Navigate to="/faculty/dashboard" replace />} />
          <Route path="/faculty/dashboard" element={<FacultyDashboardPage />} />
          <Route path="/faculty/profile" element={<FacultyProfilePage />} />
          <Route path="/faculty/classes" element={<FacultyClassesPage />} />
          <Route path="/faculty/attendance" element={<FacultyAttendancePage />} />
          <Route path="/faculty/assignments" element={<FacultyAssignmentsPage />} />
          <Route path="/faculty/study-material" element={<FacultyStudyMaterialPage />} />
          <Route path="/faculty/results" element={<FacultyResultsPage />} />
          <Route path="/faculty/examinations" element={<FacultyExaminationsPage />} />
          <Route path="/faculty/research" element={<FacultyResearchPage />} />
          <Route path="/faculty/library" element={<FacultyLibraryPage />} />
          <Route path="/faculty/hospital" element={<FacultyHospitalPage />} />
          <Route path="/faculty/department" element={<FacultyDepartmentPage />} />
          <Route path="/faculty/settings" element={<FacultySettingsPage />} />
        </Route>

        {/* Dedicated Student Module Routes */}
        <Route element={<RoleBasedRoute allowedRoles={['ROLE_STUDENT', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN']} />}>
          <Route path="/student" element={<Navigate to="/portal/student" replace />} />
          <Route path="/student/*" element={<Navigate to="/portal/student" replace />} />
        </Route>
      </Route>

      {/* Common Fallback Routes */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
