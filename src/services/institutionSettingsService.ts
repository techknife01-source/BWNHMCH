export interface InstitutionSettings {
  collegeName: string;
  shortName: string;
  establishedYear: string;
  addressLine1: string;
  addressLine2: string;
  po: string;
  district: string;
  city: string;
  state: string;
  pincode: string;
  formattedAddress: string;
  collegeEmail: string;
  collegePhone: string;
  hospitalPhone: string;
  additionalPhones?: string[];
  principalName: string;
  principalMobile: string;
  principalEmail: string;
  websiteUrl: string;
  
  // Footer Information
  footerText: string;
  footerWorkingHours: string;
  footerOpdHours: string;

  // PDF Header / Footer Configuration
  pdfHeaderTitle: string;
  pdfHeaderSubtitle: string;
  pdfHeaderAddress: string;
  pdfHeaderContactLine: string;
  pdfFooterNotice: string;
  pdfQrVerificationText: string;
}

export const DEFAULT_INSTITUTION_SETTINGS: InstitutionSettings = {
  collegeName: 'BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL',
  shortName: 'BHMCH',
  establishedYear: '1978',
  addressLine1: 'NIMBARK BHABAN, Rajganj',
  addressLine2: 'P.O. - Nutanganj',
  po: 'Nutanganj',
  district: 'Purba Bardhaman',
  city: 'Bardhaman',
  state: 'West Bengal',
  pincode: '713102',
  formattedAddress: 'NIMBARK BHABAN, Rajganj, P.O. - Nutanganj, Purba Bardhaman, Bardhaman, West Bengal, PIN - 713102',
  collegeEmail: 'bhmhospital78@gmail.com',
  collegePhone: '+91 9434238508',
  hospitalPhone: '+91 7001539036',
  additionalPhones: ['+91 9434238508', '+91 7001539036', '+91 94333 11889'],
  principalName: 'Prof. (Dr.) Susmita Chatterjee',
  principalMobile: '9434238508',
  principalEmail: 'drsusmita01@gmail.com',
  websiteUrl: 'https://bhmch.ac.in',
  
  footerText: 'Govt. Aided Premier Homoeopathic Medical College & 100-Bedded Hospital in West Bengal. Recognized by National Commission for Homoeopathy (NCH), New Delhi.',
  footerWorkingHours: 'Mon - Sat: 9:00 AM - 5:00 PM',
  footerOpdHours: 'Daily 9:00 AM - 2:00 PM | 24x7 Hospital Emergency',

  pdfHeaderTitle: 'BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL',
  pdfHeaderSubtitle: 'Govt. Aided Clinical Teaching Hospital | Estd. 1978 | WBUHS & NCH Recognized',
  pdfHeaderAddress: 'NIMBARK BHABAN, Rajganj, P.O. - Nutanganj, Purba Bardhaman, Bardhaman, W.B. - 713102',
  pdfHeaderContactLine: 'Tel: +91 9434238508 / +91 7001539036 / +91 94333 11889 | Email: bhmhospital78@gmail.com',
  pdfFooterNotice: 'This OPD Patient Card is an official medical record. Please bring this card during every follow-up visit.',
  pdfQrVerificationText: 'Scan QR code to verify authentic patient registration & OPD booking details.',
};

const STORAGE_KEY = 'bhmch_institution_settings_v1';

class InstitutionSettingsService {
  getSettings(): InstitutionSettings {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_INSTITUTION_SETTINGS, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to load institution settings from localStorage', e);
    }
    return { ...DEFAULT_INSTITUTION_SETTINGS };
  }

  saveSettings(newSettings: Partial<InstitutionSettings>): InstitutionSettings {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    
    // Auto format full address if component parts change
    if (newSettings.addressLine1 || newSettings.addressLine2 || newSettings.district || newSettings.city || newSettings.pincode) {
      updated.formattedAddress = `${updated.addressLine1}, ${updated.addressLine2}, ${updated.district}, ${updated.city}, ${updated.state}, PIN - ${updated.pincode}`;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('bhmch_institution_settings_updated'));
    } catch (e) {
      console.warn('Failed to save institution settings to localStorage', e);
    }
    return updated;
  }

  resetToDefault(): InstitutionSettings {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_INSTITUTION_SETTINGS));
      window.dispatchEvent(new Event('bhmch_institution_settings_updated'));
    } catch (e) {
      console.warn('Failed to reset institution settings', e);
    }
    return { ...DEFAULT_INSTITUTION_SETTINGS };
  }

  resetToDefaults(): InstitutionSettings {
    return this.resetToDefault();
  }
}

export const institutionSettingsService = new InstitutionSettingsService();
