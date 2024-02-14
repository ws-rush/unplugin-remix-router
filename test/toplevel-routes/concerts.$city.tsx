import React from 'react'

export async function loader() {
  return 'loader'
}

export async function action() {
  return 'action'
}

export function Component() {
  return <h1>Dynamic</h1>
}
