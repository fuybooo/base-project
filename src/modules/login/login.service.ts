import {sc} from '@/util/common/fns/fns'
import {KEY_TOKEN, KEY_USERNAME, KEY_UID, KEY_TYPE} from '@/model/project/local-storage-keys/keys'
import {HttpRes} from '@/model/common/models'

export function login (username: string, password: string) {
  // @ts-ignore
  const me = this
  me.$req(me.$urls.login.login, {
    username,
    password,
  }).then((res: HttpRes) => {
    if (res.head.errCode === 0) {
      // 设置token 用户信息等
      sc(KEY_TOKEN, res.data.token)
      sc(KEY_UID, res.data.uid)
      sc(KEY_USERNAME, username)
      sc(KEY_TYPE, res.data.type)
      me.$success(me.$t('login.tip.loginSuccess') as string)
      me.$router.push({name: 'main'})
    }
  })
}
