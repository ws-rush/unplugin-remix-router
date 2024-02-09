import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { routes } from 'virtual:routes'

const router = createBrowserRouter(routes)
console.log(routes)
createRoot(document.getElementById('app')!).render(
    <StrictMode>
          <RouterProvider router={router} />
    </StrictMode>
)
