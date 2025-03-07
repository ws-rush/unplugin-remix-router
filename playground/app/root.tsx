import React from 'react'
import { Outlet } from 'react-router'

async function clientLogger({ request }: any, next: any) {
  const start = performance.now()

  // Run the remaining middlewares and all route loaders
  await next()

  const duration = performance.now() - start

  // eslint-disable-next-line no-console
  console.log(`Navigated to ${request.url} (${duration}ms)`)
};

export const clientMiddleware = [clientLogger] // client

export default function Page() {
  return <Outlet />
}
