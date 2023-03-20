self.onmessage = async ({ data }) => {
  for (const { path } of data.emojis) {
    self.postMessage({})

    const camelcaseName = (path as string)
      .toLowerCase()
      .replaceAll('!', '')
      .replaceAll('-', ' ')
      .replace('1st', 'first')
      .replace('2nd', 'second')
      .replace('3rd', 'third')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')

    let response = await fetch(
      `https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/${
        encodeURIComponent(path)
      }/3D/${
        (path === 'O button blood type' ? 'o_button_(blood_type)' : path)
          .replaceAll(' ', '_').toLowerCase()
      }_3d.png`,
    )

    if (response.status === 404) {
      response = await fetch(
        `https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/${
          encodeURIComponent(path)
        }/Default/3D/${path.replaceAll(' ', '_').toLowerCase()}_3d_default.png`,
      )
    }

    Deno.writeFile(
      `./emojis/${camelcaseName}.png`,
      new Uint8Array(await response.arrayBuffer()),
    )
  }

  self.close()
}
