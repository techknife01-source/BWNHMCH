import fs from 'fs';
import path from 'path';
import { jsPDF } from 'jspdf';

const docsDir = path.join(process.cwd(), 'public', 'documents');
const downloadsDir = path.join(process.cwd(), 'public', 'downloads');

if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
if (!fs.existsSync(downloadsDir)) fs.mkdirSync(downloadsDir, { recursive: true });

function addHeaderFooter(doc, pageNum, totalPages, title, department) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Header
  doc.setFillColor(0, 33, 71); // #002147
  doc.rect(0, 0, pageWidth, 18, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL', 10, 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(department || 'ACADEMIC DIGITAL E-LIBRARY', pageWidth - 10, 11, { align: 'right' });

  // Footer
  doc.setDrawColor(200, 200, 200);
  doc.line(10, pageHeight - 15, pageWidth - 10, pageHeight - 15);

  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.text(`Resource: ${title}`, 10, pageHeight - 8);
  doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - 10, pageHeight - 8, { align: 'right' });
}

function createOrganonPdf() {
  const doc = new jsPDF();
  const title = "Organon of Medicine (6th Edition with Commentary)";
  const dept = "Department of Organon of Medicine";

  // Cover Page (Page 1)
  doc.setFillColor(0, 33, 71);
  doc.rect(0, 0, 210, 297, 'F');

  doc.setTextColor(212, 175, 55); // Gold
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text("BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL", 105, 40, { align: 'center' });
  doc.text("ESTD. 1978 • GOVT. AIDED • WBUHS & NCH AFFILIATED", 105, 50, { align: 'center' });

  doc.setLineWidth(1);
  doc.setDrawColor(212, 175, 55);
  doc.line(30, 60, 180, 60);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text("ORGANON OF MEDICINE", 105, 90, { align: 'center' });
  doc.setFontSize(14);
  doc.text("6th Edition with Exhaustive Commentary & Footnotes", 105, 102, { align: 'center' });

  doc.setFontSize(12);
  doc.setTextColor(200, 220, 255);
  doc.text("Author: Dr. Samuel Hahnemann", 105, 130, { align: 'center' });
  doc.text("Edited with Miasmatic Notes & Clinical Posology Rules", 105, 140, { align: 'center' });

  doc.setFillColor(15, 45, 90);
  doc.roundedRect(30, 160, 150, 60, 5, 5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text("BHMC DIGITAL E-LIBRARY REPOSITORY", 105, 175, { align: 'center' });
  doc.text("Accession No: BHMC-LIB-0042 | ISBN: 978-8131903215", 105, 187, { align: 'center' });
  doc.text("Target Audience: BHMS 1st to 4th Prof Students & Clinical Faculty", 105, 199, { align: 'center' });

  doc.setFontSize(9);
  doc.setTextColor(180, 180, 180);
  doc.text("Published by BHMCH Central Library Academic Cell • Purba Bardhaman, W.B.", 105, 270, { align: 'center' });

  // Page 2: Table of Contents & Preface
  doc.addPage();
  doc.setTextColor(0, 33, 71);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text("TABLE OF CONTENTS & PREFACE", 10, 30);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 40, 40);
  doc.text("1. Preface to the 6th Edition by Dr. Samuel Hahnemann .................................... Page 2", 10, 45);
  doc.text("2. Introduction & Historical Overview of Homoeopathy ...................................... Page 3", 10, 55);
  doc.text("3. Aphorisms 1 - 4: The Physician's High Mission & Mission Statement .............. Page 4", 10, 65);
  doc.text("4. Aphorisms 5 - 18: Knowledge of Disease, Cause & Totality of Symptoms ....... Page 5", 10, 75);
  doc.text("5. Aphorisms 19 - 70: Dynamic Action of Remedies & Law of Similars ................ Page 6", 10, 85);
  doc.text("6. Aphorisms 71 - 104: Classification of Diseases & Case Taking ....................... Page 7", 10, 95);
  doc.text("7. Aphorisms 105 - 145: Drug Proving Protocols & Potentization .......................... Page 8", 10, 105);
  doc.text("8. Aphorisms 146 - 203: Selection of Remedy & Posology Rules ........................... Page 9", 10, 115);
  doc.text("9. Aphorisms 204 - 244: Chronic Diseases & Miasmatic Analysis ........................ Page 10", 10, 125);
  doc.text("10. Aphorisms 245 - 291: LM Potencies & Administration Guidelines ................. Line 11", 10, 135);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text("PREFACE TO THE 6TH EDITION", 10, 155);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const prefaceText = "The 6th edition of the Organon of Medicine represents the pinnacle of Hahnemannian medical science. Written in Cöthen and Paris, this final edition introduces the revolutionary 50-Millesimal (LM/Q) potency scale, modified repetition of dose rules, and refined principles of dynamic potentization. Hahnemann asserts that the primary duty of the physician is to restore health to the sick, to cure as it is termed, in a prompt, mild, and permanent manner.";
  const lines = doc.splitTextToSize(prefaceText, 190);
  doc.text(lines, 10, 168);

  // Page 3: Aphorisms 1 to 4
  doc.addPage();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text("APHORISMS 1 - 4: THE PHYSICIAN'S MISSION", 10, 30);

  doc.setFontSize(11);
  doc.setTextColor(0, 100, 50);
  doc.text("APHORISM 1:", 10, 45);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(10);
  const aph1 = "\"The physician's high and ONLY mission is to restore the sick to health, to cure, as it is termed.\"";
  doc.text(doc.splitTextToSize(aph1, 190), 10, 53);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(0, 100, 50);
  doc.text("APHORISM 2 (The Highest Ideal of Cure):", 10, 70);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(10);
  const aph2 = "\"The highest ideal of cure is rapid, gentle and permanent restoration of the health, or removal and annihilation of the disease in its whole extent, in the shortest, most reliable, and most harmless way, on easily comprehensible principles.\"";
  doc.text(doc.splitTextToSize(aph2, 190), 10, 78);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(0, 100, 50);
  doc.text("APHORISM 3 (Requirements of True Physician):", 10, 105);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(10);
  const aph3 = "If the physician clearly perceives what is to be cured in diseases, that is to say, in every individual case of disease (knowledge of disease, indication); if he clearly perceives what is curative in medicines, that is to say, in each individual medicine (knowledge of medical powers); and if he knows how to adapt, according to clearly defined principles, what is curative in medicines to what he has discovered to be undoubtedly morbid in the patient...";
  doc.text(doc.splitTextToSize(aph3, 190), 10, 113);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(0, 100, 50);
  doc.text("APHORISM 4 (Preserver of Health):", 10, 150);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(10);
  const aph4 = "\"He is likewise a preserver of health if he knows the things that derange health and cause disease, and how to remove them from persons in health.\"";
  doc.text(doc.splitTextToSize(aph4, 190), 10, 158);

  // Page 4: Miasmatic Analysis & LM Potency
  doc.addPage();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(0, 33, 71);
  doc.text("MIASMATIC ANALYSIS & LM POTENCY GUIDELINES", 10, 30);

  doc.setFillColor(240, 248, 255);
  doc.rect(10, 40, 190, 80, 'F');
  doc.setFontSize(11);
  doc.setTextColor(0, 50, 120);
  doc.text("CLASSIFICATION OF CHRONIC MIASMS (Aphorisms 204-209)", 15, 52);
  doc.setFontSize(9);
  doc.setTextColor(40, 40, 40);
  doc.text("1. PSORA: The fundamental cause and producer of all true chronic diseases. Characterized by hypersensitivity, functional derangements, itching eruptions, and mental anxiety.", 15, 65);
  doc.text("2. SYCOSIS: The gonorrhoeal chronic miasm. Characterized by overgrowth, infiltration, condylomata, induration, and fixed ideas.", 15, 80);
  doc.text("3. SYPHILIS: The destructive chronic miasm. Characterized by ulceration, tissue destruction, bone necrosis, nocturnal aggravation, and despair of recovery.", 15, 95);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 33, 71);
  doc.text("LM POTENCY PREPARATION & ADMINISTRATION (Aphorisms 270-272)", 10, 135);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const lmText = "The 50-Millesimal scale is prepared by taking 1 grain of 3C trituration of a drug, dissolving in 500 drops of water/alcohol mixture, and taking 1 drop to 100 drops of alcohol with 100 forceful succussions. Administered in liquid form with gentle succussion before each dose to prevent aggravation.";
  doc.text(doc.splitTextToSize(lmText, 190), 10, 147);

  // Add Headers & Footers to all pages
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addHeaderFooter(doc, i, totalPages, title, dept);
  }

  return doc;
}

