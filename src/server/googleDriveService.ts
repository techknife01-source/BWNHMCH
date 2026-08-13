import { google } from 'googleapis';
import { Readable } from 'stream';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

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
  private oauth2Client: any = null;
  private folderId: string | null = null;
  private isConfigured: boolean = false;
  private authMode: 'oauth2' | 'service_account' | 'none' = 'none';

  constructor() {
    this.init();
  }

  public init() {
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID || '';
    const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID || '';
    const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET || '';
    const redirectUri = process.env.GOOGLE_DRIVE_REDIRECT_URI || 'http://localhost:10000/api/v1/library/google-drive/oauth/callback';
    const refreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN || '';

    this.folderId = folderId;

    // 1. Prefer OAuth 2.0 credentials if refresh token is present
    if (clientId && clientSecret && redirectUri && refreshToken && refreshToken.trim() !== '') {
      try {
        this.oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
        this.oauth2Client.setCredentials({ refresh_token: refreshToken.trim() });
        this.drive = google.drive({ version: 'v3', auth: this.oauth2Client });
        this.isConfigured = true;
        this.authMode = 'oauth2';
        console.log('[Google Drive Service] Authenticated via OAuth 2.0 (bwnhmch@gmail.com).');
        return;
      } catch (oauthErr: any) {
        console.error('[Google Drive Service] OAuth2 client init error:', oauthErr?.message || oauthErr);
      }
    }

    // 2. Fallback to Service Account credentials if OAuth refresh token is not yet set
    let clientEmail = process.env.GOOGLE_DRIVE_CLIENT_EMAIL;
    let privateKeyRaw = process.env.GOOGLE_DRIVE_PRIVATE_KEY;

    if (clientEmail && privateKeyRaw) {
      try {
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
        this.authMode = 'service_account';
        console.log('[Google Drive Service] Authenticated via Service Account (OAuth refresh token pending authorization).');
        return;
      } catch (err: any) {
        console.error('[Google Drive Auth Error]:', err?.message || err);
      }
    }

    this.isConfigured = false;
    this.drive = null;
    this.authMode = 'none';
  }

  public getAuthUrl(): { authUrl: string; state: string } {
    const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID || '';
    const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET || '';
    const redirectUri = process.env.GOOGLE_DRIVE_REDIRECT_URI || 'http://localhost:10000/api/v1/library/google-drive/oauth/callback';

    const stateToken = crypto.randomBytes(32).toString('hex');
    if (!this.pendingStateTokens) {
      this.pendingStateTokens = new Set<string>();
    }
    this.pendingStateTokens.add(stateToken);

    setTimeout(() => {
      if (this.pendingStateTokens) {
        this.pendingStateTokens.delete(stateToken);
      }
    }, 15 * 60 * 1000);

    const client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    const authUrl = client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/drive'],
      prompt: 'consent',
      state: stateToken,
      include_granted_scopes: true,
    });

    return { authUrl, state: stateToken };
  }

  private pendingStateTokens: Set<string> = new Set<string>();

  public verifyStateToken(state: string): boolean {
    if (!state || !this.pendingStateTokens || !this.pendingStateTokens.has(state)) {
      return false;
    }
    this.pendingStateTokens.delete(state);
    return true;
  }

  public async handleOAuthCallback(code: string): Promise<any> {
    const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID || '';
    const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET || '';
    const redirectUri = process.env.GOOGLE_DRIVE_REDIRECT_URI || 'http://localhost:10000/api/v1/library/google-drive/oauth/callback';

    const client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    const { tokens } = await client.getToken(code);

    if (tokens.refresh_token) {
      process.env.GOOGLE_DRIVE_REFRESH_TOKEN = tokens.refresh_token;
      this.saveRefreshTokenToEnv(tokens.refresh_token);
      this.init();
      console.log('[Google Drive Service] OAuth 2.0 refresh token saved and initialized successfully.');
    } else {
      console.warn('[Google Drive Service] Warning: Authorization succeeded but no refresh token was returned (user may have previously consented without prompt=consent).');
    }

    return tokens;
  }

  private saveRefreshTokenToEnv(refreshToken: string) {
    try {
      const envPath = path.join(process.cwd(), '.env');
      if (fs.existsSync(envPath)) {
        let content = fs.readFileSync(envPath, 'utf8');
        if (content.includes('GOOGLE_DRIVE_REFRESH_TOKEN=')) {
          content = content.replace(/GOOGLE_DRIVE_REFRESH_TOKEN=.*/g, `GOOGLE_DRIVE_REFRESH_TOKEN=${refreshToken}`);
        } else {
          content += `\nGOOGLE_DRIVE_REFRESH_TOKEN=${refreshToken}\n`;
        }
        fs.writeFileSync(envPath, content, 'utf8');
      }
    } catch (e: any) {
      console.warn('[Google Drive Service] Could not write refresh token to .env file:', e?.message || e);
    }
  }

  public getAuthMode(): string {
    return this.authMode;
  }

  public hasCredentials(): boolean {
    if (!this.isConfigured || !this.drive) {
      this.init();
    }
    return this.isConfigured && !!this.drive;
  }

  public async uploadPdf(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string = 'application/pdf'
  ): Promise<{ fileId: string; fileSizeFormatted?: string; storedSizeBytes: number; error?: string }> {
    if (!this.hasCredentials()) {
      return { fileId: '', storedSizeBytes: 0, error: 'Google Drive client not configured' };
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
        return { fileId: '', storedSizeBytes: 0, error: 'Empty file ID returned' };
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
        console.error('[LIBRARY] Google Drive WRITE: FAIL (Service Accounts do not have storage quota for folder destination)');
      } else {
        console.error('[LIBRARY] Google Drive upload error:', errMsg);
      }
      return { fileId: '', storedSizeBytes: 0, error: errMsg };
    }
  }

  public async getPdfStream(fileId: string, rangeHeader?: string) {
    if (!this.hasCredentials()) {
      throw new Error('Google Drive API not configured.');
    }

    const meta = await this.getFileMetadata(fileId);
    if (!meta) {
      throw new Error(`Google Drive file ID ${fileId} is unavailable.`);
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
      size: meta.size ? parseInt(meta.size, 10) : 0,
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
      console.log(`[LIBRARY] Deleted file ${fileId} from Google Drive`);
    } catch (err: any) {
      console.warn('[LIBRARY] Google Drive File Deletion Warning:', err?.message || err);
    }
  }

  public async verifyDriveAccess(): Promise<{ success: boolean; message: string; read: boolean; write: boolean; details?: any }> {
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID || '1IRcwRPZ9d0Tk-cp-bCYZwKOUX7Cg3dsC';

    if (!this.hasCredentials()) {
      console.error('[E-LIBRARY] Google Drive authentication failed: Client not initialized');
      return { success: false, read: false, write: false, message: 'Google Drive client not initialized' };
    }

    let readPass = false;
    let writePass = false;
    let folderDetails: any = null;

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
      readPass = true;
      folderDetails = { folderId: folderRes.data.id, folderName: folderRes.data.name };
      console.log('[LIBRARY] Google Drive READ: PASS');
    } catch (err: any) {
      console.error('[LIBRARY] Google Drive READ: FAIL:', err?.message || err);
      return {
        success: false,
        read: false,
        write: false,
        message: `Google Drive folder READ failed: ${err?.message || err}`,
      };
    }

    // Probe WRITE capability
    try {
      const probeRes = await this.drive.files.create({
        requestBody: {
          name: 'write_capability_probe.tmp',
          mimeType: 'text/plain',
          parents: [folderId],
        },
        media: {
          mimeType: 'text/plain',
          body: Readable.from(Buffer.from('probe')),
        },
        supportsAllDrives: true,
        supportsTeamDrives: true,
        fields: 'id',
      });

      if (probeRes.data?.id) {
        writePass = true;
        console.log('[LIBRARY] Google Drive WRITE: PASS');
        try {
          await this.drive.files.delete({ fileId: probeRes.data.id, supportsAllDrives: true, supportsTeamDrives: true });
          console.log('[LIBRARY] Google Drive DELETE: PASS');
        } catch {}
      }
    } catch (writeErr: any) {
      const errMsg = writeErr?.message || String(writeErr);
      if (errMsg.includes('storage quota') || errMsg.includes('Service Accounts do not have storage quota')) {
        console.error('[LIBRARY] Google Drive WRITE: FAIL (Service Accounts do not have storage quota)');
      } else {
        console.error('[LIBRARY] Google Drive WRITE: FAIL:', errMsg);
      }
    }

    const overallSuccess = readPass && writePass;
    const summaryMsg = `Google Drive READ: ${readPass ? 'PASS' : 'FAIL'}, Google Drive WRITE: ${writePass ? 'PASS' : 'FAIL'}`;

    return {
      success: overallSuccess,
      read: readPass,
      write: writePass,
      message: summaryMsg,
      details: folderDetails,
    };
  }

  public async runDiagnostic(): Promise<{
    auth: boolean;
    folderAccess: boolean;
    readCapability: boolean;
    writeCapability: boolean;
    deleteCapability: boolean;
    uploadCapability: boolean;
    fileListingCapability: boolean;
    fileDownloadCapability: boolean;
    details: any;
  }> {
    const report = {
      auth: false,
      folderAccess: false,
      readCapability: false,
      writeCapability: false,
      deleteCapability: false,
      uploadCapability: false,
      fileListingCapability: false,
      fileDownloadCapability: false,
      details: {} as any,
    };

    if (!this.hasCredentials()) {
      report.details.error = 'Google Drive Client missing or not configured';
      return report;
    }

    report.auth = true;

    const accessRes = await this.verifyDriveAccess();
    report.readCapability = accessRes.read;
    report.writeCapability = accessRes.write;
    report.uploadCapability = accessRes.write;
    report.deleteCapability = accessRes.write;

    if (accessRes.read) {
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
    } catch (listErr: any) {
      report.details.listError = listErr?.message || listErr;
    }

    return report;
  }
}

export const googleDriveService = new GoogleDriveService();
