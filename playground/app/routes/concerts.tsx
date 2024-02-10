import React from 'react'
import { Outlet } from 'react-router-dom'

export function Component() {
  return (
    <>
      <h1>concerts layout</h1>
      <Outlet />
    </>
  )
}