function createGenericPdf(title, author, dept, pageCount = 4) {
  const doc = new jsPDF();

  // Page 1: Cover
  doc.setFillColor(0, 33, 71);
  doc.rect(0, 0, 210, 297, 'F');

  doc.setTextColor(212, 175, 55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text("BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL", 105, 40, { align: 'center' });

  doc.setLineWidth(1);
  doc.setDrawColor(212, 175, 55);
  doc.line(30, 55, 180, 55);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  const titleLines = doc.splitTextToSize(title.toUpperCase(), 170);
  doc.text(titleLines, 105, 85, { align: 'center' });

  doc.setFontSize(12);
  doc.setTextColor(200, 220, 255);
  doc.text(`Author / Faculty: ${author}`, 105, 130, { align: 'center' });
  doc.text(`Department: ${dept}`, 105, 142, { align: 'center' });

  doc.setFillColor(15, 45, 90);
  doc.roundedRect(30, 170, 150, 50, 5, 5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text("BHMC DIGITAL ACADEMIC REPOSITORY", 105, 190, { align: 'center' });
  doc.text("Approved under NCH & WBUHS Syllabus Standards", 105, 202, { align: 'center' });

  // Page 2 & subsequent
  for (let p = 2; p <= pageCount; p++) {
    doc.addPage();
    doc.setTextColor(0, 33, 71);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(`${title} - Section ${p - 1}`, 10, 30);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);
    const bodyText = `This section contains detailed academic material, lecture notes, clinical case breakdowns, and reference study guidelines for ${title}. Prepared specifically for students and faculty members of Burdwan Homoeopathic Medical College & Hospital. All contents are curated under the guidelines of the Ministry of AYUSH and National Commission for Homoeopathy (NCH). Page ${p} provides comprehensive study points, therapeutic indications, key remedy notes, and examination preparation guidance.`;
    doc.text(doc.splitTextToSize(bodyText, 190), 10, 45);
  }

  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addHeaderFooter(doc, i, totalPages, title, dept);
  }

  return doc;
}

