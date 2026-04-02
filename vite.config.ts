import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'integrations/react': resolve(__dirname, 'src/integrations/react.tsx'),
        'integrations/vue': resolve(__dirname, 'src/integrations/vue.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      // 'fs' is a Node.js built-in used by opentype.js for its font-file-writing
      // code path (inside an isBrowser() guard).  Marking it external prevents
      // "Module not found: Can't resolve 'fs'" errors when consumers bundle this
      // library for the browser (e.g. Next.js / webpack).  Browser bundlers that
      // respect the package.json `browser: {fs: false}` field will already stub
      // it out; making it explicit here ensures Rollup doesn't try to resolve it.
      external: ['three', 'react', 'react/jsx-runtime', 'vue', 'fs'],
      output: {
        globals: {
          three: 'THREE',
          react: 'React',
          'react/jsx-runtime': 'ReactJSXRuntime',
          vue: 'Vue',
        },
        // Preserve directory structure for integrations
        entryFileNames: '[name].js',
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
