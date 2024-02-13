export interface Options {
  appDirectory: string
}

export interface Route {
  index?: boolean
  path?: string
  lazy?: string
  spread?: string
  children?: Route[]
}
