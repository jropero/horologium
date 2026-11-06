import js from '@eslint/js';
import babelParser from '@babel/eslint-parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import sonarjs from 'eslint-plugin-sonarjs';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'android/**',
      'public/**',
      'docs/**',
      // Babel 8 cannot parse generic arrow functions (<T>(...) => ...) in plain .ts files
      'utils/lunarCivilCalendar.ts',
    ],
  },

  js.configs.recommended,

  {
    files: ['**/*.{ts,tsx,js,mjs,mts}'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: true,
        babelOptions: { configFile: './babel.config.json' },
      },
      globals: {
        // browser
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        location: 'readonly',
        history: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        indexedDB: 'readonly',
        fetch: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        Blob: 'readonly',
        File: 'readonly',
        FileReader: 'readonly',
        FormData: 'readonly',
        Request: 'readonly',
        Response: 'readonly',
        Headers: 'readonly',
        Event: 'readonly',
        CustomEvent: 'readonly',
        MouseEvent: 'readonly',
        KeyboardEvent: 'readonly',
        TouchEvent: 'readonly',
        PointerEvent: 'readonly',
        ResizeObserver: 'readonly',
        IntersectionObserver: 'readonly',
        MutationObserver: 'readonly',
        PerformanceObserver: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        queueMicrotask: 'readonly',
        structuredClone: 'readonly',
        console: 'readonly',
        performance: 'readonly',
        crypto: 'readonly',
        Worker: 'readonly',
        SharedWorker: 'readonly',
        ServiceWorker: 'readonly',
        HTMLElement: 'readonly',
        SVGElement: 'readonly',
        Element: 'readonly',
        Node: 'readonly',
        NodeList: 'readonly',
        Text: 'readonly',
        Image: 'readonly',
        Canvas: 'readonly',
        AudioContext: 'readonly',
        // es2022
        Promise: 'readonly',
        Map: 'readonly',
        Set: 'readonly',
        WeakMap: 'readonly',
        WeakSet: 'readonly',
        WeakRef: 'readonly',
        Symbol: 'readonly',
        Proxy: 'readonly',
        Reflect: 'readonly',
        BigInt: 'readonly',
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
        ArrayBuffer: 'readonly',
        DataView: 'readonly',
        Int8Array: 'readonly',
        Uint8Array: 'readonly',
        Uint8ClampedArray: 'readonly',
        Int16Array: 'readonly',
        Uint16Array: 'readonly',
        Int32Array: 'readonly',
        Uint32Array: 'readonly',
        Float32Array: 'readonly',
        Float64Array: 'readonly',
        BigInt64Array: 'readonly',
        BigUint64Array: 'readonly',
        // node (for scripts/verify*.ts)
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        global: 'readonly',
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11y,
      sonarjs,
    },
    settings: {
      react: { version: '19' },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      ...sonarjs.configs.recommended.rules,

      // React 17+ JSX transform
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      // sonarjs: cognitive complexity gate
      'sonarjs/cognitive-complexity': ['error', 5],
      // JSX conditional rendering with ternaries is idiomatic React — warn only
      'sonarjs/no-nested-conditional': 'warn',
      // Data files legitimately repeat strings (festival names, deity names, etc.)
      'sonarjs/no-duplicate-string': ['warn', { threshold: 10 }],
      'sonarjs/no-identical-functions': 'warn',
      'sonarjs/no-collapsible-if': 'warn',
      'sonarjs/todo-tag': 'warn',
      // Math.random() is intentional for seeded procedural rendering (skylines, etc.)
      'sonarjs/pseudo-random': 'off',

      // tsc --noEmit handles undefined references reliably for TypeScript; Babel leaks
      // `as const` artifacts that make no-undef fire on `const` itself as an identifier
      'no-undef': 'off',
      // Babel strips TypeScript type imports so they appear unused — tsc owns this check
      'no-unused-vars': 'off',
    },
  },

  prettierConfig,
];
