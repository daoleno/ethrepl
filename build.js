const esbuild = require('esbuild');
const path = require('path');

esbuild.build({
  entryPoints: [path.resolve(__dirname, 'repl.js')],
  bundle: true,
  outfile: 'dist/bundle.js',
  format: 'cjs',
  platform: 'node',
  target: 'node18',
  banner: {
    js: '#!/usr/bin/env node\n',
  },
  external: ['node:repl', 'node:crypto'],
}).catch(() => process.exit(1));
