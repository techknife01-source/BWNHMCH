const fs = require('fs');
const path = require('path');

const javaFilePath = path.join(__dirname, '..', 'backend', 'src', 'main', 'java', 'com', 'homeopathy', 'college', 'config', 'DatabaseSeeder.java');
const javaFile = fs.readFileSync(javaFilePath, 'utf8');

const matches = [...javaFile.matchAll(/Faculty\.builder\(\)([\s\S]*?)\.build\(\)/g)];

const items = matches.map((m, idx) => {
  const str = m[1];

  const getVal = (key) => {
    const re = new RegExp('\\.' + key + '\\("([^"]*)"\\)');
    const match = str.match(re);
    return match ? match[1] : '';
  };

  const getIntVal = (key) => {
    const re = new RegExp('\\.' + key + '\\((\\d+)\\)');
    const match = str.match(re);
    return match ? parseInt(match[1], 10) : idx + 1;
  };

  const id = getVal('id');
  const slNo = getIntVal('slNo');
  const empId = getVal('empId');
  const name = getVal('name');
  const designation = getVal('designation');
  const department = getVal('department');
  const departmentId = getVal('departmentId');
  const qualification = getVal('qualification');
  const specialization = getVal('specialization');
  const email = getVal('email');
  const phone = getVal('phone');
  const registrationNumber = getVal('registrationNumber');
  const joiningDate = getVal('joiningDate');
  const promotionDate = getVal('promotionDate');
  const experienceYears = getVal('experienceYears');
  const biography = getVal('biography');
  const status = getVal('status').toUpperCase() === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';
  const photoUrl = getVal('photoUrl');

  const roleCategory = id.startsWith('f-')
    ? 'MEDICAL_STAFF'
    : (department.includes('PARA')
      ? 'PARAMEDICAL_STAFF'
      : (department.includes('OFFICE')
        ? 'OFFICE_STAFF'
        : (department.includes('NON') ? 'NON_MEDICAL_STAFF' : 'MEDICAL_STAFF')));

  const category = id.startsWith('f-')
    ? 'ACADEMIC FACULTY'
    : (roleCategory === 'OFFICE_STAFF'
      ? 'OFFICE STAFF'
      : (roleCategory === 'PARAMEDICAL_STAFF'
        ? 'PARAMEDICAL STAFF'
        : (roleCategory === 'NON_MEDICAL_STAFF' ? 'NON-MEDICAL STAFF' : 'MEDICAL STAFF')));

  return {
    id,
    slNo,
    empId,
    name,
    roleCategory,
    department,
    departmentId: departmentId || 'org',
    designation,
    category,
    displayOrder: slNo,
    qualification,
    specialization,
    email,
    phone,
    contactNumber: phone,
    registrationNumber,
    joiningDate,
    promotionDate,
    experienceYears,
    biography,
    status,
    photoUrl,
  };
});

console.log(`Parsed ${items.length} items from DatabaseSeeder.java`);

const staffModelPath = path.join(__dirname, '..', 'src', 'server', 'staffModel.ts');
let staffModelContent = fs.readFileSync(staffModelPath, 'utf8');

const seedHeader = 'export const SEED_STAFF = ';
const seedIndex = staffModelContent.indexOf(seedHeader);
if (seedIndex !== -1) {
  const newStaffModelContent = staffModelContent.substring(0, seedIndex) + seedHeader + JSON.stringify(items, null, 2) + ';\n';
  fs.writeFileSync(staffModelPath, newStaffModelContent, 'utf8');
  console.log('Successfully updated src/server/staffModel.ts with 83 SEED_STAFF records!');
} else {
  console.error('Could not find SEED_STAFF export in staffModel.ts');
}
