const mongoose = require('mongoose');

async function checkMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('No MONGODB_URI found!');
    return;
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('Connected to MongoDB!');

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));

    const BookModel = mongoose.model('Book', new mongoose.Schema({}, { strict: false }));
    const books = await BookModel.find({}).lean();
    console.log(`Found ${books.length} books in MongoDB:`);
    books.forEach(b => {
      console.log({
        id: b.id || b._id,
        title: b.title,
        fileName: b.fileName,
        fileSize: b.fileSize,
        googleDriveFileId: b.googleDriveFileId,
        pdfUrl: b.pdfUrl,
        createdAt: b.createdAt
      });
    });

    await mongoose.disconnect();
  } catch (err) {
    console.error('MongoDB Error:', err.message);
  }
}

checkMongo();
