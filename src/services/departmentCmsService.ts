import { DepartmentCMSData } from '../types/departmentCms';

const STORAGE_KEY = 'bhmch_department_cms_data_v1';

export const INITIAL_DEPARTMENT_CMS_DATA: DepartmentCMSData[] = [
  {
    id: 'org',
    code: 'DEPT-ORG',
    name: 'Organon of Medicine & Homoeopathic Philosophy',
    banner: {
      title: 'Organon of Medicine & Homoeopathic Philosophy and Fundamentals of Psychology',
      subtitle: 'Classical Hahnemannian philosophy, holistic disease evaluation, and fundamental psychology in homoeopathic therapeutics.',
      badge: 'NCH Recognized Core Faculty',
      bgImageUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=1200'
    },
    description: 'This department deals with the teaching and learning of the subject heartedly more seriously and sincerely to practice the Hahnemannian Homoeopathy. The subject Organon of Medicine is also integrated with all the allied subjects. The teachers of department of Organon of Medicine explain theoretical knowledge of Fundamental principles of homoeopathy and demonstrate those magnificently in clinical practices, so that students can easily understand and co-relate with other clinical subjects. Our main motto is to reap the seeds of holistic approach to Homoeopathy in student\'s nation of learning. On the other hand, the subject Psychology is included with the subject of Organon of Medicine. Study of Psychology is an essential subject for understanding Homoeopathy and Homoeopathic Philosophy.',
    hod: 'Dr. Swapan Kundu, D.H.M.S., B.H.M.S., M.D. (Organon)',
    yearsCovered: 'BHMS 1st Year to 4th Year',
    methodology: [
      'Lectures in the form of classroom teaching and inpatient and outpatient department exposure',
      'Classroom teaching includes blackboard writing, power-point presentation and clinical demonstration',
      'Academic performance of each and every student is closely monitored by conducting periodical assessments with maintenance of all records',
      'Extra attention for below average students by way of individual counseling and remedial classes',
      'Assessment examinations are taken as per the norms of The West Bengal University of Health Sciences'
    ],
    practical: [
      'Demonstrate qualities, duties and roles of the physician in both indoor and outdoor patients',
      'Interpret a case according to the Hahnemannian classification of diseases',
      'Demonstrate case taking, case analysis and evaluation of case to form totality of symptoms of the patient',
      'Interpretation of miasms in the background of the case of the disease',
      'Maintenance of practical exercise or clinical notebooks'
    ],
    teachingAids: [
      'Books & Reference Literature',
      'Study materials & Lecture Handouts',
      'Charts & Flow diagrams',
      'Pioneer\'s pictures & Historical portraits',
      'Seminars & Group discussions',
      'Case presentations & Clinical cases',
      'Tutorials & Interactive sessions',
      'Computer & CDs'
    ],
    facultyList: [
      {
        id: 'fac-test-001',
        name: 'Rajesh Pal',
        designation: 'Assistant Professor',
        qualification: 'BHMS, MD (Hom)',
        specialization: 'Homoeopathic Medicine',
        email: 'rajesh.pal@bhmc.edu.in',
        phone: '+91 98000 00001',
        registrationNumber: 'TEST-FAC-001',
        joiningDate: '2024-01-01'
      }
    ],
    gallery: [
      {
        id: 'g-org-1',
        url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
        caption: 'Organon Philosophy Class & Lecture Hall',
        category: 'Classroom'
      },
      {
        id: 'g-org-2',
        url: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80&w=800',
        caption: 'Bedside Clinical Demonstration in Hospital Ward',
        category: 'Clinical'
      }
    ]
  },
  {
    id: 'ana',
    code: 'DEPT-ANA',
    name: 'Anatomy & Histology',
    banner: {
      title: 'Department of Anatomy & Histology',
      subtitle: 'Comprehensive study of human structure, cadaveric dissection, histology, and radiological anatomy.',
      badge: 'Spacious Dissection Hall & Museum',
      bgImageUrl: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&q=80&w=1200'
    },
    description: 'A very spacious & well equipped Anatomy museum has been established with an aim to make students perfect in understanding the subject of Anatomy. Various specimens of different organs & models are present in the department besides charts, bones and skeletons, histological slides, audio/video C.D. that the faculty members avail to impart qualitative theoretical & practical teaching. Spacious Dissection Hall possess cadavers, maceration chamber, etc. There is a Demonstration room fitted with audio-visual aids. X-Ray studies are done with the help of x-Ray viewing Box. Duration of Anatomy in the curriculum of BHMS is in the first 1 ½ years. Studies comprised of complete study of human Anatomy with the help of dissection of dead bodies. University Examination at the end of one and half years and every six months average/semester examination are conducted. "Rational Knowledge of Anatomy is essential to practice Homoeopathy. - J.T. Kent"',
    hod: 'Dr. Prasenjit Biswas, B.H.M.S., M.D. (Hom)',
    yearsCovered: '1st BHMS (1 Year & 6 Months)',
    methodology: [
      'Special efforts are taken to make the student aware of each and every nuance of the human body',
      'The lectures are in the form of diagrammatic presentations and also demonstrations',
      'When teaching a specific topic special attention is given to the clinical importance so as to prepare a solid foundation for clinical subjects',
      'Academic performance of each and every student is closely monitored by conducting periodical tests, records are duly maintained',
      'Extra attention for below average students by way of individual counseling and extra coaching classes',
      'Assessment examinations are taken as per the norms of W.B. University of Health Sciences'
    ],
    practical: [
      'Complete systematic dissection of human cadaver',
      'CD Demonstration of various anatomical structures',
      'Demonstration of human bones & visceral organs',
      'Demonstration of various artificial models of anatomical structures',
      'Demonstration of the modeled visceral parts extracted during dissection',
      'Demonstration of X-Ray films for the basic knowledge of Radiology'
    ],
    teachingAids: [
      'Computer & Audio-visual CDs',
      'Charts display & Diagrammatic boards',
      'Models & Viscera specimen jars',
      'Transparencies & Histological Slides',
      'X-Rays & X-Ray Viewing Boxes',
      'Bones sets & Skeletons',
      'Cadaver mummified & Maceration chamber',
      'Seminars, Workshops & Guest Lectures'
    ],
    facultyList: [
      {
        id: 'f-ana-1',
        name: 'Dr. Prasenjit Biswas',
        designation: 'Associate Professor & Departmental In-charge',
        qualification: 'B.H.M.S., M.D. (Hom)',
        specialization: 'Human Anatomy & Dissection',
        email: 'drprasenjit@gmail.com',
        phone: '+91 7276574384',
        registrationNumber: '30590 (Council of Homoeopathic Medicine, W.B.)',
        joiningDate: '2020-03-13'
      },
      {
        id: 'f-ana-2',
        name: 'Dr. Nipa Sardar',
        designation: 'Assistant Professor',
        qualification: 'B.H.M.S.; M.D. (Materia Medica)',
        specialization: 'Anatomy & Histology',
        email: 'dr.nipasardar@gmail.com',
        phone: '+91 9831222450',
        registrationNumber: '32327 (West Bengal Council of Homoeopathic Medicine)',
        joiningDate: '2025-08-01'
      },
      {
        id: 'f-ana-3',
        name: 'Dr. Ayon Das',
        designation: 'Assist. Professor',
        qualification: 'B.H.M.S., M.D. (Hom)',
        specialization: 'Human Anatomy',
        email: 'ayondasnic@gmail.com',
        phone: '+91 9735606804',
        registrationNumber: '31180 (Council of Homoeopathic Medicine, W.B.)',
        joiningDate: '2022-01-06'
      }
    ],
    gallery: [
      {
        id: 'g-ana-1',
        url: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&q=80&w=800',
        caption: 'Anatomy Dissection Laboratory & Bone Sets',
        category: 'Laboratory'
      }
    ]
  },
  {
    id: 'phy',
    code: 'DEPT-PHY',
    name: 'Physiology including Biochemistry',
    banner: {
      title: 'Department of Physiology including Biochemistry',
      subtitle: 'Understanding human physiological systems, hematology, metabolic pathways, and clinical biochemistry.',
      badge: 'Well-Equipped Practical Physiology Lab',
      bgImageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=1200'
    },
    description: 'In medical science, physiology is the study of how the human body works, looking at the physical and chemical processes that take place within cells, organs, and organ systems in a balance way or a stable internal environment. Physiology and Biochemistry plays an important role to form a strong foundation for the students of medical science. The department provides a very substantial and well equipped lab and demonstration room. Various reagents, model, instruments, charts; blood films are present in the department. The instruments provided are as per the instructions of NCH, according to the CBDC curriculum. Beside that the department also provides Audio visual CD, PPt files for qualitative theoretical and practical slides. Bedside demonstrations, clinical class and direct interaction with OPD and IPD patient, Bedside examination provide the 1st year BHMS student the clear vision about their knowledge. The entire faculty members are post graduate and well experienced.',
    hod: 'Dr. Santosh Kumar, B.H.M.S., M.D. (Hom)',
    yearsCovered: '1st BHMS (1 Year)',
    methodology: [
      'Special efforts are taken to make the students aware of each and every physiological function of the body',
      'Special emphasize on the deviated condition of normal function of each system with practical explanation',
      'Emphasize mostly on applied physiology to build-up the foundation of physiological basis of medical practice',
      'Lectures are in the form of diagrammatic presentations and demonstrations',
      'Academic performance monitored by conducting MCQ, Quiz, Periodical Test, Terminal Test and Class projects',
      'Extra attention for below average students by extra coaching class and Remedial class',
      'Inter departmental and inter class Seminars and group discussion held on time to time',
      'Assessment examinations as per norms of W.B. University of Health Sciences'
    ],
    practical: [
      'Demonstration of different types haematological tests',
      'Demonstration of measurement of blood pressure dealing with OPD patients',
      'Demonstration of ECG with proper leaded machines',
      'Demonstration of various biochemical lab investigations',
      'Bedside demonstration of Different systems like respiratory system, Digestive system, nerve system by proper equipment of IPD patients'
    ],
    teachingAids: [
      'Computer & PPT Presentation Files',
      'CDs & Audio-visual Aids',
      'Charts & Anatomical Diagrams',
      'Models & Physiological Systems',
      'ECG Machine & Lead Attachments',
      'Instruments & Hematological Sets',
      'Reagents & Biochemical Testing Kits',
      'Seminars, Workshops & Guest Lectures'
    ],
    facultyList: [
      {
        id: 'f-phy-1',
        name: 'Dr. Santosh Kumar',
        designation: 'Associate Professor & Departmental In-charge',
        qualification: 'B.H.M.S.; M.D. (Hom)',
        specialization: 'Human Physiology & Clinical Biochemistry',
        email: 'santoshkumarmdhom@gmail.com',
        phone: '+91 8617270770',
        registrationNumber: '29289 (Council of Homoeopathic Medicine, W.B.)',
        joiningDate: '2017-01-09'
      },
      {
        id: 'f-phy-2',
        name: 'Dr. Mansur Habibullah Gazi',
        designation: 'Professor',
        qualification: 'B.H.M.S. (C.U.); M.D. (Hom)',
        specialization: 'Physiology & Metabolic Studies',
        email: 'mansurhabibullahgazi@gmail.com',
        phone: '+91 6290786992',
        registrationNumber: '16113 (West Bengal Council of Homoeopathic Medicine)',
        joiningDate: '2023-06-05'
      },
      {
        id: 'f-phy-3',
        name: 'Dr. Kousttav Sarkar',
        designation: 'Assistant Professor',
        qualification: 'B.H.M.S.; M.D. (Materia Medica)',
        specialization: 'Applied Physiology',
        email: 'kousttavsarkar@gmail.com',
        phone: '+91 8617000530',
        registrationNumber: '32712 (Council of Homoeopathic Medicine, W.B.)',
        joiningDate: '2026-01-21'
      }
    ],
    gallery: [
      {
        id: 'g-phy-1',
        url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800',
        caption: 'Physiology & Biochemistry Testing Laboratory',
        category: 'Laboratory'
      }
    ]
  },
  {
    id: 'pha',
    code: 'DEPT-PHA',
    name: 'Homoeopathic Pharmacy',
    banner: {
      title: 'Department of Homoeopathic Pharmacy',
      subtitle: 'Principles of pharmacognosy, pharmacodynamics, drug potentization, trituration, and GMP standardization.',
      badge: 'HPLC & Pharmacognosy Standardization Lab',
      bgImageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200'
    },
    description: 'A well equipped, spacious and generous Homoeopathic Pharmacy Laboratory has been set up with a goal to make it easy for students to understand this subject. The laboratory is designed to provide students with a comprehensive understanding of homoeopathic pharmacy principles, practices, and regulations. Duration of Pharmacy in the curriculum of BHMS is in the first 1 and a half years. Studies comprises of the importance of Homoeopathic Pharmacy with the help of preparation of different types of homoeopathic medicine and herbarium preparation. University examination at the end of 1 and a half years and every 3 months a periodical assessment i.e., PA1, PA2, PA3 & every 6 months a terminal test i.e., TT1 and TT2 is conducted as per NCH guidelines. "The true power of homoeopathic pharmacy lies not in the medicines, but in the understanding of the human being." — James Tyler Kent',
    hod: 'Dr. Arindam Roy, B.H.M.S., M.D. (Hom)',
    yearsCovered: '1st BHMS (1 Year & 6 Months)',
    methodology: [
      'Care and efforts are taken to assure that each student has gained a complete and overall knowledge of homoeopathic pharmacy',
      'The lectures are in the form of presentations accompanying with study materials provided to the students',
      'When teaching a specific topic special attention is given to the practical aspect of that topic and its correlation with Materia Medica, Organon, Anatomy, Physiology',
      'Academic performance of every student is closely monitored and extra attention is given to below average students through various periodical tests',
      'Arranging yearly educational tours to GMP certified Homoeopathic Manufactories'
    ],
    practical: [
      'Hands-on training in homoeopathic medicinal product preparation, with dispensing and packaging practice',
      'Demonstration of the various instruments essential in homoeopathic pharmacy',
      'Demonstration by various charts and models',
      'Herbarium sheet preparation and plant specimen collection',
      'Clinical training at OPD and IPD classes'
    ],
    teachingAids: [
      'Charts display & Drug sources boards',
      'Models & Pharmacognosy specimens',
      'Seminars & Workshops',
      'Class group discussion & Flip classroom',
      'Projects on various pharmacy topics',
      'Arranging Guest Lecturers of the experts in Pharmacy'
    ],
    facultyList: [
      {
        id: 'f-pha-1',
        name: 'Dr. Arindam Roy',
        designation: 'Asst. Professor & Department Incharge',
        qualification: 'B.H.M.S., M.D. (Hom)',
        specialization: 'Homoeopathic Pharmacy & Posology',
        email: 'arindomroydr@gmail.com',
        phone: '+91 7384294141',
        registrationNumber: '27249 (Council of Homoeopathic Medicine, W.B.)',
        joiningDate: '2020-11-01'
      },
      {
        id: 'f-pha-2',
        name: 'Dr. Soumalya Golder',
        designation: 'Asst. Professor',
        qualification: 'B.H.M.S.; M.D. (Pharmacy); Ph.D (Scholar); DIACH (Greece); P.G.Hom (London); MBA (HA); PGDC (1st Cl, C.U.)',
        specialization: 'Homoeopathic Pharmacy, Quality Control & Pharmacognosy',
        email: 'dr.soumalyagolder@gmail.com',
        phone: '+91 9733408687',
        registrationNumber: '30845 (CHMWB) / 6347 (CCH)',
        joiningDate: '2021-05-11'
      }
    ],
    gallery: [
      {
        id: 'g-pha-1',
        url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800',
        caption: 'Homoeopathic Pharmacy Laboratory & Potentization Apparatus',
        category: 'Laboratory'
      }
    ]
  },
  {
    id: 'pat',
    code: 'DEPT-PAT',
    name: 'Pathology, Microbiology & Parasitology',
    banner: {
      title: 'Department of Pathology, Microbiology, Parasitology & Histopathology',
      subtitle: 'Clinical pathology, bacteriology, parasitology, histopathology slides, and diagnostic evaluation.',
      badge: 'Advanced Histopathology & Micro-Lab',
      bgImageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=1200'
    },
    description: 'Pathology is defined as the study of suffering. Pathology and Microbiology plays an important role to form a strong foundation for the students of medical science. The department provides a decently equipped lab and demonstration room. Various reagents, model, instruments, charts and histopathological slides are present in the department. The instruments provided are as per the instructions of NCH, according to the CBDC curriculum. Beside that the department also provides Audio visual CD, PPt files for qualitative theoretical and practical slides. Bedside demonstrations, clinical class and direct interaction with OPD and IPD patient, Bedside examination provide the 2nd year BHMS student the clear vision about their knowledge.',
    hod: 'Dr. Santanu Mukherjee, D.H.M.S., B.H.M.S., M.D. (Psychiatry), Ph.D. (Pharmacy)',
    yearsCovered: '2nd BHMS (1 Year)',
    methodology: [
      'Special efforts are taken to make the students aware of each and every pathological condition of the body',
      'Special emphasize on the pathological condition and functioning of each system with practical explanation',
      'Emphasize mostly on bacteriological and pathological basis of medical practice',
      'The lectures are in the form of diagrammatic presentations, also demonstrations',
      'When teaching a specific topic special attention is given to the clinical importance',
      'Academic performance closely monitored by conducting MCQ, Quiz, Periodical Test, Terminal Test and Class projects',
      'Extra attention for below average students by extra coaching class and Remedial class'
    ],
    practical: [
      'Demonstration of different types histopathological slides',
      'Demonstration of various pathological and bacteriological lab investigations',
      'Bedside demonstration of Different systems like respiratory system, Digestive system, nerve system by proper equipment of patients',
      'Demonstration of laboratory reports with relation to various clinical cases'
    ],
    teachingAids: [
      'Computer & PPT files',
      'Charts & Diagnostic diagrams',
      'Models & Disease specimens',
      'Instruments & Microscopes',
      'Reagents & Staining materials',
      'Seminars & Workshops'
    ],
    facultyList: [
      {
        id: 'f-pat-1',
        name: 'Dr. Santanu Mukherjee',
        designation: 'Professor',
        qualification: 'D.H.M.S.; B.H.M.S., M.D. (Psychiatry); Ph.D. (Pharmacy)',
        specialization: 'Pathology, Microbiology & Neuro-Psychiatry',
        email: 'mukherjeesantanu10@gmail.com',
        phone: '+91 7595884187',
        registrationNumber: '23433 (Council of Homoeopathic Medicine, W.B.)',
        joiningDate: '2026-07-08'
      },
      {
        id: 'f-pat-2',
        name: 'Dr. Debasish Sarker',
        designation: 'Assistant Professor',
        qualification: 'B.H.M.S.; M.D. (M.M.)',
        specialization: 'Pathology & Diagnostic Laboratory',
        email: 'drdsarker3005@gmail.com',
        phone: '+91 9163818256',
        registrationNumber: '30216 (West Bengal Council of Homoeopathic Medicine)',
        joiningDate: '2023-07-27'
      }
    ],
    gallery: [
      {
        id: 'g-pat-1',
        url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800',
        caption: 'Pathology & Microbiology Microscope Laboratory',
        category: 'Laboratory'
      }
    ]
  },
  {
    id: 'fmt',
    code: 'DEPT-FMT',
    name: 'Forensic Medicine & Toxicology',
    banner: {
      title: 'Department of Forensic Medicine & Toxicology (FMT)',
      subtitle: 'Medical jurisprudence, legal procedures, toxicology specimens, court duties, and post-mortem autopsy training.',
      badge: 'Toxicology Specimen & Weapon Museum',
      bgImageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200'
    },
    description: 'The subject is about medical jurisprudence also termed as legal medicine. This branch of medical science deals with application of the principles, knowledge of medicine to the purpose of law both civil and criminal. It includes the study of Legal procedures, Medical ethics, Forensic medicine. The department has demonstrative materials like Weapons, bones, wet specimens, that are beautifully displayed over a wooden frame, Organic and Inorganic medico-legal specimens; Poisonous plants preserved in attractive containers for demonstration, Charts, diagrams, models, various legislations including H.C.C. Act, different types of oaths, Mental health Act etc. Students witness minimum 10 Post mortem autopsy cases at Burdwan Medical College.',
    hod: 'Dr. Enamul Haque, B.H.M.S. (B.U.), M.D. (Hom)',
    yearsCovered: '2nd BHMS (1 Year)',
    methodology: [
      'In theory classes, example and incidence from daily life, newspapers, television are used for easy comprehension',
      'Practical consists of visit to Government Medical College (Burdwan Medical College) for attending post mortem as observers',
      'A minimum of 10 autopsy cases are witnessed and recorded by each student and authenticated by Prof. of F.M.T. of Burdwan Medical College & Hospital',
      'Study visit to forensic lab and finger print bureau conducted time to time',
      'Internees are given 15 days training in the forensic Department',
      'Ethical behaviour as self-imposed duty upon each Physician'
    ],
    practical: [
      'Post mortem examination & autopsy procedures observation',
      'Classification of injury & medico-legal aspects identification',
      'Rape, natural and unnatural sexual offences medico-legal reporting',
      'Toxicology: poisoning general symptoms & treatment (corrosive, metallic, organic, pesticides)',
      'Court attendance & witness procedure simulation'
    ],
    teachingAids: [
      'Collection of weapons (about 100+ including blunt, sharp, firearms)',
      'Poisons: Organic & Inorganic poisons, mechanical, chemical, vegetable, animals, metals in glass jars',
      'Models: Burns, finger prints, occupational hazards, injuries',
      'Charts: Sex determination, homoeopathic forensic act 1974, mental health act',
      'Transparencies for audiovisual demonstration'
    ],
    facultyList: [
      {
        id: 'f-fmt-1',
        name: 'Dr. Enamul Haque',
        designation: 'Professor & H.O.D.',
        qualification: 'B.H.M.S. (B.U.), M.D. (Hom) DR B.R.A.U.',
        specialization: 'Forensic Medicine & Medical Jurisprudence',
        email: 'drenamul786@gmail.com',
        phone: '+91 9432817751',
        registrationNumber: '27191 (Council of Homoeopathic Medicine, W.B.)',
        joiningDate: '2015-02-01'
      },
      {
        id: 'f-fmt-2',
        name: 'Dr. Abdul Gaffar',
        designation: 'Assist. Professor',
        qualification: 'B.H.M.S.; M.D. (Hom)',
        specialization: 'Toxicology & Medico-Legal Reporting',
        email: 'agaffar572@gmail.com',
        phone: '+91 9734574949',
        registrationNumber: '30673 (Council of Homoeopathic Medicine, W.B.)',
        joiningDate: '2021-08-05'
      }
    ],
    gallery: [
      {
        id: 'g-fmt-1',
        url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800',
        caption: 'Forensic Medicine & Toxicology Specimen Museum',
        category: 'Museum'
      }
    ]
  },
  {
    id: 'gyn',
    code: 'DEPT-GYN',
    name: 'Obstetrics, Gynecology & Neonatology',
    banner: {
      title: 'Department of Obstetrics, Gynecology & Neonatology',
      subtitle: 'Antenatal care, maternal-child health, labor room clinical protocols, and homoeopathic therapeutics.',
      badge: 'Equipped Labor Room & Antenatal OPD',
      bgImageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1200'
    },
    description: 'The department deals with the study of Obstetrics which is a branch of medicine that specializes in the care of woman during pregnancy, childbirth, and the postpartum period; And Gynaecology is a branch of medicine that focuses on the health of the female reproductive system. Lectures are conducted with the aim of making each & every student well versed with the subject. Female pelvic bone, fetal skull bone, dummies, surgical instruments, contraceptives etc. are used to explain the topics with live demonstration. Department is well organized with charts, models & specimen. Obstetrics & Gynaecology is taught in the curriculum of B.H.M.S. in the second & third year.',
    hod: 'Prof. (Dr.) Pronab Bhattacherjee, D.M.S., Dip N.I.H. (Vice Principal)',
    yearsCovered: 'BHMS 2nd Year & 3rd Year',
    methodology: [
      'The lectures are in the form of classroom teaching and in patient & out patient department exposure',
      'Classroom teaching includes diagrammatic presentations and demonstrations',
      'Academic performance of each and every student is closely monitored by conducting periodical tests',
      'Extra attention for below average students by way of individual counseling and extra coaching classes',
      'Assessment examinations are taken as per the norms of W.B. University of Health Sciences'
    ],
    practical: [
      'Obstetrics & Gynaecological case taking of both indoor & outdoor patients',
      'Demonstration of general & systemic examination of the patients',
      'Demonstration of Gynaecological examination',
      'Antenatal care checkups in case pregnant female'
    ],
    teachingAids: [
      'Computer & CDs',
      'Charts & Diagrams',
      'Models & Specimen jars',
      'Dummies & Pelvic models',
      'Bones (Female pelvic bone, Fetal skull bone)',
      'Slides & Surgical instruments',
      'Contraceptives & Family planning devices',
      'Books, Seminars & Workshops',
      'Guest lectures of experts in Obstetrics & Gynaecology'
    ],
    facultyList: [
      {
        id: 'f-gyn-1',
        name: 'Prof. (Dr.) Pronab Bhattacherjee',
        designation: 'Professor & H.O.D., Vice Principal',
        qualification: 'D.M.S., Dip N.I.H.',
        specialization: 'Obstetrics, Gynecology & Clinical Academics',
        email: 'drpronabb@gmail.com',
        phone: '+91 9932783143 / +91 7001539036',
        registrationNumber: '11307 (Council of Homoeopathic Medicine West Bengal)',
        joiningDate: '1998-11-02'
      },
      {
        id: 'f-gyn-2',
        name: 'Dr. Debasish Chakraborty',
        designation: 'Professor',
        qualification: 'B.H.M.S. (C.U.), M.D. (Hom.) WBUHS',
        specialization: 'Gynecology & Homoeopathic Therapeutics',
        email: 'drdebasish78@gmail.com',
        phone: '+91 9433311889',
        registrationNumber: '25937 (Council of Homoeopathic Medicine West Bengal)',
        joiningDate: '2011-09-14'
      },
      {
        id: 'f-gyn-3',
        name: 'Dr. Sharmistha Nandi',
        designation: 'Associate Professor',
        qualification: 'B.H.M.S. (MUHS), M.D. (Hom.)',
        specialization: 'Obstetrics & Neonatology',
        email: 'sharmishthan93@gmail.com',
        phone: '+91 8329668180',
        registrationNumber: '33886 (Council of Homoeopathic Medicine. W.B.)',
        joiningDate: '2020-03-11'
      }
    ],
    gallery: [
      {
        id: 'g-gyn-1',
        url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
        caption: 'Obstetrics & Gynecology Clinical Demonstration',
        category: 'Clinical'
      }
    ]
  },
  {
    id: 'sur',
    code: 'DEPT-SUR',
    name: 'Surgery & Allied Specialties',
    banner: {
      title: 'Department of Surgery & Allied Specialties',
      subtitle: 'General surgery, systemic surgery, orthopaedics, dental surgery, ophthalmology, OT protocols, and surgical care.',
      badge: 'Modernized Operation Theater & Surgical OPD',
      bgImageUrl: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=1200'
    },
    description: 'The department is a well-equipped modernized department dealing with the study of Surgery, which is a branch of medical science to save the life from emergency. There are different branches in that department, like General Surgery, Systemic Surgery, Orthopaedics, Dental Surgery, Ophthalmology, Plastic Surgery etc. Lectures are conducted with the aim of making each & every student well versed with the subject. The bones, fracture articles, X-ray plates, specimens, models, slides etc. are used to explain the topics with live demonstration. Both theory, practical & clinical classes are taught in the curriculum of B.H.M.S. in the second & third year.',
    hod: 'Dr. Sushil Murmu, M.B.B.S., M.S. General Surgery',
    yearsCovered: 'BHMS 2nd Year & 3rd Year',
    methodology: [
      'Lectures in the form of classroom teaching and in patient & outpatient department exposure',
      'Classroom teaching includes diagrammatic presentations and demonstrations',
      'Academic performance closely monitored by conducting periodical tests, records duly maintained'
    ],
    practical: [
      'Surgical case taking of patients both in O.P.D & I.P.D.',
      'Demonstration of general & systemic examination of the patients',
      'Observation of minor surgical procedures, dressing, and OT sterilisation'
    ],
    teachingAids: [
      'Computer & CDs',
      'Charts & Surgical diagrams',
      'Models & Specimen jars',
      'Bones & Fracture articles',
      'Slides & X-ray plates',
      'Surgical instruments sets',
      'Seminars, Workshops & Guest lectures of experts in Surgical cases'
    ],
    facultyList: [
      {
        id: 'f-sur-1',
        name: 'Dr. Sushil Murmu',
        designation: 'Professor & H.O.D.',
        qualification: 'M.B.B.S. , M.S. General Surgery',
        specialization: 'General Surgery & Operative Protocols',
        email: 'sushilmurmu@bwnhmch.com',
        phone: '+91 9382311107',
        registrationNumber: '52723 (West Bengal Medical Council)',
        joiningDate: '2019-05-10'
      },
      {
        id: 'f-sur-2',
        name: 'Prof. (Dr.) Susmita Chatterjee',
        designation: 'Professor & Principal',
        qualification: 'B.Sc., D.H.M.S. (Gold Medalist), M.D. (Hom) BRAU',
        specialization: 'Clinical Surgery & Homoeopathic Management',
        email: 'drsusmita01@gmail.com',
        phone: '+91 9434238508',
        registrationNumber: '18020 (Council of Homoeopathic Medicine West Bengal)',
        joiningDate: '2013-06-04'
      },
      {
        id: 'f-sur-3',
        name: 'Dr. Chinmoy Sarkar',
        designation: 'Professor',
        qualification: 'M.B.B.S. (Madras University), M.D. (AIIMS)',
        specialization: 'Systemic Surgery & General Medicine',
        email: 'chinmoysarkar@bwnhmch.com',
        phone: '+91 9474490423',
        registrationNumber: '70290 (West Bengal Medical Council)',
        joiningDate: '2002-02-07'
      },
      {
        id: 'f-sur-4',
        name: 'Dr. Prithish Mukherjee',
        designation: 'Guest Associate Professor',
        qualification: 'B.D.S.',
        specialization: 'Dental Surgery & Oral Medicine',
        email: 'dr.prithwish4u@gmail.com',
        phone: '+91 7276772047',
        registrationNumber: '3304 (West Bengal Dental Council)',
        joiningDate: '2019-05-02'
      },
      {
        id: 'f-sur-5',
        name: 'Dr. Kazi Toufik Ali',
        designation: 'Assistant Professor',
        qualification: 'B.H.M.S ; M.D. (Materia Medica)',
        specialization: 'Surgical Therapeutics',
        email: 'kazitoufik50@gmail.com',
        phone: '+91 9875430811',
        registrationNumber: '33155 (West Bengal Council of Homoeopathic Medicine)',
        joiningDate: '2026-05-08'
      },
      {
        id: 'f-sur-6',
        name: 'Dr. Sk. Gousul Azam',
        designation: 'Assist. Professor',
        qualification: 'BHMS, MD(HOM.)',
        specialization: 'Surgical Case Evaluation',
        email: 'skgousul@gmail.com',
        phone: '+91 09932169874',
        registrationNumber: '26775 (Council of Homoeopathic Medicine. W.B.)',
        joiningDate: '2020-03-16'
      },
      {
        id: 'f-sur-7',
        name: 'Dr. Asim Kumar Das',
        designation: 'Professor',
        qualification: 'B.H.M.S. ; M.D. (Organon of Medicine)',
        specialization: 'Emergency & Surgical Therapeutics',
        email: 'drakd64@gmail.com',
        phone: '+91 9433132147',
        registrationNumber: '18067 (West Bengal Council of Homoeopathic Medicine)',
        joiningDate: '2025-07-01'
      }
    ],
    gallery: [
      {
        id: 'g-sur-1',
        url: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800',
        caption: 'Surgical Instrument Gallery & OT Sterilisation Room',
        category: 'Clinical'
      }
    ]
  },
  {
    id: 'med',
    code: 'DEPT-MED',
    name: 'Practice of Medicine',
    banner: {
      title: 'Department of Practice of Medicine & Homoeopathic Therapeutics',
      subtitle: 'Clinical diagnosis, differential diagnosis, systemic pathology, and individualized homoeopathic treatment.',
      badge: '250+ Daily Patient OPD Clinical Training',
      bgImageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1200'
    },
    description: 'Medicine is an enormously expanding subject with no leaps and bounds. Practice of medicine with Homoeopathic therapeutics is concerned with study of clinical methods, clinical presentations of systemic diseases, differential diagnosis, prognosis, general management & integration of Homoeopathic principles to evolve Homoeopathic Therapeutics. Homoeopathy has a distinct approach to the concept of disease. It recognizes the ailing individual by studying him as a whole rather than in terms of sick parts & emphasizes the study of the man, his state of health, state of illness. Practice of Medicine is able to correlate the disease conditions with the basis of Anatomy, Physiology, Biochemistry & Pathology.',
    hod: 'Dr. Soumitra De, BHMS, MD(HOM)',
    yearsCovered: 'BHMS 3rd Year & 4th Year',
    methodology: [
      'Special efforts are taken to make the students aware of each & every disease',
      'The lectures are in the form of diagrammatic presentations & also demonstrations',
      'When teaching on a specific topic special attention is given to the clinical importance & prognosis of the patient',
      'Academic performance of each & every student is closely monitored by conducting periodical tests',
      'Seminars held on time to time on different topics and remedial classes taken properly',
      'Assessment examinations as per norms of University'
    ],
    practical: [
      'Bedside clinical case taking in OPD & IPD wards',
      'Demonstration of various charts, models, x-ray films, CT scan, reports, instruments, E.C.G. etc.',
      'Differential diagnosis and homoeopathic prescription synthesis'
    ],
    teachingAids: [
      'Charts & Clinical flowcharts',
      'Models & Diagnostic tools',
      'ECG Machine & Lead tracings',
      'Instruments & Diagnostic sets',
      'X-rays & CT scan viewing illuminators',
      'Reports & Laboratory case records'
    ],
    facultyList: [
      {
        id: 'f-med-1',
        name: 'Dr. Soumitra De',
        designation: 'Associate Professor & Departmental In-charge',
        qualification: 'BHMS, MD(HOM)',
        specialization: 'Practice of Medicine & Clinical Therapeutics',
        email: 'drsoumitrade81@gmail.com',
        phone: '+91 9732098732',
        registrationNumber: '26345 (Council of Homoeopathic Medicine, W.B.)',
        joiningDate: '2011-08-11'
      },
      {
        id: 'f-med-2',
        name: 'Shilpa Mondal',
        designation: 'Assistant Professor',
        qualification: 'B.H.M.S. ; M.D. (Practice of Medicine)',
        specialization: 'Internal Medicine & Differential Diagnosis',
        email: 'shilpa.bhmh@gmail.com',
        phone: '+91 6297780121',
        registrationNumber: '33512 (West Bengal Council of Homoeopathic Medicine)',
        joiningDate: '2026-05-08'
      },
      {
        id: 'f-med-3',
        name: 'Dr. Kousick Mati',
        designation: 'Assistant Professor',
        qualification: 'B.H.M.S. ; M.D. (Psychiatry)',
        specialization: 'Psychiatry & Internal Medicine',
        email: 'drkousickmati@gmail.com',
        phone: '+91 9903097262',
        registrationNumber: '29266 (West Bengal Council of Homoeopathic Medicine)',
        joiningDate: '2025-07-01'
      },
      {
        id: 'f-med-4',
        name: 'Dr. Ashis Biswas',
        designation: 'Assist. Professor',
        qualification: 'B.H.M.S.(WBUHS), M.D.(HOM) DR BRAUHS',
        specialization: 'Clinical Medicine',
        email: 'biswas.asashish@gmail.com',
        phone: '+91 8918297412',
        registrationNumber: '32025 (Council of Homoeopathic Medicine, W.B.)',
        joiningDate: '2022-06-01'
      }
    ],
    gallery: [
      {
        id: 'g-med-1',
        url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
        caption: 'General Medicine Clinical Ward Rounds',
        category: 'Clinical'
      }
    ]
  },
  {
    id: 'cm',
    code: 'DEPT-CM',
    name: 'Community Medicine',
    banner: {
      title: 'Department of Community Medicine & Public Health',
      subtitle: 'Epidemiology, preventive medicine, health awareness camps, immunization, and rural health surveys.',
      badge: 'School & Rural Health Camp Extension',
      bgImageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1200'
    },
    description: 'The Subject Community Medicine is the Successor of what has been previously known as PUBLIC HEALTH, PREVENTIVE MEDICINE, SOCIAL MEDICINE and COMMUNITY HEALTH. Previously the name of this Subject was "HYGIENE" - then PREVENTIVE & SOCIAL MEDICINE then COMMUNITY MEDICINE. The Todd Commission in 1968 recommended that every Medical School should have a Dept. of Community Medicine. Diagnosis of the state of health of a Community is an important foundation of Community Medicine. Dictum: "PREVENTION IS BETTER THAN CURE".',
    hod: 'Dr. Sourav Kr. Sarkar, B.H.M.S. (Hons), M.D. (Hom), MBA',
    yearsCovered: 'BHMS 3rd Year & 4th Year',
    methodology: [
      'At first class demonstrations then group discussions then tutorial class then practical',
      'Practical work noted in the practical note book',
      'Conducting health awareness programmes, school health camps, and public health sanitization visits'
    ],
    practical: [
      'Water treatment plant & Milk pasteurization plant visits',
      'Primary health centre & Sub-centre/anganwadi centre visits',
      'Old age home, Industrial units & Infectious disease hospital study tours',
      'Health mela / health check-up camps organization',
      'Rehab center for physical/mental disabilities & Mental health facility visits'
    ],
    teachingAids: [
      'Models: Slow sand, Rapid sand, Sanitary well, Insanitary well, Rca latrine, Septic tank latrine, Mosquito 4 types, Malaria parasite, Filarial model, Smokeless chullah, Helminthes',
      'Charts and Diagrams: Concept of health/disease, Epidemiology of communicable diseases, Immunization schedule, Homoeoprophylaxis, Demography & family planning, Health information & biostatistics, Non-communicable disease, IEC & counselling, Diet & nutrition, National health programmes'
    ],
    facultyList: [
      {
        id: 'f-cm-1',
        name: 'Dr. Sourav Kr. Sarkar',
        designation: 'Professor & HOD',
        qualification: 'B.H.M.S (HONS), M.D. (HOM) ; MBA (HOSPITAL MANAGEMENT)',
        specialization: 'Community Medicine & Public Health Administration',
        email: 'drsourav.2013@rediffmail.com',
        phone: '+91 9434015868',
        registrationNumber: '26409 (Council of Homoeopathic Medicine, W.B)',
        joiningDate: '2011-11-08'
      },
      {
        id: 'f-cm-2',
        name: 'Prof. (Dr.) Asim Kumar Samanta',
        designation: 'Guest Professor, Director',
        qualification: 'B.SC. D.M.S., M.D. (HOM) DR. B.R. A. U.',
        specialization: 'Preventive & Social Medicine, Public Health',
        email: 'asimkumarsamanta@gmail.com',
        phone: '+91 9832159528 / +91 9434360399',
        registrationNumber: '11118 (Council of Homoeopathic Medicine, W.B)',
        joiningDate: '1986-07-01'
      },
      {
        id: 'f-cm-3',
        name: 'Dr. Ashish Sarkar',
        designation: 'Assistant Professor',
        qualification: 'B.H.M.S. ; M.D.(M.M)',
        specialization: 'Epidemiology & Biostatistics',
        email: 'ashish.dtk@gmail.com',
        phone: '+91 9804120328',
        registrationNumber: '31153 (West Bengal Council of Homoeopathic Medicine)',
        joiningDate: '2023-07-25'
      },
      {
        id: 'f-cm-4',
        name: 'Dr. Anisa Afroz',
        designation: 'Assistant Professor',
        qualification: 'B.H.M.S.; M.P.H. (Master in Public Health)',
        specialization: 'Master in Public Health & Community Medicine',
        email: 'anisaafroz@gmail.com',
        phone: '+91 8582813028',
        registrationNumber: '32169 (Council of Homoeopathic Medicine, W.B.)',
        joiningDate: '2025-07-18'
      }
    ],
    gallery: [
      {
        id: 'g-cm-1',
        url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800',
        caption: 'Community Health Camp & Immunization Outreach',
        category: 'Field Visit'
      }
    ]
  },
  {
    id: 'mat',
    code: 'DEPT-MAT',
    name: 'Homoeopathic Materia Medica',
    banner: {
      title: 'Department of Homoeopathic Materia Medica',
      subtitle: 'Comprehensive study of pharmacodynamics, drug proving, drug pictures, nosodes, sarcodes, and clinical application.',
      badge: 'Creative Drug Picture Museum',
      bgImageUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=1200'
    },
    description: 'A very capacious and well equipped Materia Medica department has been set up with an aim to make students easy to understand this subject. Numerous specimens of different kingdoms, models & charts (spider group, nosodes, sarcodes, ophidia) and other creative charts are present in the department which helps to provide knowledge in both theoretical and practical aspects. Duration of Materia Medica in the curriculum of BHMS is from 1st to 4th year. University examination at the end of every year of BHMS and a semester examination is held every six months for each year. Homoeopathic Materia Medica is the study of the action of drugs on healthy human being as a whole taking into consideration individual susceptibility and its reaction to various circumstances and time. "While the Materia Medica, in the books, is a simple record of observed facts, in the mind of practitioners it becomes the subject of the reflection, of comparison & of hypothetical reasoning." --- Carroll Dunham.',
    hod: 'Dr. Priyanka Maji, BHMS, MD(HOM.)',
    yearsCovered: 'BHMS 1st Year to 4th Year',
    methodology: [
      'Efforts are being taken to make students understand each and every drug in the best possible way',
      'The lectures are in the form of presentations and a drug picture is always given beforehand',
      'While teaching a specific drug, importance is given to the drug picture or pen picture to build a deep understanding',
      'Academic performance closely monitored by conducting periodical tests, records duly maintained',
      'Strict attention given to all students. Assessment examinations taken as per norms of NCH'
    ],
    practical: [
      'Demonstration by various artificial models and charts',
      'Clinical classes through OPD & IPD',
      'Visit to the Hospital section'
    ],
    teachingAids: [
      'Charts display (Spider group, Nosodes, Sarcodes, Ophidia)',
      'Models & Drug source illustrations',
      'Specimen jars',
      'Seminars & Workshops',
      'Arranging Guest lectures of the experts in Materia Medica'
    ],
    facultyList: [
      {
        id: 'f-mat-1',
        name: 'Dr. Priyanka Maji',
        designation: 'Associate Professor & Department Incharge',
        qualification: 'BHMS, MD(HOM.)',
        specialization: 'Materia Medica & Clinical Drug Pictures',
        email: 'priyanka.maji2013@gmail.com',
        phone: '+91 7980400014',
        registrationNumber: '30439 (Council of Homoeopathic Medicine. W.B.)',
        joiningDate: '2020-01-13'
      },
      {
        id: 'f-mat-2',
        name: 'Dr. Aditi Biswas',
        designation: 'Asst. Professor',
        qualification: 'B.H.M.S.(C.U.), M.D. (HOM)',
        specialization: 'Materia Medica & Keynotes',
        email: 'biswas.aditirs@gmail.com',
        phone: '+91 8902228988',
        registrationNumber: '32032 (Council of Homoeopathic Medicine, W.B.)',
        joiningDate: '2022-06-01'
      },
      {
        id: 'f-mat-3',
        name: 'Dr. Nabanita Kundu',
        designation: 'Assistant Professor',
        qualification: 'B.H.M.S ; M.D. (MATERIA MEDICA)',
        specialization: 'Materia Medica & Comparative Therapeutics',
        email: 'kundunabanitanih25@gmail.com',
        phone: '+91 7908659741',
        registrationNumber: '32635 (West Bengal Council of Homoeopathic Medicine)',
        joiningDate: '2024-05-15'
      },
      {
        id: 'f-mat-4',
        name: 'Dr. Dipa Kundu',
        designation: 'Assistant Professor',
        qualification: 'B.H.M.S ; M.D. (MATERIA MEDICA)',
        specialization: 'Materia Medica & Pharmacodynamics',
        email: 'dipakundu226@gmail.com',
        phone: '+91 7908186940',
        registrationNumber: '32831 (West Bengal Council of Homoeopathic Medicine)',
        joiningDate: '2026-01-29'
      },
      {
        id: 'f-mat-5',
        name: 'Dr. Abhijit Chatterjee',
        designation: 'Lecturer / Asst. Professor (Research Lead)',
        qualification: 'B.H.M.S., M.D. (Hom)',
        specialization: 'Materia Medica & Diagnostic Triangle Research (IMPS / ICMR)',
        email: 'abhijitchatterjee@bwnhmch.com',
        phone: '+91 9434238508',
        registrationNumber: '28910 (Council of Homoeopathic Medicine W.B.)',
        joiningDate: '2013-07-01'
      }
    ],
    gallery: [
      {
        id: 'g-mat-1',
        url: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=800',
        caption: 'Materia Medica Drug Proving & Specimen Hall',
        category: 'Classroom'
      }
    ]
  },
  {
    id: 'rep',
    code: 'DEPT-REP',
    name: 'Case Taking & Repertory',
    banner: {
      title: 'Department of Case Taking & Repertory',
      subtitle: 'Techniques of case taking, symptom evaluation, repertorization methods, and computer software integration.',
      badge: 'Computer Repertorization Lab',
      bgImageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200'
    },
    description: 'Case taking is the stepping stone of repertorization. A repertory which is complete is an important tool not only to select the similimum but also recollect and culture Materia medica. It is unfortunate but hard truth that no repertory recognized as "complete". There are so many repertories constructed considering various aspect like clinical, general, particular etc to serve the purpose. The department of Homoeopathic Repertory & Case Taking helps the neophytes to learn, understand and application of different repertories according to demands of the case.',
    hod: 'Dr. Ashok Kr. Bhattacherjee, B.Sc, D.M.S, Dip N.H., M.D.(HOM)',
    yearsCovered: 'BHMS 3rd Year & 4th Year',
    methodology: [
      'Lectures are in the forms of classroom teaching and clinical teaching in OPD/IPD',
      'Hand on practices is available to the students to use the different computer software related to Homoeopathic Repertory and Repertorization',
      'Regular class test/unit test conducted to evaluate students\' progress and special attention given to underperformed students'
    ],
    practical: [
      'Practical classes conducted on regular basis in OPD, computer lab and IPD'
    ],
    teachingAids: [
      'Different book repertory (Kent, Boenninghausen, Boger, Synthesis, Radar)',
      'Computer software (RadarOpus, Hompath, Cara)',
      'Charts Flow',
      'Charts',
      'Seminar',
      'Power point presentation'
    ],
    facultyList: [
      {
        id: 'f-rep-1',
        name: 'Dr. Ashok Kr. Bhattacherjee',
        designation: 'Guest Professor',
        qualification: 'B.SC,D.M.S,DIP N.H., M.D.(HOM) DR BRAU',
        specialization: 'Repertory & Classical Case Analysis',
        email: 'drakb1958@gmail.com',
        phone: '+91 9933430740',
        registrationNumber: '8424 (West Bengal Medical Council)',
        joiningDate: '1988-03-01'
      },
      {
        id: 'f-rep-2',
        name: 'Dr. Shimul Das',
        designation: 'Assistant Professor',
        qualification: 'B.H.M.S. ; M.D. (HOM)',
        specialization: 'Case Taking & Repertorization',
        email: 'dr.shimuldas@gmail.com',
        phone: '+91 9735169435',
        registrationNumber: '29965 (West Bengal Council of Homoeopathic Medicine)',
        joiningDate: '2023-06-05'
      },
      {
        id: 'f-rep-3',
        name: 'Dr. Soumyadip Pal',
        designation: 'Assistant Professor',
        qualification: 'B.H.M.S. ; M.D. (REPERTORY)',
        specialization: 'Computer Repertorization & RadarOpus',
        email: 'soumyapal545@gmail.com',
        phone: '+91 9088072359',
        registrationNumber: '32947 (West Bengal Council of Homoeopathic Medicine)',
        joiningDate: '2025-07-01'
      },
      {
        id: 'f-rep-4',
        name: 'Dr. Abdul Hakim Sk.',
        designation: 'Assistant Professor',
        qualification: 'B.H.M.S ; M.D. (REPERTORY)',
        specialization: 'Repertory & Symptom Totality',
        email: 'hakimsk95@gmail.com',
        phone: '+91 9083550360',
        registrationNumber: '33036 (West Bengal Council of Homoeopathic Medicine)',
        joiningDate: '2025-07-01'
      }
    ],
    gallery: [
      {
        id: 'g-rep-1',
        url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
        caption: 'Computer Repertorization Laboratory & RadarOpus Training',
        category: 'Laboratory'
      }
    ]
  },
  {
    id: 'yog',
    code: 'DEPT-YOG',
    name: 'Yoga & Naturopathy',
    banner: {
      title: 'Department of Yoga & Naturopathy',
      subtitle: 'Practical training in Yoga, Asanas, Pranayama, and Naturopathic principles in accordance with AYUSH and NCH guidelines.',
      badge: 'AYUSH Certified Yoga Center',
      bgImageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=1200'
    },
    description: 'Department of Yoga & Naturopathy provides practical training in Yoga, Asanas, Pranayama, and Naturopathic principles to BHMS scholars, promoting holistic health and mind-body equilibrium in accordance with AYUSH and NCH guidelines.',
    hod: 'Dr. Shah Alam, Assistant Professor (BNYS)',
    yearsCovered: 'BHMS All Years & Hospital OPD/IPD Patients',
    methodology: [
      'Practical demonstration of Yogic Asanas and Pranayama techniques',
      'Integration of Yoga & Naturopathy in clinical OPD/IPD patient recovery',
      'Awareness workshops on stress management and holistic wellness'
    ],
    practical: [
      'Daily practical sessions in Yoga and Meditation',
      'Patient counseling on therapeutic Yoga for chronic diseases'
    ],
    teachingAids: [
      'Yoga mats & Demonstration Hall',
      'Charts on Yogic Postures & Asanas',
      'Audio-visual relaxation modules'
    ],
    facultyList: [
      {
        id: 'f-yog-2',
        name: 'Dr. Shah Alam',
        designation: 'Assistant Professor',
        qualification: 'B.N.Y.S.',
        specialization: 'Yoga & Naturopathic Medicine',
        email: 'drshahalam@bwnhmch.com',
        phone: '+91 9834718527',
        registrationNumber: '303 (Central Council for Research in Yoga & Naturopathy)',
        joiningDate: '2025-07-02'
      }
    ],
    gallery: [
      {
        id: 'g-yog-1',
        url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=800',
        caption: 'Yoga & Naturopathy Demonstration Center',
        category: 'Clinical'
      }
    ]
  }
];

