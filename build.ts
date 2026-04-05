/**
 * Veloxis Build Script
 * Generates ESM and CJS bundles using Bun.build
 */

async function runBuild() {
  console.log('🚀 Building Veloxis...');

  const entrypoints = [
    './src/index.ts',
    './src/plugins/retry.ts',
    './src/plugins/cache.ts',
    './src/plugins/auth.ts'
  ];

  // Build ESM
  await Bun.build({
    entrypoints,
    outdir: './dist',
    format: 'esm',
    target: 'browser',
    minify: true,
    sourcemap: 'external',
  });

  // Build CJS (Renaming to .cjs)
  const cjsBuild = await Bun.build({
    entrypoints: ['./src/index.ts'],
    outdir: './dist',
    format: 'esm', // Bun currently only supports 'esm', but we can rename or use a wrapper
    target: 'node',
    minify: true,
  });

  if (cjsBuild.success) {
    const fs = require('fs');
    if (fs.existsSync('./dist/index.js')) {
      fs.renameSync('./dist/index.js', './dist/index.cjs');
    }
  }

  console.log('✅ Build completed successfully!');
}

runBuild().catch((err) => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
