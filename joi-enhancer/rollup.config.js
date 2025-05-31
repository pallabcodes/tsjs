import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import dts from 'rollup-plugin-dts';

// Mark both joi and the additional dependencies as external
const external = [
  'joi', 
  'joi-extract-type', 
  'joi-to-json-schema'
];

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'named'
      },
      {
        file: 'dist/index.esm.js',
        format: 'esm',
        sourcemap: true
      }
    ],
    external,
    plugins: [
      nodeResolve(),
      commonjs(),
      json(),
      typescript({ tsconfig: './tsconfig.json' })
    ]
  },
  {
    input: 'src/advanced.ts',
    output: [
      {
        file: 'dist/advanced.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'named'
      },
      {
        file: 'dist/advanced.esm.js',
        format: 'esm',
        sourcemap: true
      }
    ],
    external,
    plugins: [
      nodeResolve(),
      commonjs(),
      json(),
      typescript({ tsconfig: './tsconfig.json' })
    ]
  }
];
