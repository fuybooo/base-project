/**
 * @Description: 操作数组的函数
 * @date 2019-06-27
 */
/**
 * 获取list中目标值
 * @param list 原list
 * @param value 根据value 获取
 * @param key 根据的value对应的key
 * @param destKey 目标key
 * @example 例如：已知 list = [{id: 1, name: '男'}, {id: 2, name: '女'}];
 * 现在要获取id为2时对应的name，可以使用该方法
 */
export function listDestValue (list: any[], value: any, key = 'id', destKey = 'name') {
  if (value === null || value === undefined) {
    return ''
  }
  if (typeof list === 'object' && Object.prototype.toString.call(list).toLowerCase().includes('array')) {
    const destValue = list.find(item => item[key] === value)
    if (destValue) {
      return destValue[destKey]
    }
  }
  return ''
}
