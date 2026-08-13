import { google } from 'googleapis';
import { Readable } from 'stream';
import fs from 'fs';
import path from 'path';

function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 60000): Promise<T> {
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
  private quotaExceeded: boolean = false;

  constructor() {
    this.init();
  }

  public init() {
    let folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    let clientEmail = process.env.GOOGLE_DRIVE_CLIENT_EMAIL || 'bwnhmch-elibrary@bwnhmch.iam.gserviceaccount.com';
    let privateKeyRaw = process.env.GOOGLE_DRIVE_PRIVATE_KEY || `-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDZ7HI+ttULYDr0\nTOGFkcl+nQoc0OCEqtUEf0BxpNzeZDbmSkHj2KlCU6i0PXGzRUnrEDVwqjQz58YJ\n6f8RF2zfkh4cU+PmhWU2xotGg41am7Df66vEDmbK1AZlTYVjopkEhyUYS7B1SQLn\nvK5E9EPGWYPNCrHhP2jgmkjeVnQ50ZCFScGVM/4QRmElyOV5KueqYX3sLPprQG5P\nudyUWrnFrSXPnt0qMztqq75dIqG7CC1QSl9vBB7OISYY4EumoJBPmlcG52Jl6Aam\nyNZmOf/ap1qcJinJhQ8Ln/+KtFdlAbptZ29uxGzFeJaCgwTVYvtH3vAhxXcleRSN\nRJpEvecrAgMBAAECggEAVD2YtDGNDYa3g3SswStoDq+6FwWPpPk8uy5NxSCL2NQ4\nfLE7403/sAoS7wnJiBlCx8FORy0kXOQ9o9t2pC7AAXTEewLa2GO8in4ZnLqBzALf\nTtAVaAaBKeroRgS/iZJzQFLVvhyUK+J7YwWHAFTEVkqILpzxwjb23cwGWxxkdWyc\neQRh48JxXLpXrqsCAz1c23AG6FYn9oSWsBk0IrWlOiI78mxpAOThsSlGr1as4XIE\n3AWWUTND1c9d7zl+lk+mhoQYoAF8wbT+o+xXeSeJ2LHgjAHmH2daoWL5TCPfhtCa\nrV804odSP5ETeC0nzzZrJE0cdnTD3lW+sXdq26pmEQKBgQD3XvQU7pIYvh3MoFvm\nm2oMcrEdjDAoihVfzrD16rmkP4mOEW8dukTvdo5Hb8jtnhw/NlrFaaWhYHCTyQOB\n4QGB6sxuFYk1ncwrKHdlA7h6jOEUqAIBsVCild/hoYqnlXHUmfIRjXMilayHCQsH\n/F3NQbeXFXEZVf7kx2r7LOJS9QKBgQDhhoaNoIu7+ssvhYpAtTfplCk1YnZwyLA1\nR7M6fpq39DVGkqu4wTdzcYdOTIFp+0NLeJhU2rrwsgcdAdZiLXAKETB2aWoCobuI\ndiS0PppO6pYuXqnihMII5eZTuAAT52iYLfCVnzqQ3066US8R9qVR+GiJnf2kX2WF\niCXZq8g9nwKBgHjThW8v9GZnflCzxw/Fu6/m2YIwNlmm0LfiUmdbxl9mtX6SH28q\ny38XrnlQLZl60BtEJmQkrUU8wOA+oBrxV3YoxL/EfyeUMuSluGO7xID/jPU09v3y\nqQsxH5CrAfnHMjmBFE7kg2dSKlou3ZeB+iNGxTDjxUF10rHWgfe7vbR9AoGAa3HC\n8wCU8hb27IoLpu5vV+oNg/CICw2h3ZBuVCTzI0bGhvvjsh7jgy2IUAZk9ZAOrIsk\nz/BxdbDrcKdqctXA9hrgYtmv9tcE2Guo6vKUY5qhuC/Dcjbblo+pHyOfbdwm2bGx\nWCdHKLQq9tssuLswYhAeBcpuh/wnCuolVkHgIXMCgYEA7eEVYuYlbr9K1SetVC8x\nt3/Ws5ypzb5zGHsXKMXGezLx2v/Dht5RgOtBnakwIj4dt4StQpzunJruJytJZOoF\n0h+C34zhjfKf4915iIqu5mlUN9OCcrkhbBHrlE0UKnRzp7QMUhtm792FMjIoMxAf\n9vZl7ROhm8RGjomnN/WJFlk=\n-----END PRIVATE KEY-----\n`;

    this.folderId = folderId || null;

    try {
      if (privateKeyRaw && privateKeyRaw.trim().startsWith('{')) {
        try {
          const parsed = JSON.parse(privateKeyRaw.trim());
          if (parsed.client_email) clientEmail = parsed.client_email;
          if (parsed.private_key) privateKeyRaw = parsed.private_key;
        } catch (e) {
          // Ignore JSON parse failure
        }
      }

      if (clientEmail && privateKeyRaw) {
        let privateKey = privateKeyRaw.replace(/\\n/g, '\n').trim();
        if ((privateKey.startsWith('"') && privateKey.endsWith('"')) || (privateKey.startsWith("'") && privateKey.endsWith("'"))) {
          privateKey = privateKey.substring(1, privateKey.length - 1).trim();
        }
        if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
          privateKey = `-----BEGIN PRIVATE KEY-----\n${privateKey}\n-----END PRIVATE KEY-----`;
        }

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
      this.isConfigured = false;
      this.drive = null;
    }
  }

  public hasCredentials(): boolean {
    return this.isConfigured && !!this.drive && !this.quotaExceeded;
  }

  public async uploadPdf(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string = 'application/pdf'
  ): Promise<{ fileId: string; fileSizeFormatted?: string; storedSizeBytes: number }> {
    if (!this.hasCredentials()) {
      return { fileId: '', storedSizeBytes: 0 };
    }

    try {
      const fileMetadata: any = {
        name: fileName,
        mimeType: mimeType,
      };

      if (this.folderId) {
        fileMetadata.parents = [this.folderId];
      }

      const fileStream = new Readable();
      fileStream.push(fileBuffer);
      fileStream.push(null);

      const response = await withTimeout<any>(
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
        120000
      );

      if (!response || !response.data || !response.data.id) {
        return { fileId: '', storedSizeBytes: 0 };
      }

      const fileId = response.data.id;
      const storedSize = parseInt(response.data.size || '0', 10);

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

      const sizeFormatted = `${((storedSize || fileBuffer.length) / (1024 * 1024)).toFixed(1)} MB`;

      return {
        fileId,
        fileSizeFormatted: sizeFormatted,
        storedSizeBytes: storedSize || fileBuffer.length,
      };
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      if (errMsg.includes('storage quota') || errMsg.includes('Service Accounts do not have storage quota')) {
        this.quotaExceeded = true;
      }
      console.log('[E-LIBRARY] Google Drive upload note:', errMsg);
      return { fileId: '', storedSizeBytes: 0 };
    }
  }

  public async getPdfStream(fileId: string, rangeHeader?: string) {
    if (!this.hasCredentials()) {
      throw new Error('Google Drive API not configured.');
    }

    const meta = await this.getFileMetadata(fileId);
    if (!meta || !meta.size || parseInt(meta.size, 10) === 0) {
      throw new Error(`Google Drive file ID ${fileId} is unavailable or contains 0 bytes.`);
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
      size: parseInt(meta.size, 10),
      name: meta.name,
      mimeType: meta.mimeType,
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
