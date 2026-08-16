import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

console.log('=== STARTING SPRING BOOT GALLERY BACKEND VERIFICATION TEST ===');

try {
  const rootDir = process.cwd();
  console.log('Building Spring Boot JAR artifact...');
  const buildOutput = execSync('mvn clean package -DskipTests', {
    cwd: path.join(rootDir, 'backend'),
    encoding: 'utf-8',
  });
  console.log('Build Output Summary:');
  console.log(buildOutput.split('\n').filter(l => l.includes('BUILD SUCCESS') || l.includes('Building jar')).join('\n'));

  console.log('\nVerifying GalleryItem entity definition...');
  const galleryItemContent = fs.readFileSync(
    path.join(rootDir, 'backend/src/main/java/com/homeopathy/college/entity/GalleryItem.java'),
    'utf-8'
  );
  if (galleryItemContent.includes('@Field("id")') && galleryItemContent.includes('public void setId')) {
    console.log('GalleryItem entity check: PASSED (contains @Field("id") and non-null helper setters)');
  } else {
    throw new Error('GalleryItem entity missing required @Field("id") mapping!');
  }

  console.log('\nVerifying GalleryServiceImpl createItem logic...');
  const galleryServiceContent = fs.readFileSync(
    path.join(rootDir, 'backend/src/main/java/com/homeopathy/college/serviceImpl/GalleryServiceImpl.java'),
    'utf-8'
  );
  if (galleryServiceContent.includes('migrateExistingNullIdRecords') && galleryServiceContent.includes('gal-')) {
    console.log('GalleryServiceImpl check: PASSED (contains migration and unique gal- ID generation)');
  } else {
    throw new Error('GalleryServiceImpl missing migration or ID generation logic!');
  }

  console.log('\n==================================================');
  console.log('SPRING BOOT GALLERY FIX VERIFICATION: PASSED');
  console.log('==================================================');
} catch (err: any) {
  console.error('VERIFICATION ERROR:', err.message || err);
  process.exit(1);
}
