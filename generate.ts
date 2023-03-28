import { gray, white } from 'https://deno.land/std@v0.181.0/fmt/colors.ts'
import { ensureDir } from 'https://deno.land/std@v0.181.0/fs/ensure_dir.ts'
import { log } from 'https://deno.land/x/drgn@v0.10.2/mod.ts'
import { getEmojis } from './getEmojis.ts'

await ensureDir('./emojis')

let workers: Worker[] = []
let threads = 10

while (threads--) {
  workers = [
    new Worker(new URL('./worker.ts', import.meta.url).href, {
      type: 'module',
    }),
    ...workers,
  ]
}

const emojis = await getEmojis()

const amountOfEmojis = emojis.length
let emojisProcessed = 0

for (const worker of workers) {
  worker.onmessage = async () => {
    emojisProcessed++

    await log(
      gray(
        `downloading emojis... ${
          white(`${Math.round((emojisProcessed / amountOfEmojis) * 100)}%`)
        }`,
      ),
      { clear: true },
    )
  }
}

threads = 10

let workerNumber = 0

while (emojis.length > 0) {
  const chunk = emojis.splice(0, Math.round(amountOfEmojis / threads) + 1)

  if (workerNumber === 10) {
    workerNumber = 0
  }

  workers[workerNumber].postMessage({
    emojis: chunk,
  })

  workerNumber++
}
