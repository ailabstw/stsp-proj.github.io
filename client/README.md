## 紀錄
+ 在 /src/http/index.js 裡面改 api ip
+ Token 的設定與存在會影響到重新導向
+ 在 auth.js 裡面要正確設定 Token 的值才不會影響到導向。
+ SideNav 的值在 asyncRouterMap 裡面
+ 一個 child 等於沒有 child

## TodoList
+ Alert 可以用漂亮的版本，但是要找一下在哪裡
+ Timezone 要改成 +8
+ 上傳要反過來排序
+ 資料庫列表不會 reload
+ Usagyuuun 不能動

## Getting started

```bash
# clone the project
git clone git@gitlab.com:0511/ailabs-client.git

# install dependency
yarn

# develop
yarn run dev
```

This will automatically open http://localhost:9527.

## Build
```bash
# build for test environment
yarn run build:sit

# build for production environment
yarn run build:prod
```

## Advanced
```bash
# --report to build with bundle size analytics
yarn run build:prod --report

# --preview to start a server in local to preview
yarn run build:prod --preview

# lint code
yarn run lint

# auto fix
yarn run lint -- --fix
```


[vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)

Copyright (c) 2017-present PanJiaChen