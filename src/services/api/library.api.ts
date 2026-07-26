import { apiClient } from './apiClient';
import { ApiResponse, LibraryBook } from '../../types/index';

export const mockLibraryBooks: LibraryBook[] = [
  {
    id: 'lib-101',
    title: 'Organon of Medicine (6th Edition with Commentary)',
    author: 'Dr. Samuel Hahnemann',
    publisher: 'B. Jain Publishers',
    category: 'Organon & Philosophy',
    department: 'Organon of Medicine',
    semester: '1st BHMS',
    subject: 'Organon of Medicine',
    year: '2024-2025',
    isbn: '978-8131903215',
    accessionNo: 'BHMC-LIB-0042',
    type: 'BOOK',
    fileFormat: 'PDF',
    availableCopies: 12,
    isBookmarked: true,
    readingProgress: 68,
    coverImageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80',
    streamUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    uploadedBy: 'Dr. R. N. Mukherjee',
    uploadedByUserId: 'usr-vp-001',
    uploadedRole: 'Vice Principal',
    uploadedAt: '2026-06-15',
    viewsCount: 342,
    downloadsCount: 189,
    allowDownload: true,
    description: 'Complete 6th edition of Hahnemannian Organon with footnoted commentary and miasmatic breakdown.',
    fileSize: '14.2 MB',
    pageCount: 384,
  },
  {
    id: 'lib-102',
    title: 'Lectures on Homoeopathic Materia Medica Notes & Comparative Charts',
    author: 'Prof. (Dr.) S. K. Banerjea',
    publisher: 'BHMC Academic Press',
    category: 'Materia Medica',
    department: 'Materia Medica',
    semester: '2nd BHMS',
    subject: 'Materia Medica',
    year: '2025-2026',
    isbn: '978-8131900146',
    accessionNo: 'BHMC-LIB-0189',
    type: 'NOTES',
    fileFormat: 'PDF',
    availableCopies: 8,
    isBookmarked: fontStateCheck(false),
    readingProgress: 35,
    coverImageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=300&q=80',
    streamUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    uploadedBy: 'Prof. (Dr.) S. K. Banerjea',
    uploadedByUserId: 'usr-fac-001',
    uploadedRole: 'HOD Materia Medica',
    uploadedAt: '2026-05-20',
    viewsCount: 512,
    downloadsCount: 290,
    allowDownload: true,
    description: 'In-depth notes on Polycrest remedies with keynote comparative symptom tables.',
    fileSize: '8.6 MB',
    pageCount: 142,
  },
  {
    id: 'lib-103',
    title: 'Kent Repertory Methodologies & Repertorization Worksheets',
    author: 'Dr. Debabrata Sen',
    publisher: 'BHMC Central Press',
    category: 'Repertory',
    department: 'Repertory',
    semester: '3rd BHMS',
    subject: 'Repertory',
    year: '2025-2026',
    isbn: '978-8131902003',
    accessionNo: 'BHMC-LIB-0312',
    type: 'PRESENTATION',
    fileFormat: 'PPTX',
    availableCopies: 15,
    isBookmarked: true,
    readingProgress: 90,
    coverImageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=300&q=80',
    streamUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    uploadedBy: 'Dr. Debabrata Sen',
    uploadedByUserId: 'usr-fac-009',
    uploadedRole: 'Associate Professor',
    uploadedAt: '2026-04-10',
    viewsCount: 215,
    downloadsCount: 98,
    allowDownload: true,
    description: 'Slide presentation on cross-referencing rubrics, gradation rules, and computer-aided repertorization.',
    fileSize: '22.4 MB',
    pageCount: 65,
  },
  {
    id: 'lib-104',
    title: 'Homoeopathic Pharmacopoeia of India (HPI Vol I - X Official Guidelines)',
    author: 'Govt. of India Ministry of AYUSH',
    publisher: 'Controller of Publications',
    category: 'Pharmacy',
    department: 'Homoeopathic Pharmacy',
    semester: '1st BHMS',
    subject: 'Homoeopathic Pharmacy',
    year: '2024-2025',
    isbn: '978-8187890123',
    accessionNo: 'BHMC-LIB-0890',
    type: 'BOOK',
    fileFormat: 'PDF',
    availableCopies: 5,
    isBookmarked: false,
    coverImageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=300&q=80',
    streamUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    uploadedBy: 'Dr. Susmita Chatterjee',
    uploadedByUserId: 'usr-p-001',
    uploadedRole: 'Principal',
    uploadedAt: '2026-03-01',
    viewsCount: 680,
    downloadsCount: 420,
    allowDownload: true,
    description: 'Official HPI standards for drug preparation, potentization scales, and quality control tests.',
    fileSize: '45.0 MB',
    pageCount: 512,
  },
  {
    id: 'lib-105',
    title: 'Indian Journal of Research in Homoeopathy (IJRH Special Edition)',
    author: 'Central Council for Research in Homoeopathy (CCRH)',
    publisher: 'Wolters Kluwer',
    category: 'Research Paper',
    department: 'Practice of Medicine',
    semester: '4th BHMS',
    subject: 'Practice of Medicine',
    year: '2025-2026',
    isbn: '0974-7168',
    accessionNo: 'BHMC-JRN-042',
    type: 'RESEARCH_PAPER',
    fileFormat: 'PDF',
    availableCopies: 20,
    isBookmarked: false,
    readingProgress: 10,
    coverImageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=300&q=80',
    streamUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    uploadedBy: 'Dr. R. N. Mukherjee',
    uploadedByUserId: 'usr-vp-001',
    uploadedRole: 'Vice Principal',
    uploadedAt: '2026-07-01',
    viewsCount: 190,
    downloadsCount: 88,
    allowDownload: true,
    description: 'Peer-reviewed clinical trial papers on high-potency homoeopathic remedies in chronic skin conditions.',
    fileSize: '11.8 MB',
    pageCount: 96,
  },
  {
    id: 'lib-106',
    title: 'Clinical Case Records & Miasmatic Diagnosis Protocol Manual',
    author: 'Dr. P. S. Orang',
    publisher: 'Academic Press',
    category: 'Digital Notes',
    department: 'Practice of Medicine',
    semester: '3rd BHMS',
    subject: 'Practice of Medicine',
    year: '2025-2026',
    isbn: 'N/A',
    accessionNo: 'BHMC-DIG-008',
    type: 'DOCUMENT',
    fileFormat: 'DOCX',
    availableCopies: 99,
    isBookmarked: true,
    readingProgress: 100,
    coverImageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=300&q=80',
    streamUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    uploadedBy: 'Dr. P. S. Orang',
    uploadedByUserId: 'usr-fac-012',
    uploadedRole: 'Lecturer',
    uploadedAt: '2026-06-28',
    viewsCount: 295,
    downloadsCount: 142,
    allowDownload: true,
    description: 'Structured case taking template, Psora/Sycosis/Syphilis grading framework, and OPD record sheets.',
    fileSize: '4.2 MB',
    pageCount: 48,
  },
  {
    id: 'lib-107',
    title: 'Human Anatomy Dissection Guide & Topographical Diagrams',
    author: 'Dr. Ananya Roy',
    publisher: 'BHMC Anatomy Dept',
    category: 'Anatomy',
    department: 'Anatomy',
    semester: '1st BHMS',
    subject: 'Human Anatomy',
    year: '2024-2025',
    isbn: '978-9388902724',
    accessionNo: 'BHMC-DIG-014',
    type: 'NOTES',
    fileFormat: 'PDF',
    availableCopies: 50,
    isBookmarked: false,
    coverImageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=300&q=80',
    streamUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    uploadedBy: 'Dr. Ananya Roy',
    uploadedByUserId: 'usr-fac-015',
    uploadedRole: 'Demonstrator',
    uploadedAt: '2026-02-14',
    viewsCount: 410,
    downloadsCount: 210,
    allowDownload: true,
    description: 'Illustrated guide covering head, neck, brain & neuroanatomy structures with clinical correlations.',
    fileSize: '18.5 MB',
    pageCount: 110,
  }
];

