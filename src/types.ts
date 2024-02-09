export interface Options {
  appDirectory: string
}

export interface Node {
  index?: boolean
  path?: string
  lazy?: string
  spread?: string
  children?: Node[]
}