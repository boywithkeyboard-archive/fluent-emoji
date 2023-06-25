import { ensureDir } from 'https://deno.land/std@0.192.0/fs/ensure_dir.ts'
import { build, stop } from 'https://deno.land/x/esbuild@v0.18.8/mod.js'
import { getEmojis } from './getEmojis.ts'

let imports = ''
let types = `import * as React from 'react'\n\n`
const exports = []
let components = await Deno.readTextFile('./createComponent.txt') + '\n\n'

await ensureDir('cache')

const emojis = await getEmojis()

for (const emoji of emojis) {
  const name = (emoji.path as string)
    .toLowerCase()
    .replaceAll('!', '')
    .replaceAll('-', ' ')
    .replace('1st', 'first')
    .replace('2nd', 'second')
    .replace('3rd', 'third')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')

  imports += `import src_${name} from '../emojis/${name}.png'\n`
  types +=
    `declare function ${name}(props: React.ImgHTMLAttributes<HTMLImageElement>): React.ReactElement\n`
  components +=
    `export const ${name} = createComponent('${name}', src_${name})\n`
  exports.push(name)
}

await Deno.writeTextFile(
  './cache/index.tsx',
  imports + components,
)

await build({
  entryPoints: ['./cache/index.tsx'],
  allowOverwrite: true,
  format: 'esm',
  bundle: true,
  minify: true,
  target: 'es2020',
  external: ['react'],
  loader: {
    '.png': 'base64',
  },
  outfile: './index.js',
})

await Deno.writeTextFile(
  './index.d.ts',
  types + `\nexport { ${exports.join(', ')} }`,
)

stop()