function fontStateCheck(val: boolean): boolean {
  return val;
}

export const libraryApi = {
  getBooks: async (params?: Record<string, any>): Promise<ApiResponse<LibraryBook[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<LibraryBook[]>>('/library/books', { params });
      return response.data;
    } catch {
      let filtered = [...mockLibraryBooks];

      if (params) {
        if (params.search) {
          const q = params.search.toLowerCase();
          filtered = filtered.filter(
            (b) =>
              b.title.toLowerCase().includes(q) ||
              b.author.toLowerCase().includes(q) ||
              b.category.toLowerCase().includes(q) ||
              b.accessionNo.toLowerCase().includes(q) ||
              (b.description && b.description.toLowerCase().includes(q))
          );
        }
        if (params.department && params.department !== 'ALL') {
          filtered = filtered.filter((b) => b.department === params.department || b.category === params.department);
        }
        if (params.semester && params.semester !== 'ALL') {
          filtered = filtered.filter((b) => b.semester === params.semester);
        }
        if (params.subject && params.subject !== 'ALL') {
          filtered = filtered.filter((b) => b.subject === params.subject);
        }
        if (params.year && params.year !== 'ALL') {
          filtered = filtered.filter((b) => b.year === params.year);
        }
        if (params.type && params.type !== 'ALL') {
          filtered = filtered.filter((b) => b.type === params.type);
        }
      }

      return { success: true, message: 'Digital resources fetched', data: filtered, timestamp: new Date().toISOString() };
    }
  },

  getJournals: async (): Promise<ApiResponse<LibraryBook[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<LibraryBook[]>>('/library/journals');
      return response.data;
    } catch {
      const journals = mockLibraryBooks.filter((b) => b.type === 'JOURNAL' || b.type === 'RESEARCH_PAPER');
      return { success: true, message: 'Journals fetched', data: journals, timestamp: new Date().toISOString() };
    }
  },

  toggleBookmark: async (bookId: string): Promise<ApiResponse<boolean>> => {
    try {
      const response = await apiClient.post<ApiResponse<boolean>>(`/library/books/${bookId}/bookmark`);
      return response.data;
    } catch {
      const book = mockLibraryBooks.find((b) => b.id === bookId);
      if (book) book.isBookmarked = !book.isBookmarked;
      return { success: true, message: 'Bookmark state toggled', data: book?.isBookmarked || false, timestamp: new Date().toISOString() };
    }
  },

  addResource: async (resourceData: Partial<LibraryBook>): Promise<ApiResponse<LibraryBook>> => {
    try {
      const response = await apiClient.post<ApiResponse<LibraryBook>>('/library/books', resourceData);
      return response.data;
    } catch {
      const newBook: LibraryBook = {
        id: `lib-${Date.now()}`,
        title: resourceData.title || 'Untitled Digital Document',
        author: resourceData.author || 'Faculty Member',
        publisher: resourceData.publisher || 'BHMC Medical Library',
        category: resourceData.category || 'General',
        department: resourceData.department || 'Organon of Medicine',
        semester: resourceData.semester || '1st BHMS',
        subject: resourceData.subject || 'Organon of Medicine',
        year: resourceData.year || '2025-2026',
        isbn: resourceData.isbn || `N/A-${Math.floor(1000 + Math.random() * 9000)}`,
        accessionNo: resourceData.accessionNo || `BHMC-DIG-${Math.floor(100 + Math.random() * 900)}`,
        type: resourceData.type || 'BOOK',
        fileFormat: resourceData.fileFormat || 'PDF',
        availableCopies: 99,
        isBookmarked: false,
        coverImageUrl: resourceData.coverImageUrl || 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=300&q=80',
        streamUrl: resourceData.streamUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileUrl: resourceData.fileUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        uploadedBy: resourceData.uploadedBy || 'Faculty Member',
        uploadedByUserId: resourceData.uploadedByUserId || 'usr-vp-001',
        uploadedRole: resourceData.uploadedRole || 'Faculty',
        uploadedAt: new Date().toISOString().split('T')[0],
        viewsCount: 0,
        downloadsCount: 0,
        allowDownload: resourceData.allowDownload !== undefined ? resourceData.allowDownload : true,
        description: resourceData.description || 'Uploaded academic resource for faculty & students.',
        fileSize: resourceData.fileSize || '5.4 MB',
        pageCount: resourceData.pageCount || 42,
      };

      mockLibraryBooks.unshift(newBook);
      return { success: true, message: 'Digital resource published successfully', data: newBook, timestamp: new Date().toISOString() };
    }
  },

  updateResource: async (bookId: string, updates: Partial<LibraryBook>): Promise<ApiResponse<LibraryBook>> => {
    try {
      const response = await apiClient.put<ApiResponse<LibraryBook>>(`/library/books/${bookId}`, updates);
      return response.data;
    } catch {
      const index = mockLibraryBooks.findIndex((b) => b.id === bookId);
      if (index !== -1) {
        mockLibraryBooks[index] = { ...mockLibraryBooks[index], ...updates };
        return { success: true, message: 'Resource updated', data: mockLibraryBooks[index], timestamp: new Date().toISOString() };
      }
      throw new Error('Resource not found');
    }
  },

  deleteResource: async (bookId: string): Promise<ApiResponse<boolean>> => {
    try {
      const response = await apiClient.delete<ApiResponse<boolean>>(`/library/books/${bookId}`);
      return response.data;
    } catch {
      const index = mockLibraryBooks.findIndex((b) => b.id === bookId);
      if (index !== -1) {
        mockLibraryBooks.splice(index, 1);
        return { success: true, message: 'Resource deleted', data: true, timestamp: new Date().toISOString() };
      }
      return { success: false, message: 'Resource not found', data: false, timestamp: new Date().toISOString() };
    }
  },

  incrementView: async (bookId: string): Promise<void> => {
    try {
      await apiClient.post(`/library/books/${bookId}/view`);
    } catch {
      const book = mockLibraryBooks.find((b) => b.id === bookId);
      if (book) book.viewsCount = (book.viewsCount || 0) + 1;
    }
  },

  incrementDownload: async (bookId: string): Promise<void> => {
    try {
      await apiClient.post(`/library/books/${bookId}/download`);
    } catch {
      const book = mockLibraryBooks.find((b) => b.id === bookId);
      if (book) book.downloadsCount = (book.downloadsCount || 0) + 1;
    }
  },

  getStreamToken: async (bookId: string): Promise<ApiResponse<{ token: string; streamUrl: string }>> => {
    try {
      const response = await apiClient.get<ApiResponse<{ token: string; streamUrl: string }>>(`/library/books/${bookId}/stream-token`);
      return response.data;
    } catch {
      const book = mockLibraryBooks.find((b) => b.id === bookId);
      return {
        success: true,
        message: 'Secure stream token generated for DRM reader',
        data: {
          token: `SECURE_STREAM_${Date.now()}`,
          streamUrl: book?.streamUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        },
        timestamp: new Date().toISOString(),
      };
    }
  },
};
