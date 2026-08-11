import { google } from 'googleapis';
import { Readable } from 'stream';
import fs from 'fs';
import path from 'path';

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

    const fileStream = new Readable();
    fileStream.push(fileBuffer);
    fileStream.push(null);

    const fileMetadata: any = {
      name: fileName,
      mimeType: mimeType,
    };

    if (this.folderId) {
      fileMetadata.parents = [this.folderId];
    }

    const response = await this.drive.files.create({
      requestBody: fileMetadata,
      media: {
        mimeType: mimeType,
        body: fileStream,
      },
      supportsAllDrives: true,
      supportsTeamDrives: true,
      fields: 'id, name, size, webViewLink, webContentLink',
    });

    if (!response.data || !response.data.id) {
      throw new Error('Google Drive API returned empty response or missing file ID.');
    }

    const fileId = response.data.id;

    // Set permission to public reader so web clients can access stream if needed
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

    const sizeInBytes = parseInt(response.data.size || '0', 10);
    const sizeFormatted = sizeInBytes > 0 ? `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB` : undefined;

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
}

export const googleDriveService = new GoogleDriveService();
