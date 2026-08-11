const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'ndytm2fy',
  api_key: process.env.CLOUDINARY_API_KEY || '796437452988145',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'y0NqZCj61XzTaiiIDvxG5TS7drQ',
});

async function testCloudinary() {
  console.log('Testing Cloudinary config:', cloudinary.config().cloud_name);
  const testBuf = Buffer.from('%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF\n', 'utf-8');

  try {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        folder: 'bhmch_library',
        public_id: `test_pdf_${Date.now()}.pdf`,
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary Error:', error);
        } else {
          console.log('Cloudinary SUCCESS:', {
            public_id: result.public_id,
            bytes: result.bytes,
            secure_url: result.secure_url,
            format: result.format,
          });
        }
      }
    );

    uploadStream.end(testBuf);
  } catch (err) {
    console.error('Exception:', err);
  }
}

testCloudinary();
