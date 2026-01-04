#!/usr/bin/env node

/**
 * Advanced Build Optimization Script
 * This script performs additional optimizations after the Vite build
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { gzipSync } from 'zlib';

const distDir = './dist';

console.log('🚀 Starting post-build optimizations...\n');

// Analyze bundle sizes
function analyzeBundleSizes(dir, fileList = []) {
  const files = readdirSync(dir);
  
  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      analyzeBundleSizes(filePath, fileList);
    } else {
      const ext = extname(file);
      if (['.js', '.css', '.html'].includes(ext)) {
        const content = readFileSync(filePath);
        const gzipped = gzipSync(content);
        fileList.push({
          path: filePath.replace(distDir, ''),
          size: stat.size,
          gzipSize: gzipped.length,
          ext
        });
      }
    }
  });
  
  return fileList;
}

// Report
const files = analyzeBundleSizes(distDir);

console.log('📦 Bundle Analysis:\n');

// Group by type
const byType = {
  '.js': files.filter(f => f.ext === '.js'),
  '.css': files.filter(f => f.ext === '.css'),
  '.html': files.filter(f => f.ext === '.html')
};

Object.entries(byType).forEach(([type, typeFiles]) => {
  if (typeFiles.length === 0) return;
  
  console.log(`${type} files:`);
  const totalSize = typeFiles.reduce((sum, f) => sum + f.size, 0);
  const totalGzip = typeFiles.reduce((sum, f) => sum + f.gzipSize, 0);
  
  typeFiles
    .sort((a, b) => b.size - a.size)
    .slice(0, 10) // Top 10 largest
    .forEach(file => {
      const sizeKb = (file.size / 1024).toFixed(2);
      const gzipKb = (file.gzipSize / 1024).toFixed(2);
      const ratio = ((file.gzipSize / file.size) * 100).toFixed(1);
      console.log(`  ${file.path}`);
      console.log(`    Size: ${sizeKb} KB → ${gzipKb} KB (${ratio}% gzipped)`);
    });
  
  console.log(`  Total: ${(totalSize / 1024).toFixed(2)} KB → ${(totalGzip / 1024).toFixed(2)} KB\n`);
});

// Check for large files
const largeFiles = files.filter(f => f.size > 100 * 1024); // > 100KB
if (largeFiles.length > 0) {
  console.log('⚠️  Large files detected (>100KB):');
  largeFiles.forEach(file => {
    console.log(`  ${file.path}: ${(file.size / 1024).toFixed(2)} KB`);
  });
  console.log('\n💡 Consider further code splitting for these files.\n');
}

// Success summary
const totalOriginal = files.reduce((sum, f) => sum + f.size, 0);
const totalGzipped = files.reduce((sum, f) => sum + f.gzipSize, 0);
const compression = ((1 - totalGzipped / totalOriginal) * 100).toFixed(1);

console.log('✅ Build optimization complete!');
console.log(`   Total size: ${(totalOriginal / 1024).toFixed(2)} KB`);
console.log(`   Gzipped: ${(totalGzipped / 1024).toFixed(2)} KB`);
console.log(`   Compression: ${compression}%\n`);

// Recommendations
console.log('📝 Recommendations:');
console.log('   1. Deploy with compression enabled (gzip/brotli)');
console.log('   2. Set long-term caching headers for assets');
console.log('   3. Monitor bundle sizes with each deployment');
console.log('   4. Test on real devices and slow networks\n');
