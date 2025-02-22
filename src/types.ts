export interface Options {
  appDirectory: string
  lazy?: 'always' | 'suffix'
}

export interface Route {
  index?: boolean
  path?: string
  lazy?: string
  spread?: string
  children?: Route[]
}
