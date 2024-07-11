// optional page, can used as layout or for protect

import React from 'react'
import { Outlet } from 'react-router-dom'

export default function Component() {
  return (
    <>
      <h1>test for first page</h1>
      <Outlet />
    </>
  )
}
