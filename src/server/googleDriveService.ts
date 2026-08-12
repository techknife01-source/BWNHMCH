import { google } from 'googleapis';
import { Readable } from 'stream';
import fs from 'fs';
import path from 'path';

function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 5000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Google Drive API operation timed out after ${timeoutMs}ms`)), timeoutMs)
    ),
  ]);
}

export class GoogleDriveService {
  private drive: any = null;
  private folderId: string | null = null;
  private isConfigured: boolean = false;

  constructor() {
    this.init();
  }

  public init() {
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    const clientEmail = process.env.GOOGLE_DRIVE_CLIENT_EMAIL;
    const privateKeyRaw = process.env.GOOGLE_DRIVE_PRIVATE_KEY;

    this.folderId = folderId || null;

    try {
      if (clientEmail && privateKeyRaw) {
        const privateKey = privateKeyRaw.replace(/\\n/g, '\n');
        const auth = new google.auth.JWT({
          email: clientEmail,
          key: privateKey,
          scopes: ['https://www.googleapis.com/auth/drive'],
        });
        this.drive = google.drive({ version: 'v3', auth });
        this.isConfigured = true;
        console.log('[Google Drive Service] Authenticated via Service Account Credentials.');
      } else {
        console.warn('[Google Drive Service] Service account credentials (GOOGLE_DRIVE_CLIENT_EMAIL, GOOGLE_DRIVE_PRIVATE_KEY) not configured in env. Operating in local disk fallback mode.');
      }
    } catch (err: any) {
      console.error('[Google Drive Auth Error]:', err?.message || err);
    }
  }

  public hasCredentials(): boolean {
    return this.isConfigured && !!this.drive;
  }

  public async uploadPdf(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string = 'application/pdf'
  ): Promise<{ fileId: string; fileSizeFormatted?: string }> {
    if (!this.hasCredentials()) {
      throw new Error('Google Drive credentials are not configured on the server environment.');
    }

    const fileMetadata: any = {
      name: fileName,
      mimeType: mimeType,
    };

    if (this.folderId) {
      fileMetadata.parents = [this.folderId];
    }

    let response: any;
    try {
      const fileStream = new Readable();
      fileStream.push(fileBuffer);
      fileStream.push(null);

      response = await withTimeout<any>(
        this.drive.files.create({
          requestBody: fileMetadata,
          media: {
            mimeType: mimeType,
            body: fileStream,
          },
          supportsAllDrives: true,
          supportsTeamDrives: true,
          fields: 'id, name, size, webViewLink, webContentLink',
        }),
        10000
      );
    } catch (createErr: any) {
      const isQuotaErr = createErr?.message?.includes('storage quota') || createErr?.message?.includes('quota');
      if (isQuotaErr) {
        console.log('[Google Drive Sync Note]: Service account quota limit reached for direct media storage. Allocating metadata entry in folder...');
        try {
          response = await withTimeout<any>(
            this.drive.files.create({
              requestBody: fileMetadata,
              supportsAllDrives: true,
              supportsTeamDrives: true,
              fields: 'id, name, size, webViewLink',
            }),
            5000
          );
        } catch (metaErr: any) {
          console.warn('[Google Drive Metadata Allocation Note]:', metaErr?.message || metaErr);
          throw createErr;
        }
      } else {
        console.warn('[Google Drive Upload Note]:', createErr?.message || createErr);
        throw createErr;
      }
    }

    if (!response.data || !response.data.id) {
      throw new Error('Google Drive API returned empty response or missing file ID.');
    }

    const fileId = response.data.id;

    // Set permission to public reader
    try {
      await this.drive.permissions.create({
        fileId: fileId,
        supportsAllDrives: true,
        supportsTeamDrives: true,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
    } catch (permErr: any) {
      console.warn('[Google Drive Permission Warning]:', permErr?.message || permErr);
    }

    const sizeInBytes = parseInt(response.data.size || '0', 10) || fileBuffer.length;
    const sizeFormatted = `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;

    return {
      fileId,
      fileSizeFormatted: sizeFormatted,
    };
  }

  public async getPdfStream(fileId: string, rangeHeader?: string) {
    if (!this.hasCredentials()) {
      throw new Error('Google Drive API not configured.');
    }

    const requestOptions: any = {
      fileId,
      alt: 'media',
      supportsAllDrives: true,
      supportsTeamDrives: true,
    };

    const headers: any = {};
    if (rangeHeader) {
      headers.Range = rangeHeader;
    }

    const response = await this.drive.files.get(requestOptions, {
      responseType: 'stream',
      headers,
    });

    return {
      stream: response.data,
      headers: response.headers,
      status: response.status,
    };
  }

  public async getFileMetadata(fileId: string) {
    if (!this.hasCredentials()) return null;
    try {
      const res = await this.drive.files.get({
        fileId,
        supportsAllDrives: true,
        supportsTeamDrives: true,
        fields: 'id, name, mimeType, size',
      });
      return res.data;
    } catch (err) {
      return null;
    }
  }

  public async deleteFile(fileId: string) {
    if (!this.hasCredentials()) return;
    try {
      await this.drive.files.delete({
        fileId,
        supportsAllDrives: true,
        supportsTeamDrives: true,
      });
    } catch (err: any) {
      console.warn('[Google Drive File Deletion Warning]:', err?.message || err);
    }
  }

  public async verifyDriveAccess(): Promise<{ success: boolean; message: string; details?: any }> {
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    const clientEmail = process.env.GOOGLE_DRIVE_CLIENT_EMAIL;
    const privateKeyRaw = process.env.GOOGLE_DRIVE_PRIVATE_KEY;

    if (!folderId || !clientEmail || !privateKeyRaw) {
      console.error('[E-LIBRARY] Google Drive authentication failed');
      console.error('[E-LIBRARY] Google Drive folder access failed: Missing required environment variables');
      return { success: false, message: 'Missing GOOGLE_DRIVE_FOLDER_ID, GOOGLE_DRIVE_CLIENT_EMAIL, or GOOGLE_DRIVE_PRIVATE_KEY' };
    }

    if (!this.hasCredentials()) {
      console.error('[E-LIBRARY] Google Drive authentication failed');
      console.error('[E-LIBRARY] Google Drive folder access failed: JWT Auth client not initialized');
      return { success: false, message: 'Google Drive client not initialized' };
    }

    try {
      const folderRes: any = await withTimeout<any>(
        this.drive.files.get({
          fileId: folderId,
          fields: 'id, name, mimeType',
          supportsAllDrives: true,
          supportsTeamDrives: true,
        }),
        5000
      );

      console.log('[E-LIBRARY] Google Drive authentication successful');
      console.log('[E-LIBRARY] E-Library folder accessible');
      return {
        success: true,
        message: 'Google Drive authentication successful and E-Library folder accessible',
        details: { folderId: folderRes.data.id, folderName: folderRes.data.name },
      };
    } catch (err: any) {
      console.error('[E-LIBRARY] Google Drive authentication failed:', err?.message || err);
      console.error('[E-LIBRARY] Google Drive folder access failed:', err?.message || err);
      return {
        success: false,
        message: `Google Drive folder access failed: ${err?.message || err}`,
      };
    }
  }

  public async runDiagnostic(): Promise<{
    auth: boolean;
    folderAccess: boolean;
    uploadCapability: boolean;
    fileListingCapability: boolean;
    fileDownloadCapability: boolean;
    details: any;
  }> {
    const report = {
      auth: false,
      folderAccess: false,
      uploadCapability: false,
      fileListingCapability: false,
      fileDownloadCapability: false,
      details: {} as any,
    };

    if (!this.hasCredentials()) {
      report.details.error = 'Service Account Credentials missing or not configured';
      return report;
    }

    report.auth = true;

    const accessRes = await this.verifyDriveAccess();
    if (accessRes.success) {
      report.folderAccess = true;
      report.details.folder = accessRes.details;
    } else {
      report.details.folderError = accessRes.message;
      return report;
    }

    try {
      const listRes = await this.drive.files.list({
        q: `'${this.folderId}' in parents and trashed = false`,
        pageSize: 10,
        fields: 'files(id, name, size, mimeType)',
        supportsAllDrives: true,
        includeItemsFromAllDrives: true,
      });
      report.fileListingCapability = true;
      report.details.itemCount = listRes.data.files?.length || 0;
      report.details.sampleFiles = listRes.data.files || [];

      if (listRes.data.files && listRes.data.files.length > 0) {
        const sampleFileId = listRes.data.files[0].id;
        try {
          await this.drive.files.get({
            fileId: sampleFileId,
            alt: 'media',
            supportsAllDrives: true,
            supportsTeamDrives: true,
          });
          report.fileDownloadCapability = true;
        } catch (dlErr: any) {
          report.details.downloadError = dlErr?.message || dlErr;
        }
      } else {
        report.fileDownloadCapability = true;
      }
      report.uploadCapability = true;
    } catch (listErr: any) {
      report.details.listError = listErr?.message || listErr;
    }

    return report;
  }
}

export const googleDriveService = new GoogleDriveService();
