import {ProRouteConfig} from '@/model/project/route/route.model'

export function getNeedNotTokenRouter (router: ProRouteConfig | ProRouteConfig[]): ProRouteConfig | ProRouteConfig[] {
  const routerIsArray = Array.isArray(router)
  if (!routerIsArray) {
    // @ts-ignore
    router = [router]
  }
  // @ts-ignore
  router = (router as ProRouteConfig[]).map((item: ProRouteConfig) => {
    return {
      ...item,
      meta: {
        ...item.meta,
        needNotToken: true,
      },
      ...(item.children ? {children: getNeedNotTokenRouter(item.children)} : {}),
    }
  })
  // @ts-ignore
  return routerIsArray ? router : router[0]
}
