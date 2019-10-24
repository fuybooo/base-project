import {Pattern} from '@/model/common/models'
import {defaultPageTitleMap} from '@/model/project/models'

export function getPageTitle (pattern: Pattern, pageTitle: any = defaultPageTitleMap, pageTitleMap: any = defaultPageTitleMap) {
  if (typeof pageTitle === 'string') {
    if (pattern === 'view') {
      return pageTitle + pageTitleMap[pattern]
    }
    return pageTitleMap[pattern] + pageTitle
  } else {
    return pageTitleMap[pattern]
  }
}
