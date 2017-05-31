import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
    entry: 'dist/contrast-matrix.js',
    format: 'iife',
    plugins: [ 
        resolve(),
        commonjs({
            include: 'node_modules/**'
        })
    ],
    dest: 'dist/bundle.js' // equivalent to --output
};