// Generate files
const pdfs = [
  { name: 'bhmch_organon_edition6.pdf', dir: docsDir, fn: () => createOrganonPdf() },
  { name: 'bhmch_materia_medica_notes.pdf', dir: docsDir, fn: () => createGenericPdf("Lectures on Homoeopathic Materia Medica Notes", "Dr. Priyanka Maji", "Department of Materia Medica", 5) },
  { name: 'bhmch_repertory_worksheets.pdf', dir: docsDir, fn: () => createGenericPdf("Kent Repertory Methodologies & Worksheets", "Dr. Debabrata Sen", "Department of Repertory", 4) },
  { name: 'bhmch_hpi_guidelines.pdf', dir: docsDir, fn: () => createGenericPdf("Homoeopathic Pharmacopoeia of India Guidelines", "Govt. of India AYUSH", "Homoeopathic Pharmacy", 6) },
  { name: 'bhmch_ijrh_research_special.pdf', dir: docsDir, fn: () => createGenericPdf("Indian Journal of Research in Homoeopathy", "CCRH Special Edition", "Practice of Medicine", 5) },
  { name: 'bhmch_clinical_miasmatic_manual.pdf', dir: docsDir, fn: () => createGenericPdf("Clinical Case Records & Miasmatic Diagnosis", "Dr. P. S. Orang", "Practice of Medicine", 4) },
  { name: 'bhmch_anatomy_dissection_guide.pdf', dir: docsDir, fn: () => createGenericPdf("Human Anatomy Dissection Guide", "Dr. Ananya Roy", "Department of Anatomy", 5) },
  { name: 'bhmch_library_resource.pdf', dir: docsDir, fn: () => createGenericPdf("BHMCH Academic Digital Resource", "Faculty Member", "Central Academic Library", 4) },
  { name: 'bhms-prospectus-2026.pdf', dir: downloadsDir, fn: () => createGenericPdf("BHMS Prospectus 2026-2027", "Admission Committee", "Academic Cell", 4) },
  { name: 'opd-schedule.pdf', dir: downloadsDir, fn: () => createGenericPdf("Hospital OPD Daily Duty Schedule", "Hospital Superintendent", "Clinical OPD", 3) },
];

for (const pdfItem of pdfs) {
  const filePath = path.join(pdfItem.dir, pdfItem.name);
  const pdfDoc = pdfItem.fn();
  const pdfBytes = Buffer.from(pdfDoc.output('arraybuffer'));
  fs.writeFileSync(filePath, pdfBytes);
  console.log(`Generated PDF: ${filePath} (${pdfBytes.length} bytes)`);
}

console.log('All E-Library PDFs generated successfully!');
