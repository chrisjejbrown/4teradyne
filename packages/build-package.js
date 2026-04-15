#!/usr/bin/env node
/**
 * Build AEM content package for CF models and DAM structure.
 * Output: 4teradyne-content-models-1.0.0.zip
 */
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const PACKAGE_DIR = path.join(__dirname, 'content-models');
const OUTPUT_FILE = path.join(__dirname, '4teradyne-content-models-1.0.0.zip');

const requiredFiles = [
  'META-INF/vault/properties.xml',
  'META-INF/vault/filter.xml',
  'META-INF/vault/config.xml',
  'jcr_root/conf/4teradyne/settings/dam/cfm/models/defense-product/.content.xml',
  'jcr_root/conf/4teradyne/settings/dam/cfm/models/product-category/.content.xml',
  'jcr_root/conf/4teradyne/settings/dam/cfm/models/product-popup-detail/.content.xml',
  'jcr_root/conf/4teradyne/settings/dam/cfm/models/filter-configuration/.content.xml',
  'jcr_root/content/dam/4teradyne/.content.xml',
  'jcr_root/content/dam/4teradyne/products/.content.xml',
  'jcr_root/content/dam/4teradyne/defense-aerospace/.content.xml',
  'jcr_root/content/dam/4teradyne/defense-aerospace/product-explorer/.content.xml',
];

console.log('Building AEM content package: 4teradyne-content-models-1.0.0.zip\n');

// Validate
console.log('Validating package structure...');
for (const f of requiredFiles) {
  const full = path.join(PACKAGE_DIR, f);
  if (!fs.existsSync(full)) {
    console.error(`ERROR: Missing required file: ${f}`);
    process.exit(1);
  }
}
console.log('All required files present.\n');

// Build zip
const output = fs.createWriteStream(OUTPUT_FILE);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  const sizeKB = (archive.pointer() / 1024).toFixed(1);
  console.log(`\nPackage built: ${OUTPUT_FILE} (${sizeKB} KB)`);
  console.log('\nPackage contents:');
  console.log('  CF Models (4):');
  console.log('    - /conf/4teradyne/settings/dam/cfm/models/defense-product');
  console.log('    - /conf/4teradyne/settings/dam/cfm/models/product-category');
  console.log('    - /conf/4teradyne/settings/dam/cfm/models/product-popup-detail');
  console.log('    - /conf/4teradyne/settings/dam/cfm/models/filter-configuration');
  console.log('  DAM Folders:');
  console.log('    - /content/dam/4teradyne/products');
  console.log('    - /content/dam/4teradyne/defense-aerospace/product-explorer');
  console.log('\nTo install:');
  console.log('  1. Open AEM Package Manager');
  console.log('  2. Upload 4teradyne-content-models-1.0.0.zip');
  console.log('  3. Install the package');
});

archive.on('error', (err) => { throw err; });
archive.pipe(output);
archive.directory(path.join(PACKAGE_DIR, 'META-INF'), 'META-INF');
archive.directory(path.join(PACKAGE_DIR, 'jcr_root'), 'jcr_root');
archive.finalize();
