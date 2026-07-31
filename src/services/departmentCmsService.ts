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
    description: 'The Department of Organon of Medicine & Homoeopathic Philosophy at BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL imparts rigorous, classical training in the philosophy of Dr. Samuel Hahnemann (§1-§294), holistic disease evaluation, miasmatic analysis, and psychological understanding integral to clinical case handling.',
    hod: 'Prof. (Dr.) A. K. Roy, M.D. (Hom.)',
    yearsCovered: 'BHMS 1st Year to 4th Year',
    methodology: [
      'Classroom teaching & structured aphorism breakdown (§1 to §294)',
      'Hahnemannian philosophy & miasmatic disease theory seminars',
      'Psychology integration in medical case evaluation and mental rubrics',
      'PowerPoint presentations (PPT) & audiovisual smart classroom modules',
      'Educational charts & structural flow diagrams for logic analysis',
      'Clinical demonstrations in OPD/IPD settings & bedside rounds',
      'Periodic assessments, viva voce, quizzes & remedial coaching'
    ],
    practical: [
      'Direct OPD/IPD clinical exposure & bedside patient rounds',
      'Detailed individual case taking & patient interview techniques',
      'Analysis of fundamental Hahnemannian philosophy in active cases',
      'Miasmatic diagnosis & symptom classification (Psoric, Sycotic, Syphilitic, Tubercular)',
      'Application of posology, potency selection & repetition principles (§245-§285)',
      'Long-term case follow-up & curative outcome evaluation'
    ],
    teachingAids: [
      'Interactive smart classroom display panels',
      'Educational philosophy flowcharts & aphorism breakdown diagrams',
      'Audiovisual case presentation archives',
      'Rare German translation archives & historical homoeopathic literature',
      'Clinical case study worksheets & evaluation protocols'
    ],
    facultyList: [
      {
        id: 'f-org-1',
        name: 'Prof. (Dr.) A. K. Roy',
        designation: 'Professor & Head of Department (HOD)',
        qualification: 'M.D. (Hom.)',
        specialization: 'Organon & Hahnemannian Philosophy',
        email: 'akroy.org@bwnhmch.com',
        phone: '+91 94343 11101'
      },
      {
        id: 'f-org-2',
        name: 'Dr. S. K. Mukherjee',
        designation: 'Associate Professor',
        qualification: 'M.D. (Hom.)',
        specialization: 'Miasmatic Analysis & Chronic Diseases',
        email: 'skmukherjee@bwnhmch.com',
        phone: '+91 94343 11102'
      },
      {
        id: 'f-org-3',
        name: 'Dr. R. N. Dutta',
        designation: 'Assistant Professor',
        qualification: 'M.D. (Hom.)',
        specialization: 'Psychology in Homoeopathic Practice',
        email: 'rndutta@bwnhmch.com',
        phone: '+91 94343 11103'
      },
      {
        id: 'f-org-4',
        name: 'Dr. P. B. Maiti',
        designation: 'Lecturer / Clinical Tutor',
        qualification: 'B.H.M.S., M.D. (Hom.)',
        specialization: 'Clinical Organon & Case Taking',
        email: 'pbmaiti@bwnhmch.com',
        phone: '+91 94343 11104'
      }
    ],
    gallery: [
      {
        id: 'g-org-1',
        url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
        caption: 'Organon Philosophy Seminar Room & Interactive Lecture Session',
        category: 'Classroom'
      },
      {
        id: 'g-org-2',
        url: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80&w=800',
        caption: 'Bedside Clinical Demonstration in Hospital Ward',
        category: 'Clinical'
      },
      {
        id: 'g-org-3',
        url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800',
        caption: 'Rare Historical Books Archive & German Translation Reference Desk',
        category: 'Library'
      }
    ],
    research: [
      'Miasmatic Analysis of Chronic Autoimmune Disorders in Rural Bengal Population',
      'Posology Protocols in High Potency Prescribing for Psychiatric Conditions',
      'Psychological Profiling and Mental Symptom Evaluation in Homoeopathic Therapeutics',
      'Comparative Efficacy of LM Potencies vs Centesimal Potencies in Chronic Cases'
    ],
    achievements: [
      'Awarded Best Academic Department in Hahnemannian Studies by WBUHS (2025)',
      'Published 14 peer-reviewed research papers in national and international AYUSH journals',
      'Hosted National Seminar on Miasms & Chronic Diseases with over 400 delegates'
    ],
    downloads: [
      '/documents/bhmch_organon_syllabus.pdf',
      '/documents/bhmch_organon_miasmatic_worksheet.pdf',
      '/documents/bhmch_organon_aphorisms_summary.pdf'
    ].map((fileUrl, idx) => {
      const titles = [
        'BHMS Organon of Medicine Syllabus & Curriculum Breakdown (NCH 2026)',
        'Miasmatic Symptom Evaluation Worksheet & Case Logbook Template',
        'Organon Aphorism Quick Reference Guide (§1 - §294 Summary)'
      ];
      return {
        id: `d-org-${idx + 1}`,
        title: titles[idx],
        url: fileUrl,
        fileType: 'PDF Document',
        fileSize: '1.8 MB',
        uploadDate: '2026-01-15'
      };
    }),
    laboratories: ['Organon Philosophy Seminar Room', 'Computerized Logic & Case Analysis Lab'],
    facilities: ['Audio-Visual Smart Classroom', 'Historical Rare Books Archive', 'Miasmatic Case Repository']
  },
  {
    id: 'mm',
    code: 'DEPT-MM',
    name: 'Homoeopathic Materia Medica',
    banner: {
      title: 'Department of Homoeopathic Materia Medica',
      subtitle: 'Comprehensive study of drug proving, pathogenetic action, and remedy pictures spanning BHMS 1st to 4th year.',
      badge: 'Core Clinical Department',
      bgImageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=1200'
    },
    description: 'The Department of Homoeopathic Materia Medica provides in-depth education across BHMS 1st, 2nd, 3rd, and 4th years. It focuses on the origin, proving, sphere of action, pathogenetic effects, modality dynamics, and comprehensive clinical drug pictures of homoeopathic remedies.',
    hod: 'Prof. (Dr.) S. N. Bhattacharya, M.D. (Hom.)',
    yearsCovered: 'BHMS 1st Year to 4th Year',
    methodology: [
      'Drug picture methodology & remedy profiling across all system systems',
      'Systematic teaching from BHMS 1st to 4th year covering over 200 remedies',
      'Comparative Materia Medica studies and remedy differentiation',
      'Clinical demonstrations in hospital OPD and IPD wards',
      'Guest lectures by eminent homoeopaths and national experts',
      'Interactive workshops, journal clubs & scientific symposia',
      'Practical classes & herbarium specimen study sessions'
    ],
    practical: [
      'Practical classes & plant, mineral, animal specimen identification',
      'Bedside clinical demonstrations in OPD/IPD with live prescription verification',
      'Symptom synthesis & remedy differentiation exercises',
      'Drug proving observation & recording methodologies',
      'Clinical verification of rare remedies in inpatient care'
    ],
    teachingAids: [
      'Anatomical & pharmaceutical specimen models',
      'Educational drug charts & comparison tables',
      'Authentic plant, mineral & animal specimens display',
      'Drug museum artifacts & botanical herbarium sheets',
      'Multimedia presentations & video lecture archives'
    ],
    facultyList: [
      {
        id: 'f-mm-1',
        name: 'Prof. (Dr.) S. N. Bhattacharya',
        designation: 'Professor & Head of Department (HOD)',
        qualification: 'M.D. (Hom.)',
        specialization: 'Clinical Materia Medica & Drug Proving',
        email: 'snbhattacharya@bwnhmch.com',
        phone: '+91 94343 22201'
      },
      {
        id: 'f-mm-2',
        name: 'Dr. M. K. Ghosh',
        designation: 'Associate Professor',
        qualification: 'M.D. (Hom.)',
        specialization: 'Comparative Materia Medica',
        email: 'mkghosh@bwnhmch.com',
        phone: '+91 94343 22202'
      },
      {
        id: 'f-mm-3',
        name: 'Dr. P. S. Roy',
        designation: 'Assistant Professor',
        qualification: 'M.D. (Hom.)',
        specialization: 'Botanical & Mineral Drug Proving',
        email: 'psroy@bwnhmch.com',
        phone: '+91 94343 22203'
      }
    ],
    gallery: [
      {
        id: 'g-mm-1',
        url: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&q=80&w=800',
        caption: 'Materia Medica Botanical Specimen Display Museum',
        category: 'Museum'
      },
      {
        id: 'g-mm-2',
        url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=800',
        caption: 'Herbarium Sheet Cataloging & Identification Lab',
        category: 'Laboratory'
      }
    ],
    research: [
      'Indigenous Indian Plant Drug Standardization & Proving Verification',
      'Comparative Materia Medica of Nosodes in Treatment of Resistant Skin Conditions',
      'Clinical Verification of Carduus Marianus in Hepatic Disorders'
    ],
    achievements: [
      'Established State-of-the-Art Botanical Specimen Museum with 350+ rare samples',
      'Published textbook: "Comprehensive Clinical Materia Medica for BHMS"'
    ],
    downloads: [
      {
        id: 'd-mm-1',
        title: 'BHMS Materia Medica Course Curriculum & Drug List (1st-4th Year)',
        url: '/documents/bhmch_materia_medica_syllabus.pdf',
        fileType: 'PDF Document',
        fileSize: '2.4 MB',
        uploadDate: '2026-02-01'
      },
      {
        id: 'd-mm-2',
        title: 'Comparative Materia Medica Study Chart & Remedy Profiles',
        url: '/documents/bhmch_materia_medica_study_chart.pdf',
        fileType: 'PDF Document',
        fileSize: '1.2 MB',
        uploadDate: '2026-02-10'
      }
    ],
    laboratories: ['Drug Proving Laboratory', 'Botanical & Mineral Specimen Display Museum'],
    facilities: ['Herbal Garden Access', 'Interactive Drug Proving Database', 'Specimen Cataloging Center']
  },
  {
    id: 'rep',
    code: 'DEPT-REP',
    name: 'Case Taking & Repertory',
    banner: {
      title: 'Department of Case Taking & Repertory',
      subtitle: 'Art and science of case taking, rubric analysis, manual repertorization, and state-of-the-art computer software suites.',
      badge: 'Advanced Computing & Clinical Hub',
      bgImageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200'
    },
    description: 'The Department of Case Taking & Repertory provides thorough grounding in patient interviewing, symptom grading, rubric identification, manual repertorization (Kent, Boenninghausen, Boger), and computer-assisted repertory software (RADAR Opus, Hompath Zomeo, MacRepertory) to accurately identify the simillimum.',
    hod: 'Dr. M. Ghosh, M.D. (Hom.)',
    yearsCovered: 'BHMS 3rd Year & 4th Year',
    methodology: [
      'Classroom lectures on case taking methodology and symptom hierarchy',
      'Systematic symptom classification (General, Particular, Modalities, Mind)',
      'Hands-on training on computer repertory software workstations',
      'OPD/IPD practical case taking with live patient interaction',
      'Rubric flowcharts & decision tree exercises',
      'Interactive departmental case presentation seminars'
    ],
    practical: [
      'OPD/IPD practical case taking & clinical recording',
      'Symptom analysis, evaluation, & hierarchy mapping',
      'Manual repertorization using Kent, Boger, & Boenninghausen repertories',
      'Computerized repertorization using RADAR Opus and Hompath Zomeo',
      'Practical case verification & remedy outcome tracking'
    ],
    teachingAids: [
      'Rubric classification wall charts',
      'Repertorial flow charts & decision trees',
      '20-Workstation computer lab with RADAR Opus & Hompath software',
      'Digital case record archives & worksheets'
    ],
    facultyList: [
      {
        id: 'f-rep-1',
        name: 'Dr. M. Ghosh',
        designation: 'Associate Professor & HOD',
        qualification: 'M.D. (Hom.)',
        specialization: 'Computerized Repertorization & RADAR Opus',
        email: 'mghosh@bwnhmch.com',
        phone: '+91 94343 33301'
      },
      {
        id: 'f-rep-2',
        name: 'Dr. A. Banerjee',
        designation: 'Assistant Professor',
        qualification: 'M.D. (Hom.)',
        specialization: 'Boenninghausen & Boger Synoptic Key',
        email: 'abanerjee@bwnhmch.com',
        phone: '+91 94343 33302'
      }
    ],
    gallery: [
      {
        id: 'g-rep-1',
        url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800',
        caption: '20-Workstation Computer-Assisted Repertory Software Laboratory',
        category: 'Laboratory'
      }
    ],
    research: [
      'Comparative Repertorial Analysis in Pediatric Asthma & Allergic Disorders',
      'Synthesis of Boger Synoptic Key in Rapid OPD Prescribing',
      'Accuracy Metrics of Digital Rubric Search vs Manual Kentian Repertorization'
    ],
    achievements: [
      'Equipped 20 high-end workstations with licensed RADAR Opus and Hompath Zomeo',
      '100% Pass Rate in University Clinical Practical Exams'
    ],
    downloads: [
      {
        id: 'd-rep-1',
        title: 'BHMS Case Taking Format & Rubric Analysis Sheet (Official Printable)',
        url: '/documents/bhmch_repertory_case_taking_format.pdf',
        fileType: 'PDF Document',
        fileSize: '950 KB',
        uploadDate: '2026-01-20'
      }
    ],
    software: ['RADAR Opus (Synthesis Repertory)', 'Hompath Zomeo / Classic', 'MacRepertory & ReferenceWorks'],
    laboratories: ['Computer-Assisted Repertorization Lab'],
    facilities: ['Digital Case Record Archive', '20 Workstation Computer Lab', 'Repertory Software Library']
  },
  {
    id: 'yoga',
    code: 'DEPT-YOGA',
    name: 'Department of Yoga',
    banner: {
      title: 'Department of Yoga & Holistic Lifestyle Medicine',
      subtitle: 'Integration of classical yogic science with homoeopathic clinical healthcare, therapeutic asanas, and pranayama.',
      badge: 'Integrative Health Wing',
      bgImageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=1200'
    },
    description: 'The Department of Yoga at BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL integrates classical yogic philosophy and practices with modern medical sciences to promote physical health, mental wellbeing, stress management, and holistic lifestyle correction.',
    hod: 'Dr. P. K. Samanta, M.D. (Hom.), Dip. Yoga',
    yearsCovered: 'BHMS Curriculum & OPD Lifestyle Clinic',
    methodology: [
      'Classroom lectures on yogic anatomy and physiology',
      'Practical demonstration of Therapeutic Yoga & Asanas',
      'Pranayama, Meditation & Relaxation Techniques',
      'Lifestyle & Dietary Counselling for chronic metabolic disorders',
      'Audiovisual guidance & posture correction workshops'
    ],
    practical: [
      'Daily morning Yoga practice for students and IPD patients',
      'Therapeutic Yoga protocols for Hypertension, Diabetes, and Spondylosis',
      'Pranayama & Shatkarma Kriya clinical sessions',
      'Stress reduction & Guided Meditation workshops'
    ],
    teachingAids: [
      'Anatomical posture charts & Yoga alignment guides',
      'Therapeutic Yoga mats, blocks, & resistance props',
      'Audiovisual smart studio equipment',
      'Demonstration videos & wellness literature'
    ],
    facultyList: [
      {
        id: 'f-yoga-1',
        name: 'Dr. P. K. Samanta',
        designation: 'HOD & Yoga Medical Officer',
        qualification: 'M.D. (Hom.), Diploma in Yoga Science',
        specialization: 'Therapeutic Yoga & Lifestyle Medicine',
        email: 'pksamanta@bwnhmch.com',
        phone: '+91 94343 44401'
      }
    ],
    gallery: [
      {
        id: 'g-yoga-1',
        url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
        caption: 'State-of-the-Art Yoga & Meditation Practice Hall',
        category: 'Practice Hall'
      }
    ],
    research: [
      'Synergistic Effect of Yoga & Homoeopathy in Essential Hypertension',
      'Pranayama Kriyas in Managing Chronic Respiratory Allergic Conditions'
    ],
    achievements: [
      'Organized International Yoga Day Celebration with over 600 participants',
      'Operates dedicated Yoga OPD serving 40+ patients daily'
    ],
    downloads: [
      {
        id: 'd-yoga-1',
        title: 'Therapeutic Yoga Protocol Chart for Common Lifestyle Disorders',
        url: '/documents/bhmch_yoga_protocol_chart.pdf',
        fileType: 'PDF Document',
        fileSize: '1.5 MB',
        uploadDate: '2026-02-15'
      }
    ],
    laboratories: ['Yoga & Meditation Practice Hall'],
    facilities: ['Therapeutic Yoga Mats & Props', 'Audio-Visual Meditation Studio', 'Lifestyle Counselling Cell']
  },
  {
    id: 'pharm',
    code: 'DEPT-PHARM',
    name: 'Homoeopathic Pharmacy',
    banner: {
      title: 'Department of Homoeopathic Pharmacy',
      subtitle: 'Pharmacognosy, potentization, vehicle testing, drug standardization, and HPI pharmacopoeial compliance.',
      badge: 'NCH Certified Lab Facility',
      bgImageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=1200'
    },
    description: 'The Department of Homoeopathic Pharmacy provides systematic training in pharmacognosy, vehicle preparation, scale of potentization (Centesimal, Decimal, 50-Millesimal), mother tincture extraction, quality assurance, and compliance with Homoeopathic Pharmacopoeia of India (HPI).',
    hod: 'Dr. R. Bannerjee, M.D. (Hom.)',
    yearsCovered: 'BHMS 1st Year',
    methodology: [
      'Classroom lectures on pharmacopoeial principles and legal requirements',
      'Laboratory practical sessions on trituration and succussion',
      'Industrial exposure visits to GMP-certified Homoeopathic manufacturing units',
      'Pharmacognosy herbarium identification & standardization drills'
    ],
    practical: [
      'Trituration (Decimal & Centesimal scales) and succussion practicals',
      'Purity testing of vehicles (Alcohol, Sugar of Milk, Globules)',
      'Mother tincture preparation by maceration & percolation',
      'Prescription writing, abbreviation decoding, and dispensing techniques'
    ],
    teachingAids: [
      'Pharmacognosy herbarium display & botanical charts',
      'Extraction & Soxhlet distillation apparatus',
      'Multimedia slides & drug standardization manuals',
      'Mortar-pestle workstations & precision digital balances'
    ],
    facultyList: [
      {
        id: 'f-pharm-1',
        name: 'Dr. R. Bannerjee',
        designation: 'Associate Professor & HOD',
        qualification: 'M.D. (Hom.)',
        specialization: 'Homoeopathic Pharmacopoeia & Quality Control',
        email: 'rbanerjee@bwnhmch.com',
        phone: '+91 94343 55501'
      }
    ],
    gallery: [
      {
        id: 'g-pharm-1',
        url: 'https://images.unsplash.com/photo-1579165466741-7f35e4755660?auto=format&fit=crop&q=80&w=800',
        caption: 'Pharmacy Practical Laboratory & Trituration Workstations',
        category: 'Laboratory'
      }
    ],
    research: [
      'Quality Control Metrics for Mother Tinctures using Spectrophotometry',
      'Standardization & Shelf-Life Assessment of Bio-Chemic Remedies'
    ],
    achievements: [
      'GMP Compliant Student Laboratory recognized by State Health Department',
      'Annual Industrial Visit Partnership with leading GMP Manufacturers'
    ],
    downloads: [
      {
        id: 'd-pharm-1',
        title: 'BHMS Homoeopathic Pharmacy Practical Manual & Lab Logbook',
        url: '/documents/bhmch_pharmacy_practical_manual.pdf',
        fileType: 'PDF Document',
        fileSize: '3.1 MB',
        uploadDate: '2026-01-25'
      }
    ],
    laboratories: ['HPLC & Spectrophotometry Lab', 'Vehicle Preparation & Trituration Hall'],
    facilities: ['Pharmacognosy Herbarium', 'Distillation & Extraction Apparatus']
  },
  {
    id: 'anat',
    code: 'DEPT-ANAT',
    name: 'Anatomy',
    banner: {
      title: 'Department of Anatomy',
      subtitle: 'Gross human anatomy dissection, microscopic histology, embryology, and neuroanatomy education.',
      badge: 'Foundational Medical Science',
      bgImageUrl: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=1200'
    },
    description: 'The Department of Anatomy lays the foundational structural understanding of human body systems through cadaveric dissection, microscopic histology, surface marking, and radiological anatomy.',
    hod: 'Dr. P. Das, M.S. (Anatomy)',
    yearsCovered: 'BHMS 1st Year',
    methodology: [
      'Classroom lectures with 3D anatomical projections',
      'Cadaveric dissection classes in specialized dissection hall',
      'Histology practical sessions with high-power binocular microscopes',
      'Anatomical museum demonstration sessions'
    ],
    practical: [
      'Full human cadaveric dissection across all anatomical regions',
      'Microscopic histology slide identification & drawing',
      'Surface bone marking & osteology demonstration',
      'Radiological image analysis (X-ray, CT, MRI scans)'
    ],
    teachingAids: [
      'Human cadaveric dissection tables with cold storage unit',
      '3D life-size anatomical models & articulated skeletons',
      'Histology slides & binocular student microscopes',
      'X-ray illuminator viewing boxes'
    ],
    facultyList: [
      {
        id: 'f-anat-1',
        name: 'Dr. P. Das',
        designation: 'Professor & HOD',
        qualification: 'M.S. (Anatomy)',
        specialization: 'Gross Dissection & Neuroanatomy',
        email: 'pdas@bwnhmch.com',
        phone: '+91 94343 66601'
      }
    ],
    gallery: [
      {
        id: 'g-anat-1',
        url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
        caption: 'Modern Human Cadaveric Dissection Hall',
        category: 'Dissection Hall'
      }
    ],
    research: [
      'Clinical Neuroanatomy Correlations in Cranial Nerve Disorders',
      'Morphometric Analysis of Anatomical Variants in Eastern Indian Population'
    ],
    achievements: [
      'State-of-the-Art Mortuary and Cold Storage Unit with 100% Safety Clearance',
      'Anatomy Museum housing 250+ preserved organ specimens'
    ],
    downloads: [
      {
        id: 'd-anat-1',
        title: 'Anatomy Osteology & Dissection Guide for BHMS 1st Year',
        url: '/documents/bhmch_anatomy_dissection_guide.pdf',
        fileType: 'PDF Document',
        fileSize: '4.2 MB',
        uploadDate: '2026-01-10'
      }
    ],
    laboratories: ['Human Cadaveric Dissection Hall', 'Histology Microscopy Lab', 'Anatomy Embryology Museum'],
    facilities: ['3D Anatomical Models Gallery', 'Cold Storage Mortuary Unit']
  },
  {
    id: 'phys',
    code: 'DEPT-PHYS',
    name: 'Physiology & Biochemistry',
    banner: {
      title: 'Department of Physiology & Biochemistry',
      subtitle: 'Human bodily functions, hematology, cardiovascular dynamics, spirometry, and metabolic biochemistry.',
      badge: 'Foundational Clinical Science',
      bgImageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=1200'
    },
    description: 'The Department of Physiology & Biochemistry provides comprehensive understanding of normal human functional mechanisms, homeostatic balance, hematology, cardiovascular dynamics, spirometry, and clinical biochemistry.',
    hod: 'Dr. S. Chatterjee, M.D. (Physiology)',
    yearsCovered: 'BHMS 1st Year',
    methodology: [
      'Classroom lectures on human organ systems & homeostatic feedback loops',
      'Hematology laboratory practical sessions',
      'Biochemical analysis demonstrations and qualitative tests',
      'Interactive group discussions & physiological case correlation'
    ],
    practical: [
      'Blood grouping, hemoglobin estimation & ESR determination',
      'RBC & WBC total counting using Hemocytometer',
      'ECG recording, interpretation & Spirometry lung function tests',
      'Biochemical qualitative tests for carbohydrates, proteins & enzymes'
    ],
    teachingAids: [
      'Hematology microscopes & Hemocytometers',
      'Spirometers & 12-lead ECG machines',
      'Biochemical reaction charts & metabolic pathways displays',
      'Multimedia slide projection system'
    ],
    facultyList: [
      {
        id: 'f-phys-1',
        name: 'Dr. S. Chatterjee',
        designation: 'Professor & HOD',
        qualification: 'M.D. (Physiology)',
        specialization: 'Cardiovascular Physiology & Hematology',
        email: 'schatterjee@bwnhmch.com',
        phone: '+91 94343 77701'
      }
    ],
    gallery: [
      {
        id: 'g-phys-1',
        url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800',
        caption: 'Hematology & Clinical Biochemistry Student Laboratory',
        category: 'Laboratory'
      }
    ],
    research: [
      'Autonomic Nervous System Function Response in High Potency Homoeopathic Provings',
      'Erythrocyte Sedimentation Rate Variations in Chronic Allergic Rhinitis Patients'
    ],
    achievements: [
      'Fully functional 60-microscope Hematology Workstation Laboratory',
      'Regular Spirometry & ECG Screening Camps in Hospital OPD'
    ],
    downloads: [
      {
        id: 'd-phys-1',
        title: 'Physiology & Biochemistry Practical Lab Manual (BHMS 1st Year)',
        url: '/documents/bhmch_physiology_lab_manual.pdf',
        fileType: 'PDF Document',
        fileSize: '2.8 MB',
        uploadDate: '2026-01-18'
      }
    ],
    laboratories: ['Hematology Practical Lab', 'Clinical Biochemistry Analysis Room'],
    facilities: ['ECG & Spirometry Testing Workstations', 'Microscope Bay for 60 Students']
  },
  {
    id: 'path',
    code: 'DEPT-PATH',
    name: 'Pathology & Microbiology',
    banner: {
      title: 'Department of Pathology & Microbiology',
      subtitle: 'Etiopathology, clinical microbiology, parasitology, hematology, histopathology, and diagnostic lab procedures.',
      badge: 'Diagnostic & Research Wing',
      bgImageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=1200'
    },
    description: 'The Department of Pathology & Microbiology educates students on disease etiopathology, cellular tissue reactions, bacterial and viral cultures, parasitology, diagnostic hematology, and clinical lab procedures.',
    hod: 'Dr. D. Sen, M.D. (Pathology)',
    yearsCovered: 'BHMS 2nd Year',
    methodology: [
      'Classroom lectures on general pathology and systemic tissue pathology',
      'Microscopic slide demonstrations of disease tissues',
      'Bacterial culture & Gram/AFB staining practicals',
      'Pathological museum jar specimen studies'
    ],
    practical: [
      'Urine routine & microscopic examination',
      'Staining techniques (Gram staining, Acid Fast AFB staining)',
      'Tissue specimen identification & gross lesion examination',
      'Diagnostic hematology & blood grouping tests'
    ],
    teachingAids: [
      'Binocular student microscopes & oil immersion lenses',
      'Autoclaves, hot air ovens, & culture incubation units',
      'Pathological jar specimens & mounted slide collections',
      'Diagnostic culture plates & media preparation bays'
    ],
    facultyList: [
      {
        id: 'f-path-1',
        name: 'Dr. D. Sen',
        designation: 'Professor & HOD',
        qualification: 'M.D. (Pathology)',
        specialization: 'Clinical Pathology & Histopathology',
        email: 'dsen@bwnhmch.com',
        phone: '+91 94343 88801'
      }
    ],
    gallery: [
      {
        id: 'g-path-1',
        url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=800',
        caption: 'Microbiology Culture & Diagnostic Pathology Bay',
        category: 'Laboratory'
      }
    ],
    research: [
      'In-vitro Antimicrobial Susceptibility Testing under High Homoeopathic Dilutions',
      'In-vitro Inhibitory Effects of Syzygium Jambolanum on Bacterial Cultures'
    ],
    achievements: [
      'Provides diagnostic laboratory support to 200+ hospital patients daily',
      'Published 8 research papers in Pathological Microbiology journals'
    ],
    downloads: [
      {
        id: 'd-path-1',
        title: 'BHMS Pathology & Microbiology Practical Staining Guide',
        url: '/documents/bhmch_pathology_staining_guide.pdf',
        fileType: 'PDF Document',
        fileSize: '3.5 MB',
        uploadDate: '2026-02-05'
      }
    ],
    laboratories: ['Microbiology Culture Lab', 'Clinical Diagnostic Hematology Lab'],
    facilities: ['Autoclave & Incubation Units', 'Blood Grouping & Serology Bay']
  },
  {
    id: 'fmt',
    code: 'DEPT-FMT',
    name: 'Forensic Medicine & Toxicology',
    banner: {
      title: 'Department of Forensic Medicine & Toxicology',
      subtitle: 'Medical jurisprudence, toxicology identification, forensic post-mortem protocols, and medico-legal ethics.',
      badge: 'Medico-Legal Academic Wing',
      bgImageUrl: 'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?auto=format&fit=crop&q=80&w=1200'
    },
    description: 'The Department of FMT trains medical students in legal medicine, medical ethics, forensic pathology, toxicology identification, age estimation, and court witness procedures.',
    hod: 'Dr. K. Nandi, M.D. (FMT)',
    yearsCovered: 'BHMS 2nd Year',
    methodology: [
      'Classroom lectures on medical jurisprudence & consumer protection acts',
      'Toxicology museum demonstrations of plant and chemical poisons',
      'Moot courtroom trial simulations & medico-legal drafting',
      'Post-mortem reporting & injury classification studies'
    ],
    practical: [
      'Poisons, venom & weapon specimen identification',
      'Forensic report drafting & medical certificate issuing protocols',
      'Age estimation through x-ray & ossification center analysis',
      'Courtroom testimony simulation drills'
    ],
    teachingAids: [
      'Toxicology specimens gallery with 150+ genuine poison samples',
      'Weapons & injury models museum',
      'Medical jurisprudence flow charts & legal codes',
      'Court trial simulation hall'
    ],
    facultyList: [
      {
        id: 'f-fmt-1',
        name: 'Dr. K. Nandi',
        designation: 'Associate Professor & HOD',
        qualification: 'M.D. (FMT)',
        specialization: 'Medical Jurisprudence & Clinical Toxicology',
        email: 'knandi@bwnhmch.com',
        phone: '+91 94343 99901'
      }
    ],
    gallery: [
      {
        id: 'g-fmt-1',
        url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800',
        caption: 'Toxicology & Medico-Legal Specimen Display Museum',
        category: 'Museum'
      }
    ],
    research: [
      'Heavy Metal Toxicities & Homoeopathic Antidote Protocols',
      'Legal Documentation Standards in AYUSH Hospital Practice'
    ],
    achievements: [
      'Established Moot Courtroom Facility for student medico-legal training',
      'Conducted Medico-Legal Awareness Workshops for doctors'
    ],
    downloads: [
      {
        id: 'd-fmt-1',
        title: 'Forensic Medicine & Medico-Legal Certificate Drafting Format',
        url: '/documents/bhmch_fmt_drafting_format.pdf',
        fileType: 'PDF Document',
        fileSize: '1.1 MB',
        uploadDate: '2026-01-28'
      }
    ],
    laboratories: ['Toxicology Specimen & Weapon Museum'],
    facilities: ['Poisons & Venom Identification Displays', 'Court Trial Simulation Setup']
  },
  {
    id: 'med',
    code: 'DEPT-MED',
    name: 'Practice of Medicine',
    banner: {
      title: 'Department of Practice of Medicine',
      subtitle: 'Internal medicine, cardiology, neurology, gastroenterology, and targeted Homoeopathic therapeutics.',
      badge: 'Major Clinical Department',
      bgImageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200'
    },
    description: 'The Department of Practice of Medicine delivers comprehensive clinical instruction in systemic disorders (cardiovascular, respiratory, gastrointestinal, neurological) combined with targeted homoeopathic therapeutic protocols.',
    hod: 'Dr. T. K. Maiti, M.D. (Hom.)',
    yearsCovered: 'BHMS 3rd Year & 4th Year',
    methodology: [
      'Bedside clinical teaching in hospital inpatient wards',
      'OPD consultation demonstrations & real-time prescribing',
      'Systemic disease seminars & differential diagnosis workshops',
      'Therapeutic prescribing clinics & long-term follow-up studies'
    ],
    practical: [
      'Systemic physical examination (Cardiovascular, Respiratory, CNS, Abdomen)',
      'Clinical diagnosis formulation & investigation order drafting',
      'Prescription of constitutional homoeopathic therapeutics',
      'Inpatient ward care rounds & emergency management'
    ],
    teachingAids: [
      'Diagnostic equipment (ECG, Stethoscopes, BP Apparatus, Ophthalmoscope)',
      'Medical system chart displays & clinical algorithms',
      'Audio-visual case study projections',
      'Clinical protocol manuals & therapeutic guidelines'
    ],
    facultyList: [
      {
        id: 'f-med-1',
        name: 'Dr. T. K. Maiti',
        designation: 'Professor & HOD',
        qualification: 'M.D. (Hom.)',
        specialization: 'Internal Medicine & Gastrointestinal Disorders',
        email: 'tkmaiti@bwnhmch.com',
        phone: '+91 94343 10001'
      },
      {
        id: 'f-med-2',
        name: 'Dr. S. K. Pal',
        designation: 'Associate Professor',
        qualification: 'M.D. (Hom.)',
        specialization: 'Cardiology & Respiratory Medicine',
        email: 'skpal@bwnhmch.com',
        phone: '+91 94343 10002'
      }
    ],
    gallery: [
      {
        id: 'g-med-1',
        url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
        caption: 'IPD Clinical Ward Bedside Teaching & Patient Rounds',
        category: 'Clinical Ward'
      }
    ],
    research: [
      'Homoeopathic Management of Non-Alcoholic Fatty Liver Disease (NAFLD)',
      'Long-Term Observational Study of Rhus Tox in Osteoarthritis'
    ],
    achievements: [
      'Manages 150+ OPD consultations daily across specialized clinical units',
      'Conducted 12 Rural Health Camps providing free medical care'
    ],
    downloads: [
      {
        id: 'd-med-1',
        title: 'Clinical Case Examination Record & Physical Diagnosis Worksheet',
        url: '/documents/bhmch_medicine_clinical_worksheet.pdf',
        fileType: 'PDF Document',
        fileSize: '2.1 MB',
        uploadDate: '2026-02-12'
      }
    ],
    laboratories: ['Clinical OPD Examination Bays', 'IPD Ward Demonstration Rounds'],
    facilities: ['Defibrillator & ECG Diagnostics', 'Nebulization & Oxygen Support Units']
  },
  {
    id: 'surg',
    code: 'DEPT-SURG',
    name: 'Surgery & Homoeopathic Therapeutics',
    banner: {
      title: 'Department of Surgery & Homoeopathic Therapeutics',
      subtitle: 'General surgical principles, wound care, operative procedures, and pre/post-operative homoeopathic management.',
      badge: 'Surgical & Operative Wing',
      bgImageUrl: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=1200'
    },
    description: 'The Department of Surgery instructs students in general surgical principles, diagnostic imaging, minor operative techniques, wound management, and pre/post-surgical homoeopathic therapeutics.',
    hod: 'Dr. S. K. Mitra, M.S. (Surgery)',
    yearsCovered: 'BHMS 3rd Year & 4th Year',
    methodology: [
      'Classroom lectures on general surgery & surgical pathology',
      'Minor OT procedure live demonstrations',
      'Surgical dressing & suturing hands-on workshops',
      'Clinical ward rounds & post-operative care monitoring'
    ],
    practical: [
      'Wound dressing, bandaging, & aseptic suturing practice',
      'Pre & post-operative patient management protocols',
      'Surgical instrument identification & sterilization handling',
      'Emergency trauma initial management & triage'
    ],
    teachingAids: [
      'Surgical instrument gallery with 100+ precision instruments',
      'Suture practice pads, mannequins & wound simulation models',
      'Autoclave sterilization equipment',
      'Surgical radiology viewboxes'
    ],
    facultyList: [
      {
        id: 'f-surg-1',
        name: 'Dr. S. K. Mitra',
        designation: 'Professor & HOD',
        qualification: 'M.S. (Surgery)',
        specialization: 'General Surgery & Minor OT Procedures',
        email: 'skmitra@bwnhmch.com',
        phone: '+91 94343 20001'
      }
    ],
    gallery: [
      {
        id: 'g-surg-1',
        url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800',
        caption: 'Minor Operation Theatre (OT) & Suture Practice Bay',
        category: 'Operation Theatre'
      }
    ],
    research: [
      'Homoeopathic Management of Post-Surgical Healing and Anal Fissures',
      'Role of Silicea in Chronic Fistula-in-Ano Management'
    ],
    achievements: [
      'Fully equipped Minor OT performing 30+ minor surgical procedures monthly',
      'Specialized Wound Care Unit integrated with Homoeopathic healing'
    ],
    downloads: [
      {
        id: 'd-surg-1',
        title: 'Surgical Instrument Identification Manual & Suture Guide',
        url: '/documents/bhmch_surgery_suture_guide.pdf',
        fileType: 'PDF Document',
        fileSize: '3.0 MB',
        uploadDate: '2026-01-30'
      }
    ],
    laboratories: ['Minor OT & Suture Practice Bay'],
    facilities: ['Surgical Instrument Gallery', 'Sterilization Autoclave Suite']
  },
  {
    id: 'gyn',
    code: 'DEPT-GYN',
    name: 'Obstetrics & Gynaecology',
    banner: {
      title: 'Department of Obstetrics & Gynaecology',
      subtitle: 'Antenatal care, labor management, gynaecological health, and Homoeopathic therapeutics in female care.',
      badge: 'Maternal & Women Health Wing',
      bgImageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1200'
    },
    description: 'The Department of Obstetrics & Gynaecology provides specialized education in female reproductive health, antenatal care, delivery room management, and homoeopathic gynaecological therapeutics.',
    hod: 'Dr. N. Mukhopadhyay, M.D. (O&G)',
    yearsCovered: 'BHMS 3rd Year & 4th Year',
    methodology: [
      'Clinical ward teaching in labor and maternity wards',
      'Antenatal clinic demonstrations and fetal heart sound monitoring',
      'Pelvic model demonstrations & mechanism of labor exercises',
      'Therapeutic case discussions for PCOS, dysmenorrhea & infertility'
    ],
    practical: [
      'Antenatal palpation & fetal heart sound listening with Doppler',
      'Labor progress monitoring & partograph plotting',
      'Gynecological examination techniques & speculum insertion',
      'Constitutional homoeopathic prescribing in female disorders'
    ],
    teachingAids: [
      'Pelvic & anatomical fetal birth simulation models',
      'Fetal Doppler & ultrasound diagnostic units',
      'Gynecological instrument displays',
      'Maternal health & antenatal charts'
    ],
    facultyList: [
      {
        id: 'f-gyn-1',
        name: 'Dr. N. Mukhopadhyay',
        designation: 'Professor & HOD',
        qualification: 'M.D. (O&G)',
        specialization: 'Obstetrics & Gynaecological Therapeutics',
        email: 'nmukhopadhyay@bwnhmch.com',
        phone: '+91 94343 30001'
      }
    ],
    gallery: [
      {
        id: 'g-gyn-1',
        url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
        caption: 'Antenatal Care Clinic & Labor Monitoring Suite',
        category: 'Clinical Ward'
      }
    ],
    research: [
      'Homoeopathic Therapeutics in Polycystic Ovarian Syndrome (PCOS)',
      'Clinical Efficacy of Pulsatilla Nigricans in Primary Dysmenorrhea'
    ],
    achievements: [
      'Operates dedicated Antenatal OPD providing free routine checkups',
      'Conducted 5 Women Health Awareness Seminars in Purba Bardhaman'
    ],
    downloads: [
      {
        id: 'd-gyn-1',
        title: 'Antenatal Care Examination Protocol & Partograph Chart',
        url: '/documents/bhmch_gynaecology_partograph_chart.pdf',
        fileType: 'PDF Document',
        fileSize: '1.9 MB',
        uploadDate: '2026-02-08'
      }
    ],
    laboratories: ['Labor Room & Antenatal Care Bay'],
    facilities: ['Foetal Doppler & Ultrasound Suites', 'Pelvic Model Demonstration Hall']
  },
  {
    id: 'cm',
    code: 'DEPT-CM',
    name: 'Community Medicine',
    banner: {
      title: 'Department of Community Medicine',
      subtitle: 'Epidemiology, public health administration, preventive medicine, maternal & child health, and health camps.',
      badge: 'Public Health & Rural Wing',
      bgImageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1200'
    },
    description: 'The Department of Community Medicine trains students in public health management, preventive medicine, epidemiological survey methodologies, national health programs, and rural health administration.',
    hod: 'Dr. B. Biswas, M.D. (Community Medicine)',
    yearsCovered: 'BHMS 3rd Year & 4th Year',
    methodology: [
      'Classroom lectures on epidemiology, biostatistics & national health policies',
      'Field visits & rural health demographic surveys',
      'Health camp organization & village sanitation awareness',
      'Epidemiological statistical data exercises'
    ],
    practical: [
      'Rural health survey & census demographic data collection',
      'Water quality, chlorination & sanitation testing',
      'Immunization schedule tracking & maternal child health tracking',
      'Health education presentations in rural villages'
    ],
    teachingAids: [
      'Public health models & epidemiological charts',
      'Statistical analysis software packages',
      'Mobile health camp kit & water testing apparatus',
      'Hygiene, nutrition & sanitation displays'
    ],
    facultyList: [
      {
        id: 'f-cm-1',
        name: 'Dr. B. Biswas',
        designation: 'Associate Professor & HOD',
        qualification: 'M.D. (Community Medicine)',
        specialization: 'Epidemiology & Rural Healthcare',
        email: 'bbiswas@bwnhmch.com',
        phone: '+91 94343 40001'
      }
    ],
    gallery: [
      {
        id: 'g-cm-1',
        url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
        caption: 'Rural Health Camp & Village Health Survey Unit',
        category: 'Field Visit'
      }
    ],
    research: [
      'Vector-Borne Disease Prevention Strategies in Rural Bardhaman',
      'Health Awareness & Homoeopathic Coverage in Rural Purba Bardhaman'
    ],
    achievements: [
      'Adoption of 3 local villages for routine health monitoring',
      'Organized 20+ free health awareness camps annually'
    ],
    downloads: [
      {
        id: 'd-cm-1',
        title: 'Community Health Survey Questionnaire & Demographic Logbook',
        url: '/documents/bhmch_community_medicine_questionnaire.pdf',
        fileType: 'PDF Document',
        fileSize: '1.4 MB',
        uploadDate: '2026-01-14'
      }
    ],
    laboratories: ['Public Health & Hygiene Museum'],
    facilities: ['Mobile Rural Health Camp Unit', 'Epidemiological Statistical Lab']
  }
];

export const departmentCmsService = {
  getDepartments: (): DepartmentCMSData[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading department CMS data from storage:', e);
    }
    // Fallback to initial default dataset
    departmentCmsService.saveAll(INITIAL_DEPARTMENT_CMS_DATA);
    return INITIAL_DEPARTMENT_CMS_DATA;
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
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
