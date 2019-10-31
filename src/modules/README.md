## 2019-10-24
- 所有的业务模块
- mainHeader 中展示菜单
    - 添加新菜单需要做以下事情
        - 【本地】在 public/mock/menu/list.json 中添加对应的数据
        - 【远程】在 对应的表中 中添加对应的数据
        - 路由中添加对应的路由 一般是在这里个文件中加 src/router/main.router.ts
        - 注意 json中的 index字段对应route中的name json中的title对应route中的title
