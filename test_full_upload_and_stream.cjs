const fs = require('fs');
const path = require('path');

async function testUploadAndStream() {
  console.log('--- Testing Full Upload and Stream Pipeline ---');

  // Create a 14.2 MB valid PDF buffer
  const targetSizeMB = 14.2;
  const targetSizeBytes = Math.floor(targetSizeMB * 1024 * 1024);
  const pdfHeader = Buffer.from('%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\nstream\n', 'utf-8');
  const pdfFooter = Buffer.from('\nendstream\nendobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000052 00000 n\n0000000101 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n178\n%%EOF', 'utf-8');

  const paddingLength = Math.max(0, targetSizeBytes - pdfHeader.length - pdfFooter.length);
  const paddingBuf = Buffer.alloc(paddingLength, 65); // fill with 'A'
  const fullPdfBuffer = Buffer.concat([pdfHeader, paddingBuf, pdfFooter]);

  console.log(`Generated test PDF buffer size: ${fullPdfBuffer.length} bytes (${(fullPdfBuffer.length / (1024 * 1024)).toFixed(2)} MB)`);
  console.log(`First 10 bytes: "${fullPdfBuffer.subarray(0, 10).toString('utf-8')}"`);

  // Prepare FormData payload for POST /api/v1/library/books
  const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
  let bodyParts = [];

  function addField(name, value) {
    bodyParts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`, 'utf-8'));
  }

  addField('title', 'BHMS Complete Organon 14MB Manual');
  addField('author', 'Dr. Samuel Hahnemann');
  addField('category', 'Organon of Medicine');
  addField('department', 'Organon of Medicine');
  addField('semester', '1st BHMS');
  addField('subject', 'Organon of Medicine');
  addField('uploadedBy', 'Faculty Administrator');

  // File part
  const fileHeader = Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="bhms_complete_organon_14mb.pdf"\r\nContent-Type: application/pdf\r\n\r\n`, 'utf-8');
  const fileFooter = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf-8');

  const multipartBody = Buffer.concat([...bodyParts, fileHeader, fullPdfBuffer, fileFooter]);

  console.log(`Sending POST /api/v1/library/books (${(multipartBody.length / (1024 * 1024)).toFixed(2)} MB payload)...`);

  const uploadRes = await fetch('http://localhost:3000/api/v1/library/books', {
    method: 'POST',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': multipartBody.length.toString(),
    },
    body: multipartBody,
  });

  console.log('Upload HTTP status:', uploadRes.status);
  const uploadJson = await uploadRes.json();
  console.log('Upload response:', JSON.stringify(uploadJson, null, 2));

  if (!uploadJson.success || !uploadJson.data || !uploadJson.data.id) {
    console.error('FAILED to upload book!');
    return;
  }

  const bookId = uploadJson.data.id;
  console.log(`Uploaded Book ID: ${bookId}`);

  // Now test GET /api/v1/library/books/${bookId}/pdf
  console.log(`Testing GET /api/v1/library/books/${bookId}/pdf ...`);
  const pdfRes = await fetch(`http://localhost:3000/api/v1/library/books/${bookId}/pdf`);

  console.log('PDF Stream HTTP status:', pdfRes.status);
  console.log('PDF Content-Type:', pdfRes.headers.get('content-type'));
  console.log('PDF Content-Length:', pdfRes.headers.get('content-length'));

  const pdfArrayBuf = await pdfRes.arrayBuffer();
  const pdfRetrievedBuf = Buffer.from(pdfArrayBuf);

  console.log(`Retrieved PDF size: ${pdfRetrievedBuf.length} bytes (${(pdfRetrievedBuf.length / (1024 * 1024)).toFixed(2)} MB)`);
  console.log(`First 10 bytes: "${pdfRetrievedBuf.subarray(0, 10).toString('utf-8')}"`);

  if (pdfRetrievedBuf.subarray(0, 5).toString('utf-8') === '%PDF-') {
    console.log('VERIFICATION SUCCESSFUL: Retrieved file is a valid PDF starting with %PDF-');
    console.log(`Original upload size: ${fullPdfBuffer.length} bytes`);
    console.log(`Retrieved file size: ${pdfRetrievedBuf.length} bytes`);
    if (pdfRetrievedBuf.length === fullPdfBuffer.length) {
      console.log('EXACT MATCH: Upload size equals retrieved size!');
    }
  } else {
    console.error('VERIFICATION FAILED: First bytes do not start with %PDF-');
  }
}

testUploadAndStream();
