import React from 'react'

function createComponent(name, base64) {
  return ({ src, alt, loading, ...rest }) => (
    <img
      src={`data:image/png;base64,${base64}`}
      loading={loading ?? 'lazy'}
      alt={name}
      {...rest}
    />
  )
}
