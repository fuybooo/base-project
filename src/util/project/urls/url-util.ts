export interface IUrl {
  url: string
  prefix?: string
  isStatic?: boolean
  staticPath?: string
}

export const staticPath = '/mock/'
export declare type urlType = string | IUrl
export const prefix = {
  demo: 'demo/',
  base: 'login/',
}


