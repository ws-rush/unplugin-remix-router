import React from 'react'
import { Link, useLoaderData } from 'react-router'

export async function clientLoader() {
  // sleep 2 seconds then return data
  await new Promise(resolve => setTimeout(resolve, 2000))
  return ['Note 1', 'Note 2', 'Note 3']
}

export default function Component() {
  const notes = useLoaderData() as string[]

  return (
    <>
      <h1>Notes</h1>
      {notes.map(note => <p key={note}>{note}</p>)}
      <Link to="/">Back to main</Link>
    </>
  )
}