export const departmentCmsService = {
  getDepartments: (): DepartmentCMSData[] => {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            const hasObsoleteStaff = parsed.some((d: any) =>
              Array.isArray(d.facultyList) && d.facultyList.some((f: any) =>
                /amit dhank/i.test(f.name) || /tapan kumar/i.test(f.name) || /moumita maji/i.test(f.name) || /sunil kumar shaw/i.test(f.name) || /anup prasad/i.test(f.name) || /puspendu/i.test(f.name) || /shyamashri/i.test(f.name) || /namrata das/i.test(f.name) || /bhubaneswar/i.test(f.name) || /sukdev/i.test(f.name) || /awadhesh/i.test(f.name) || /abhi jana/i.test(f.name) || /dilip basak/i.test(f.name) || /pritrish/i.test(f.name) || /arunima laha/i.test(f.name) || /chandra das/i.test(f.name) || /swapan/i.test(f.name)
              )
            );
            if (hasObsoleteStaff) {
              console.log('[DepartmentCMS] Purged obsolete cached staff records from localStorage.');
              localStorage.removeItem(STORAGE_KEY);
            } else if (parsed.length > 0) {
              return parsed;
            }
          }
        }
      }
    } catch (e) {
      console.error('Error loading department CMS data from storage:', e);
    }
    // Fallback to sanitized default dataset containing ONLY Rajesh Pal
    return INITIAL_DEPARTMENT_CMS_DATA.map((dept) => {
      if (dept.id === 'org') {
        return {
          ...dept,
          facultyList: [
            {
              id: 'fac-test-001',
              name: 'Rajesh Pal',
              designation: 'Assistant Professor',
              qualification: 'BHMS, MD (Hom)',
              specialization: 'Homoeopathic Medicine',
              email: 'rajesh.pal@bhmc.edu.in',
              phone: '+91 98000 00001',
              registrationNumber: 'TEST-FAC-001',
              joiningDate: '2024-01-01',
            },
          ],
        };
      }
      return { ...dept, facultyList: [] };
    });
  },

  getDepartmentById: (id: string): DepartmentCMSData | undefined => {
    const list = departmentCmsService.getDepartments();
    return list.find((d) => d.id === id || d.code.toLowerCase() === id.toLowerCase());
  },

  saveDepartment: (updatedDept: DepartmentCMSData, updatedBy = 'Admin'): DepartmentCMSData => {
    const list = departmentCmsService.getDepartments();
    const index = list.findIndex((d) => d.id === updatedDept.id);
    
    const prepared: DepartmentCMSData = {
      ...updatedDept,
      lastUpdated: new Date().toISOString(),
      updatedBy
    };

    if (index >= 0) {
      list[index] = prepared;
    } else {
      list.push(prepared);
    }

    departmentCmsService.saveAll(list);
    return prepared;
  },

  saveAll: (list: DepartmentCMSData[]): void => {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      }
    } catch (e) {
      console.error('Error persisting department CMS data:', e);
    }
  },

  resetDepartmentToDefault: (id: string): DepartmentCMSData | undefined => {
    const defaultItem = INITIAL_DEPARTMENT_CMS_DATA.find((d) => d.id === id);
    if (!defaultItem) return undefined;
    return departmentCmsService.saveDepartment(defaultItem, 'System Reset');
  },

  resetAllToDefault: (): DepartmentCMSData[] => {
    departmentCmsService.saveAll(INITIAL_DEPARTMENT_CMS_DATA);
    return INITIAL_DEPARTMENT_CMS_DATA;
  }
};
