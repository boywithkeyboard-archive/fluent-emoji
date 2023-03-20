import React from 'react'

function createComponent(name, base64) {
  return ({ src, alt, ...rest }) => (
    <img
      src={`data:image/png;base64,${base64}`}
      alt={name}
      {...rest}
    />
  )
}
