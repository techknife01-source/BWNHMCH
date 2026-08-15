package com.homeopathy.college.config;

import com.homeopathy.college.entity.Faculty;
import com.homeopathy.college.repository.FacultyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final FacultyRepository facultyRepository;

    @Override
    public void run(String... args) throws Exception {
        log.info("[STARTUP] Checking MongoDB database seeder status...");
        seedFacultyMembers();
    }

    private void seedFacultyMembers() {
        try {
            List<Faculty> allSeedRecords = getHistoricalFacultyAndStaffList();
            int insertedCount = 0;
            int existingCount = 0;

            List<Faculty> existingList = facultyRepository.findAll();

            for (Faculty seed : allSeedRecords) {
                boolean exists = existingList.stream().anyMatch(f ->
                        (f.getId() != null && f.getId().equalsIgnoreCase(seed.getId()))
                        || (seed.getEmpId() != null && f.getEmpId() != null && seed.getEmpId().equalsIgnoreCase(f.getEmpId()))
                        || (seed.getRegistrationNumber() != null && !seed.getRegistrationNumber().isBlank() && f.getRegistrationNumber() != null && seed.getRegistrationNumber().equalsIgnoreCase(f.getRegistrationNumber()))
                        || (seed.getName() != null && f.getName() != null && seed.getName().equalsIgnoreCase(f.getName()))
                );

                if (!exists) {
                    facultyRepository.save(seed);
                    insertedCount++;
                } else {
                    existingCount++;
                }
            }

            log.info("[STARTUP] Faculty & Staff database sync complete. Inserted new records: {}, Preserved existing records: {}, Total in collection: {}",
                    insertedCount, existingCount, facultyRepository.count());
        } catch (Exception e) {
            log.error("[STARTUP] Error seeding faculty and staff members: ", e);
        }
    }

    private List<Faculty> getHistoricalFacultyAndStaffList() {
        return Arrays.asList(
                // Academic Faculty
                Faculty.builder().id("f-org-1").slNo(1).empId("EMP-ORG-001").name("Dr. Abhijit Chatterjee").designation("Professor & HOD").department("Organon of Medicine").departmentId("org").qualification("M.D. (Hom.)").specialization("Organon of Medicine & Philosophy").email("abhijit.chatterjee@bhmch.ac.in").phone("+91 98310 12345").registrationNumber("WB-NCH-1995-012").joiningDate("2005-08-01").promotionDate("2018-01-15").experienceYears("18+ Years").biography("Senior Professor & HOD.").status("Active").photoUrl("https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400").build(),
                Faculty.builder().id("f-org-2").slNo(2).empId("EMP-ORG-002").name("Dr. Aditi Biswas").designation("Associate Professor").department("Organon of Medicine").departmentId("org").qualification("M.D. (Hom.)").specialization("Miasmatic Diagnosis").email("aditi.biswas@bhmch.ac.in").phone("+91 98310 23456").registrationNumber("WB-NCH-2002-045").joiningDate("2010-09-15").promotionDate("2020-04-10").experienceYears("13+ Years").biography("Specialist in miasmatic clinical diagnosis.").status("Active").photoUrl("https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400").build(),
                Faculty.builder().id("f-mm-1").slNo(3).empId("EMP-MM-001").name("Dr. Anisa Afroz").designation("Professor & HOD").department("Homoeopathic Materia Medica").departmentId("mm").qualification("M.D. (Hom.)").specialization("Comparative Materia Medica").email("anisa.afroz@bhmch.ac.in").phone("+91 98310 34567").registrationNumber("WB-NCH-1998-089").joiningDate("2007-03-01").promotionDate("2019-06-01").experienceYears("16+ Years").biography("Leading expert in Materia Medica.").status("Active").photoUrl("https://images.unsplash.com/photo-1594824813566-88855ce7890b?auto=format&fit=crop&q=80&w=400").build(),
                Faculty.builder().id("f-pharm-1").slNo(4).empId("EMP-PHARM-001").name("Dr. Arindam Roy").designation("Assistant Professor").department("Homoeopathic Pharmacy").departmentId("pharm").qualification("M.D. (Hom.)").specialization("Pharmacognosy & Potentisation").email("arindam.roy@bhmch.ac.in").phone("+91 98310 45678").registrationNumber("WB-NCH-2006-112").joiningDate("2014-11-20").promotionDate("2021-08-15").experienceYears("9+ Years").biography("Pharmacognosy researcher.").status("Active").photoUrl("https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400").build(),
                Faculty.builder().id("f-pm-1").slNo(5).empId("EMP-PM-001").name("Dr. Ashis Biswas").designation("Associate Professor").department("Practice of Medicine").departmentId("pm").qualification("M.D. (Hom.)").specialization("Clinical Therapeutics").email("ashis.biswas@bhmch.ac.in").phone("+91 98310 56789").registrationNumber("WB-NCH-2004-078").joiningDate("2012-01-10").promotionDate("2022-03-01").experienceYears("11+ Years").biography("Clinical Therapeutics specialist.").status("Active").photoUrl("https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=400").build(),
                Faculty.builder().id("f-cm-1").slNo(6).empId("EMP-CM-001").name("Dr. Ashish Sarkar").designation("Assistant Professor").department("Community Medicine").departmentId("cm").qualification("M.D. (Hom.)").specialization("Epidemiology & Preventive Care").email("ashish.sarkar@bhmch.ac.in").phone("+91 98310 67890").registrationNumber("WB-NCH-2009-156").joiningDate("2016-07-01").promotionDate("2023-01-10").experienceYears("7+ Years").biography("Epidemiology and public health expert.").status("Active").photoUrl("https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400").build(),
                Faculty.builder().id("f-rep-1").slNo(7).empId("EMP-REP-001").name("Dr. Ashok Kr. Bhattacherjee").designation("Professor & HOD").department("Case Taking & Repertory").departmentId("rep").qualification("M.D. (Hom.)").specialization("Computer Repertorization").email("ashok.bhattacherjee@bhmch.ac.in").phone("+91 98310 78901").registrationNumber("WB-NCH-1992-005").joiningDate("2002-04-15").promotionDate("2015-05-20").experienceYears("21+ Years").biography("Pioneer in computer repertorization.").status("Active").photoUrl("https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400").build(),

                Faculty.builder().id("f-org-3").slNo(8).empId("EMP-ORG-003").name("Dr. Swapan Kundu").designation("Guest Professor").department("Organon of Medicine").departmentId("org").qualification("B.H.M.S ; M.D. (HOM)").specialization("Chronic Diseases").email("drswapankundu@gmail.com").phone("+91 9830254112").registrationNumber("18234").joiningDate("2015-01-10").status("Active").build(),
                Faculty.builder().id("f-org-4").slNo(9).empId("EMP-ORG-004").name("Dr. Dhananjaya Chatterjee").designation("Associate Professor").department("Organon of Medicine").departmentId("org").qualification("B.H.M.S ; M.D. (ORGANON)").specialization("Organon Philosophy").email("drdhananjaya@gmail.com").phone("+91 9433128904").registrationNumber("21450").joiningDate("2018-05-20").status("Active").build(),
                Faculty.builder().id("f-org-5").slNo(10).empId("EMP-ORG-005").name("Dr. Suhisna Das").designation("Assistant Professor").department("Organon of Medicine").departmentId("org").qualification("B.H.M.S ; M.D. (HOM)").specialization("Vital Force Analysis").email("suhisna.das@gmail.com").phone("+91 9874561230").registrationNumber("29870").joiningDate("2021-08-14").status("Active").build(),
                Faculty.builder().id("f-org-6").slNo(11).empId("EMP-ORG-006").name("Susmita Dey").designation("Lecturer").department("Organon of Medicine").departmentId("org").qualification("B.H.M.S").specialization("Organon Fundamentals").email("susmitadey@gmail.com").phone("+91 9123456789").registrationNumber("31200").joiningDate("2023-02-01").status("Active").build(),

                Faculty.builder().id("f-anat-1").slNo(12).empId("EMP-ANAT-001").name("Dr. Prasenjit Biswas").designation("Professor & HOD").department("Anatomy & Histology").departmentId("anat").qualification("M.D. (Hom.), MS (Anat)").specialization("Gross Anatomy").email("prasenjit.biswas@bhmch.ac.in").phone("+91 9830112233").registrationNumber("20101").joiningDate("2008-03-12").status("Active").build(),
                Faculty.builder().id("f-anat-2").slNo(13).empId("EMP-ANAT-002").name("Dr. Nipa Sardar").designation("Associate Professor").department("Anatomy & Histology").departmentId("anat").qualification("M.D. (Hom.)").specialization("Histology").email("nipa.sardar@bhmch.ac.in").phone("+91 9830223344").registrationNumber("24510").joiningDate("2015-09-01").status("Active").build(),
                Faculty.builder().id("f-anat-3").slNo(14).empId("EMP-ANAT-003").name("Dr. Ayon Das").designation("Assistant Professor").department("Anatomy & Histology").departmentId("anat").qualification("B.H.M.S, M.D.").specialization("Embryology").email("ayon.das@bhmch.ac.in").phone("+91 9830334455").registrationNumber("28900").joiningDate("2019-11-15").status("Active").build(),

                Faculty.builder().id("f-phys-1").slNo(15).empId("EMP-PHYS-001").name("Dr. Santosh Kumar").designation("Professor & HOD").department("Physiology including Biochemistry").departmentId("phys").qualification("M.D. (Hom.)").specialization("Systemic Physiology").email("santosh.kumar@bhmch.ac.in").phone("+91 9830445566").registrationNumber("19800").joiningDate("2006-02-01").status("Active").build(),
                Faculty.builder().id("f-phys-2").slNo(16).empId("EMP-PHYS-002").name("Dr. Mansur Habibullah Gazi").designation("Associate Professor").department("Physiology including Biochemistry").departmentId("phys").qualification("M.D. (Hom.)").specialization("Neurophysiology").email("mansur.gazi@bhmch.ac.in").phone("+91 9830556677").registrationNumber("23410").joiningDate("2013-04-10").status("Active").build(),
                Faculty.builder().id("f-phys-3").slNo(17).empId("EMP-PHYS-003").name("Dr. Kousttav Sarkar").designation("Assistant Professor").department("Physiology including Biochemistry").departmentId("phys").qualification("M.D. (Hom.)").specialization("Biochemistry").email("kousttav.sarkar@bhmch.ac.in").phone("+91 9830667788").registrationNumber("27890").joiningDate("2018-07-20").status("Active").build(),

                Faculty.builder().id("f-pharm-2").slNo(18).empId("EMP-PHARM-002").name("Dr. Soumalya Golder").designation("Associate Professor").department("Homoeopathic Pharmacy").departmentId("pharm").qualification("M.D. (Hom.)").specialization("Pharmacy Practice").email("soumalya.golder@bhmch.ac.in").phone("+91 9830778899").registrationNumber("25670").joiningDate("2016-01-15").status("Active").build(),

                Faculty.builder().id("f-path-1").slNo(19).empId("EMP-PATH-001").name("Dr. Santanu Mukherjee").designation("Professor & HOD").department("Pathology, Microbiology & Parasitology").departmentId("path").qualification("M.D. (Hom.)").specialization("General Pathology").email("santanu.mukherjee@bhmch.ac.in").phone("+91 9830889900").registrationNumber("18900").joiningDate("2005-06-01").status("Active").build(),
                Faculty.builder().id("f-path-2").slNo(20).empId("EMP-PATH-002").name("Dr. Debasish Sarker").designation("Assistant Professor").department("Pathology, Microbiology & Parasitology").departmentId("path").qualification("M.D. (Hom.)").specialization("Microbiology").email("debasish.sarker@bhmch.ac.in").phone("+91 9830990011").registrationNumber("26780").joiningDate("2017-09-10").status("Active").build(),

                Faculty.builder().id("f-fmt-1").slNo(21).empId("EMP-FMT-001").name("Dr. Enamul Haque").designation("Professor & HOD").department("Forensic Medicine & Toxicology").departmentId("fmt").qualification("M.D. (Hom.)").specialization("Medical Jurisprudence").email("enamul.haque@bhmch.ac.in").phone("+91 9831001122").registrationNumber("19200").joiningDate("2004-03-15").status("Active").build(),
                Faculty.builder().id("f-fmt-2").slNo(22).empId("EMP-FMT-002").name("Dr. Abdul Gaffar").designation("Assistant Professor").department("Forensic Medicine & Toxicology").departmentId("fmt").qualification("M.D. (Hom.)").specialization("Toxicology").email("abdul.gaffar@bhmch.ac.in").phone("+91 9831112233").registrationNumber("27810").joiningDate("2018-10-05").status("Active").build(),

                Faculty.builder().id("f-gyn-1").slNo(23).empId("EMP-GYN-001").name("Prof. (Dr.) Pronab Bhattacherjee").designation("Professor & HOD").department("Obstetrics, Gynecology & Neonatology").departmentId("gyn").qualification("M.D. (Hom.)").specialization("Obstetrics & Gynaecology").email("pronab.bhattacherjee@bhmch.ac.in").phone("+91 9831223344").registrationNumber("17800").joiningDate("2001-01-10").status("Active").build(),
                Faculty.builder().id("f-gyn-2").slNo(24).empId("EMP-GYN-002").name("Dr. Debasish Chakraborty").designation("Associate Professor").department("Obstetrics, Gynecology & Neonatology").departmentId("gyn").qualification("M.D. (Hom.)").specialization("Gynaecological Therapeutics").email("debasish.c@bhmch.ac.in").phone("+91 9831334455").registrationNumber("22340").joiningDate("2011-05-20").status("Active").build(),
                Faculty.builder().id("f-gyn-3").slNo(25).empId("EMP-GYN-003").name("Dr. Sharmistha Nandi").designation("Assistant Professor").department("Obstetrics, Gynecology & Neonatology").departmentId("gyn").qualification("M.D. (Hom.)").specialization("Neonatology").email("sharmistha.nandi@bhmch.ac.in").phone("+91 9831445566").registrationNumber("28912").joiningDate("2019-03-01").status("Active").build(),
                Faculty.builder().id("f-gyn-4").slNo(26).empId("EMP-GYN-004").name("Dr. Tapan Kumar Bandyopadhyay").designation("Visiting Specialist").department("Obstetrics, Gynecology & Neonatology").departmentId("gyn").qualification("M.B.B.S, D.G.O.").specialization("Gynaecology Surgery").email("tapan.bandyopadhyay@bhmch.ac.in").phone("+91 9831556677").registrationNumber("15600").joiningDate("2005-07-15").status("Active").build(),

                Faculty.builder().id("f-surg-1").slNo(27).empId("EMP-SURG-001").name("Dr. Sushil Murmu").designation("Professor & HOD").department("Surgery & Allied Specialties").departmentId("surg").qualification("M.D. (Hom.), MS").specialization("Homoeopathic Surgery").email("sushil.murmu@bhmch.ac.in").phone("+91 9831667788").registrationNumber("18950").joiningDate("2003-08-01").status("Active").build(),
                Faculty.builder().id("f-surg-2").slNo(28).empId("EMP-SURG-002").name("Prof. (Dr.) Susmita Chatterjee").designation("Superintendent & Professor").department("Surgery & Allied Specialties").departmentId("surg").qualification("M.D. (Hom.)").specialization("Clinical Surgery").email("susmita.chatterjee@bhmch.ac.in").phone("+91 9831778899").registrationNumber("16700").joiningDate("2000-02-15").status("Active").build(),
                Faculty.builder().id("f-surg-3").slNo(29).empId("EMP-SURG-003").name("Dr. Chinmoy Sarkar").designation("Associate Professor").department("Surgery & Allied Specialties").departmentId("surg").qualification("M.D. (Hom.)").specialization("Operative Therapeutics").email("chinmoy.sarkar@bhmch.ac.in").phone("+91 9831889900").registrationNumber("23450").joiningDate("2012-11-10").status("Active").build(),
                Faculty.builder().id("f-surg-4").slNo(30).empId("EMP-SURG-004").name("Dr. Prithish Mukherjee").designation("Assistant Professor").department("Surgery & Allied Specialties").departmentId("surg").qualification("B.D.S, M.D.").specialization("Dental Surgery").email("prithish.mukherjee@bhmch.ac.in").phone("+91 9831990011").registrationNumber("29010").joiningDate("2020-01-20").status("Active").build(),
                Faculty.builder().id("f-surg-5").slNo(31).empId("EMP-SURG-005").name("Dr. Kazi Toufik Ali").designation("Assistant Professor").department("Surgery & Allied Specialties").departmentId("surg").qualification("M.D. (Hom.)").specialization("General Surgery").email("kazi.toufik@bhmch.ac.in").phone("+91 9832001122").registrationNumber("30120").joiningDate("2021-06-01").status("Active").build(),
                Faculty.builder().id("f-surg-6").slNo(32).empId("EMP-SURG-006").name("Dr. Sk. Gousul Azam").designation("Lecturer").department("Surgery & Allied Specialties").departmentId("surg").qualification("B.H.M.S.").specialization("Surgical Care").email("gousul.azam@bhmch.ac.in").phone("+91 9832112233").registrationNumber("31890").joiningDate("2023-04-10").status("Active").build(),
                Faculty.builder().id("f-surg-7").slNo(33).empId("EMP-SURG-007").name("Dr. Asim Kumar Das").designation("Visiting Specialist").department("Surgery & Allied Specialties").departmentId("surg").qualification("M.S. (Surgery)").specialization("Surgical Procedures").email("asim.das@bhmch.ac.in").phone("+91 9832223344").registrationNumber("14500").joiningDate("2007-09-01").status("Active").build(),

                Faculty.builder().id("f-pm-2").slNo(34).empId("EMP-PM-002").name("Dr. Soumitra De").designation("Professor & HOD").department("Practice of Medicine").departmentId("pm").qualification("M.D. (Hom.)").specialization("Clinical Medicine").email("soumitra.de@bhmch.ac.in").phone("+91 9832334455").registrationNumber("18100").joiningDate("2002-12-01").status("Active").build(),
                Faculty.builder().id("f-pm-3").slNo(35).empId("EMP-PM-003").name("Shilpa Mondal").designation("Lecturer").department("Practice of Medicine").departmentId("pm").qualification("B.H.M.S.").specialization("Internal Medicine").email("shilpa.mondal@bhmch.ac.in").phone("+91 9832445566").registrationNumber("32100").joiningDate("2023-08-15").status("Active").build(),
                Faculty.builder().id("f-pm-4").slNo(36).empId("EMP-PM-004").name("Dr. Kousick Mati").designation("Assistant Professor").department("Practice of Medicine").departmentId("pm").qualification("M.D. (Hom.)").specialization("Cardiology & Medicine").email("kousick.mati@bhmch.ac.in").phone("+91 9832556677").registrationNumber("29810").joiningDate("2020-05-10").status("Active").build(),

                Faculty.builder().id("f-cm-2").slNo(37).empId("EMP-CM-002").name("Dr. Sourav Kr. Sarkar").designation("Professor & HOD").department("Community Medicine").departmentId("cm").qualification("M.D. (Hom.)").specialization("Public Health").email("sourav.sarkar@bhmch.ac.in").phone("+91 9832667788").registrationNumber("19500").joiningDate("2004-10-01").status("Active").build(),
                Faculty.builder().id("f-cm-3").slNo(38).empId("EMP-CM-003").name("Prof. (Dr.) Asim Kumar Samanta").designation("Professor").department("Community Medicine").departmentId("cm").qualification("M.D. (Hom.)").specialization("Community Hygiene").email("asim.samanta@bhmch.ac.in").phone("+91 9832778899").registrationNumber("16200").joiningDate("1999-04-15").status("Active").build(),

                Faculty.builder().id("f-mm-2").slNo(39).empId("EMP-MM-002").name("Dr. Priyanka Maji").designation("Associate Professor").department("Homoeopathic Materia Medica").departmentId("mm").qualification("M.D. (Hom.)").specialization("Drug Proving").email("priyanka.maji@bhmch.ac.in").phone("+91 9832889900").registrationNumber("24100").joiningDate("2014-06-01").status("Active").build(),
                Faculty.builder().id("f-mm-3").slNo(40).empId("EMP-MM-003").name("Dr. Nabanita Kundu").designation("Assistant Professor").department("Homoeopathic Materia Medica").departmentId("mm").qualification("M.D. (Hom.)").specialization("Materia Medica").email("nabanita.kundu@bhmch.ac.in").phone("+91 9832990011").registrationNumber("32635").joiningDate("2024-05-15").status("Active").build(),
                Faculty.builder().id("f-mm-4").slNo(41).empId("EMP-MM-004").name("Dr. Dipa Kundu").designation("Assistant Professor").department("Homoeopathic Materia Medica").departmentId("mm").qualification("M.D. (Hom.)").specialization("Pharmacodynamics").email("dipa.kundu@bhmch.ac.in").phone("+91 9833001122").registrationNumber("32831").joiningDate("2026-01-29").status("Active").build(),

                Faculty.builder().id("f-rep-2").slNo(42).empId("EMP-REP-002").name("Dr. Shimul Das").designation("Assistant Professor").department("Case Taking & Repertory").departmentId("rep").qualification("M.D. (Hom.)").specialization("Repertorization").email("shimul.das@bhmch.ac.in").phone("+91 9833112233").registrationNumber("29965").joiningDate("2023-06-05").status("Active").build(),
                Faculty.builder().id("f-rep-3").slNo(43).empId("EMP-REP-003").name("Dr. Soumyadip Pal").designation("Assistant Professor").department("Case Taking & Repertory").departmentId("rep").qualification("M.D. (Hom.)").specialization("RadarOpus Software").email("soumyadip.pal@bhmch.ac.in").phone("+91 9833223344").registrationNumber("32947").joiningDate("2025-07-01").status("Active").build(),
                Faculty.builder().id("f-rep-4").slNo(44).empId("EMP-REP-004").name("Dr. Abdul Hakim Sk.").designation("Assistant Professor").department("Case Taking & Repertory").departmentId("rep").qualification("M.D. (Hom.)").specialization("Symptom Totality").email("abdul.hakim@bhmch.ac.in").phone("+91 9833334455").registrationNumber("33036").joiningDate("2025-07-01").status("Active").build(),

                // Hospital & Support Staff
                Faculty.builder().id("hs-036").slNo(45).empId("SL-37").name("AMIT DHANK").designation("WARD BOY").department("OFFICE STAFF (HOSPITAL SECTION)").departmentId("hosp-off").qualification("Higher Secondary").status("Active").build(),
                Faculty.builder().id("hs-012").slNo(46).empId("SL-14").name("ANAESTHETIST. (ON CALL)").designation("ANAESTHETIST").department("MEDICAL STAFF (HOSPITAL SECTION)").departmentId("hosp-med").qualification("M.D. (Anaesthesia)").status("Active").build(),
                Faculty.builder().id("hs-017").slNo(47).empId("SL-18").name("ARUNIMA LAHA.").designation("DIETICIAN").department("PARA - MEDICAL STAFF (HOSPITAL SECTION)").departmentId("hosp-para").qualification("B.Sc (Nutrition)").status("Active").build(),
                Faculty.builder().id("hs-043").slNo(48).empId("SL-44").name("AWADHESH KUMAR MAHATO").designation("MEDICAL LABORATORY TECHNICIAN").department("PARA - MEDICAL STAFF (HOSPITAL SECTION)").departmentId("hosp-para").qualification("D.M.L.T").status("Active").build(),
                Faculty.builder().id("hs-034").slNo(49).empId("SL-35").name("BRISHTI DAS").designation("AYA").department("OFFICE STAFF (HOSPITAL SECTION)").departmentId("hosp-off").qualification("Secondary").status("Active").build(),
                Faculty.builder().id("hs-029").slNo(50).empId("SL-30").name("CHAINA GHOSH").designation("O.T. ASSISTANT.").department("PARA - MEDICAL STAFF (HOSPITAL SECTION)").departmentId("hosp-para").qualification("D.O.T.T").status("Active").build(),
                Faculty.builder().id("hs-008").slNo(51).empId("SL-09").name("CHANDRA DAS").designation("L.D.C (REGISTRATION CLERK)").department("OFFICE STAFF (HOSPITAL SECTION)").departmentId("hosp-off").qualification("B.Com").status("Active").build(),
                Faculty.builder().id("hs-009").slNo(52).empId("SL-10").name("PUSPA DEY").designation("STAFF NURSE.").department("PARA - MEDICAL STAFF (HOSPITAL SECTION)").departmentId("hosp-para").qualification("G.N.M.").status("Active").build(),
                Faculty.builder().id("hs-013").slNo(53).empId("SL-15").name("DR ASITAVA MUKHERJEE").designation("RADIOLOGIST").department("MEDICAL STAFF (HOSPITAL SECTION)").departmentId("hosp-med").qualification("M.D. (Radiology)").status("Active").build(),
                Faculty.builder().id("hs-014").slNo(54).empId("SL-16").name("DR. NILADRI MODOK.").designation("SONOLOGIST").department("MEDICAL STAFF (HOSPITAL SECTION)").departmentId("hosp-med").qualification("M.B.B.S, D.M.R.D").status("Active").build(),
                Faculty.builder().id("hs-016").slNo(55).empId("SL-17").name("SANDHYA DAS").designation("STAFF NURSE.").department("PARA - MEDICAL STAFF (HOSPITAL SECTION)").departmentId("hosp-para").qualification("G.N.M.").status("Active").build(),
                Faculty.builder().id("hs-018").slNo(56).empId("SL-19").name("SUKDEV MUKHERJEE").designation("PHYSIOTHERAPIST").department("PARA - MEDICAL STAFF (HOSPITAL SECTION)").departmentId("hosp-para").qualification("B.P.T").status("Active").build(),
                Faculty.builder().id("hs-019").slNo(57).empId("SL-20").name("SUNIL KUMAR SHAW").designation("YOGA & NATUROPATHY").department("PARA - MEDICAL STAFF (HOSPITAL SECTION)").departmentId("hosp-para").qualification("Diploma in Yoga").status("Active").build(),
                Faculty.builder().id("hs-020").slNo(58).empId("SL-21").name("SWAPAN BARAL").designation("DISPENSER").department("OFFICE STAFF (HOSPITAL SECTION)").departmentId("hosp-off").qualification("D.Pharm (Hom)").status("Active").build(),
                Faculty.builder().id("hs-021").slNo(59).empId("SL-22").name("UJJWAL KR. MONDAL").designation("DISPENSER").department("OFFICE STAFF (HOSPITAL SECTION)").departmentId("hosp-off").qualification("D.Pharm (Hom)").status("Active").build(),
                Faculty.builder().id("hs-022").slNo(60).empId("SL-23").name("SHOUVIK PAL").designation("UDC").department("NON - MEDICAL STAFF (HOSPITAL SECTION)").departmentId("hosp-nonmed").qualification("Graduate").status("Active").build(),
                Faculty.builder().id("hs-023").slNo(61).empId("SL-24").name("KALPANA GHOSAL").designation("STAFF NURSE.").department("PARA - MEDICAL STAFF (HOSPITAL SECTION)").departmentId("hosp-para").qualification("G.N.M.").status("Active").build(),
                Faculty.builder().id("hs-024").slNo(62).empId("SL-25").name("SANCHITA DAS").designation("L.D.C").department("NON - MEDICAL STAFF (HOSPITAL SECTION)").departmentId("hosp-nonmed").qualification("Graduate").status("Active").build(),
                Faculty.builder().id("hs-025").slNo(63).empId("SL-26").name("GEETA PAL").designation("STAFF NURSE.").department("PARA - MEDICAL STAFF (HOSPITAL SECTION)").departmentId("hosp-para").qualification("G.N.M.").status("Active").build(),
                Faculty.builder().id("hs-026").slNo(64).empId("SL-27").name("SUMITA CHAKRABORTY").designation("PUBLIC RELATION OFFICER").department("NON - MEDICAL STAFF (HOSPITAL SECTION)").departmentId("hosp-nonmed").qualification("M.A. (PR)").status("Active").build(),
                Faculty.builder().id("hs-027").slNo(65).empId("SL-28").name("MAYUKH MUKHERJEE").designation("USG ASSISTANT.").department("PARA - MEDICAL STAFF (HOSPITAL SECTION)").departmentId("hosp-para").qualification("D.M.L.T").status("Active").build(),
                Faculty.builder().id("hs-028").slNo(66).empId("SL-29").name("NIHAR KUMAR SANTRA").designation("SECURITY.").department("NON - MEDICAL STAFF (HOSPITAL SECTION)").departmentId("hosp-nonmed").qualification("Ex-Serviceman").status("Active").build(),
                Faculty.builder().id("hs-030").slNo(67).empId("SL-31").name("RAHUL DAS").designation("SECURITY GUARD").department("NON - MEDICAL STAFF (HOSPITAL SECTION)").departmentId("hosp-nonmed").qualification("Secondary").status("Active").build(),
                Faculty.builder().id("hs-031").slNo(68).empId("SL-32").name("SK. AKTAR").designation("SWEEPER").department("NON - MEDICAL STAFF (HOSPITAL SECTION)").departmentId("hosp-nonmed").qualification("Class VIII").status("Active").build(),
                Faculty.builder().id("hs-032").slNo(69).empId("SL-33").name("TINA ROY").designation("NURSING STAFF").department("PARA - MEDICAL STAFF (HOSPITAL SECTION)").departmentId("hosp-para").qualification("B.Sc Nursing").status("Active").build(),
                Faculty.builder().id("hs-033").slNo(70).empId("SL-34").name("RENUKA BARI").designation("NURSING STAFF").department("PARA - MEDICAL STAFF (HOSPITAL SECTION)").departmentId("hosp-para").qualification("G.N.M.").status("Active").build(),
                Faculty.builder().id("hs-035").slNo(71).empId("SL-36").name("SARMISTHA DAS").designation("AYA").department("OFFICE STAFF (HOSPITAL SECTION)").departmentId("hosp-off").qualification("Secondary").status("Active").build(),
                Faculty.builder().id("hs-037").slNo(72).empId("SL-38").name("RINKU DEY").designation("MULTI TASK STAFF").department("NON - MEDICAL STAFF (HOSPITAL SECTION)").departmentId("hosp-nonmed").qualification("Class X").status("Active").build(),
                Faculty.builder().id("hs-038").slNo(73).empId("SL-39").name("DULAL BOSE").designation("WARD BOY").department("NON - MEDICAL STAFF (HOSPITAL SECTION)").departmentId("hosp-nonmed").qualification("Class VIII").status("Active").build(),
                Faculty.builder().id("hs-039").slNo(74).empId("SL-40").name("HIRALAL PRAMANIK").designation("SECURITY GUARD").department("NON - MEDICAL STAFF (HOSPITAL SECTION)").departmentId("hosp-nonmed").qualification("Ex-Serviceman").status("Active").build(),
                Faculty.builder().id("hs-040").slNo(75).empId("SL-41").name("DEBDAS CAKRABORTY").designation("SECURITY GUARD").department("NON - MEDICAL STAFF (HOSPITAL SECTION)").departmentId("hosp-nonmed").qualification("Secondary").status("Active").build(),
                Faculty.builder().id("hs-041").slNo(76).empId("SL-42").name("MOUMITA MAJI").designation("YOGA EXPERT.").department("MEDICAL STAFF (HOSPITAL SECTION)").departmentId("hosp-med").qualification("M.Sc in Yoga").status("Active").build(),
                Faculty.builder().id("hs-042").slNo(77).empId("SL-43").name("SHILPI DAS").designation("DRESSER").department("NON - MEDICAL STAFF (HOSPITAL SECTION)").departmentId("hosp-nonmed").qualification("First Aid Certified").status("Active").build(),

                Faculty.builder().id("hs-002").slNo(78).empId("SL-03").name("DR. PUSPENDU BISWAS.").designation("SENIOR MEDICAL OFFICER").department("MEDICAL STAFF (HOSPITAL SECTION)").departmentId("hosp-med").qualification("M.D. (Hom.)").status("Active").build(),
                Faculty.builder().id("hs-003").slNo(79).empId("SL-04").name("DR. SOUMYA SAMANTA.").designation("RESIDENTIAL MEDICAL OFFICER").department("MEDICAL STAFF (HOSPITAL SECTION)").departmentId("hosp-med").qualification("M.D. (Hom.)").status("Active").build(),
                Faculty.builder().id("hs-004").slNo(80).empId("SL-05").name("DR. ANUP PRASAD GUPTA").designation("DEPUTY SUPERINTENDENT.").department("MEDICAL STAFF (HOSPITAL SECTION)").departmentId("hosp-med").qualification("M.D. (Hom.)").status("Active").build(),
                Faculty.builder().id("hs-005").slNo(81).empId("SL-06").name("DR. SHYMASHREE PAL.").designation("MEDICAL OFFICER").department("MEDICAL STAFF (HOSPITAL SECTION)").departmentId("hosp-med").qualification("B.H.M.S.").status("Active").build(),
                Faculty.builder().id("hs-006").slNo(82).empId("SL-07").name("DR. BHUBANESWAR BHATTACHERJEE").designation("CLINICAL BIO CHEMIST").department("MEDICAL STAFF (HOSPITAL SECTION)").departmentId("hosp-med").qualification("M.Sc (BioChem), Ph.D.").status("Active").build(),
                Faculty.builder().id("hs-007").slNo(83).empId("SL-08").name("DR. NAMRATA DAS").designation("HOUSE PHYSICIAN").department("MEDICAL STAFF (HOSPITAL SECTION)").departmentId("hosp-med").qualification("B.H.M.S.").status("Active").build()
        );
    }
}
