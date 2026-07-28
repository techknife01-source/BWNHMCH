export const APP_CONSTANTS = {
  INSTITUTION_NAME: "Burdwan Homeopathic Medical College & Hospital",
  SHORT_NAME: "BHMCH",
  ESTD_YEAR: "1978",
  AFFILIATION: "Affiliated to West Bengal University of Health Sciences (WBUHS) & Recognized by National Commission for Homoeopathy (NCH)",
  CONTACT_PHONE: "+91 342 263 4567",
  EMERGENCY_HELPLINE: "+91 342 263 9999",
  CONTACT_EMAIL: "principal@bhmch.ac.in",
  LOCATION: "Rajbati, Baburbag, Purba Bardhaman, West Bengal 713104",
  WORKING_HOURS: "Mon - Sat: 9:00 AM - 5:00 PM | Hospital: 24x7 Emergency",
};

export const PUBLIC_NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Departments", href: "/departments" },
  { label: "Courses & BHMS", href: "/courses" },
  { label: "Admission", href: "/admission" },
  { label: "Hospital & OPD", href: "/hospital" },
  { label: "Doctors", href: "/doctors" },
  { label: "Notices", href: "/notice" },
  { label: "Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
  { label: "Downloads", href: "/downloads" },
  { label: "Contact", href: "/contact" },
];

export const PORTAL_NAV_ITEMS = [
  { label: "Dashboard", href: "/portal/dashboard", roles: ["ALL"] },
  { label: "Student Portal", href: "/portal/student", roles: ["ROLE_STUDENT", "ROLE_ADMIN", "ROLE_SUPER_ADMIN"] },
  { label: "Faculty Portal", href: "/portal/faculty", roles: ["ROLE_FACULTY", "ROLE_ADMIN", "ROLE_SUPER_ADMIN"] },
  { label: "Principal Desk", href: "/portal/principal", roles: ["ROLE_PRINCIPAL", "ROLE_SUPER_ADMIN"] },
  { label: "Admin Operations", href: "/portal/admin", roles: ["ROLE_ADMIN", "ROLE_SUPER_ADMIN"] },
  { label: "Hospital Care", href: "/portal/hospital", roles: ["ROLE_HOSPITAL", "ROLE_SUPER_ADMIN"] },
  { label: "Digital Library", href: "/portal/librarian", roles: ["ROLE_LIBRARIAN", "ROLE_SUPER_ADMIN"] },
  { label: "Reception Desk", href: "/portal/reception", roles: ["ROLE_RECEPTIONIST", "ROLE_SUPER_ADMIN"] },
  { label: "Accounts & Fees", href: "/portal/account", roles: ["ROLE_ACCOUNTANT", "ROLE_SUPER_ADMIN"] },
  { label: "System Super Admin", href: "/portal/super-admin", roles: ["ROLE_SUPER_ADMIN"] },
];
