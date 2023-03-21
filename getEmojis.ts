export async function getEmojis() {
  const result = await fetch(
    'https://api.github.com/repos/microsoft/fluentui-emoji/git/trees/main',
  )

  const json = await result.json()

  const sha =
    // deno-lint-ignore no-explicit-any
    (json.tree as Array<any>).find((item) => item.path === 'assets').sha

  const emojis = await (await fetch(
    `https://api.github.com/repos/microsoft/fluentui-emoji/git/trees/${sha}`,
  )).json()

  return emojis.tree as { path: string; [key: string]: unknown }[]
}
