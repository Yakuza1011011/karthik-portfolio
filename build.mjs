import { build } from 'esbuild';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const { outputFiles } = await build({
  entryPoints: ['src/main.jsx'],
  outfile: 'background.js',
  write: false,
  bundle: true,
  jsx: 'automatic',
  loader: { '.ttf': 'dataurl', '.webp': 'dataurl', '.png': 'dataurl' },
  minify: true,
  target: 'es2020',
  define: { 'process.env.NODE_ENV': '"production"' },
  legalComments: 'inline',
});

const script = outputFiles.find(file => file.path.endsWith('.js')).text;
const fontLicenses = await Promise.all(['src/fonts/OFL.txt', 'src/fonts/Poppins-OFL.txt', 'src/fonts/Montserrat-OFL.txt'].map(path => readFile(path, 'utf8')));
const styles = outputFiles.find(file => file.path.endsWith('.css')).text + '\n/*!\n' + fontLicenses.join('\n\n') + '\n*/';
const template = await readFile('src/index.html', 'utf8');
const page = template
  .replace('/* bundled styles */', () => styles)
  .replace('/* bundled application */', () => script.replace(/<\/script/gi, '<\\/script'));

await mkdir('dist', { recursive: true });
await writeFile('dist/index.html', page);
await writeFile('dist/.nojekyll', '');
