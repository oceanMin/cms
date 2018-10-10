# express 快速开始

## 环境准备
- node.js环境 版本v7.6以上
    - 直接安装node.js 7.6：node.js官网地址[https://nodejs.org](https://nodejs.org) 
    - nvm管理多版本node.js：可以用nvm 进行node版本进行管理
        - Mac系统安装nvm [https://github.com/creationix/nvm#manual-install](https://github.com/creationix/nvm#manual-install)
        - windows系统安装nvm [https://github.com/coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows)
        - Ubuntu系统安装nvm [https://github.com/creationix/nvm](https://github.com/creationix/nvm)
- npm 版本3.x以上 



## 快速开始

### 安装express
```sh
# 初始化package.json
npm init

# 安装express
npm install express

```

### hello world 代码

```js
const express = require('express')
const app = new express()

app.get('/',function(req,res){
    res.send('index');
})

app.listen(3000)
console.log('server is starting at port 3000')
```

### 启动demo

```sh
node app.js
```

访问[http:localhost:3000](http:localhost:3000)，效果如下

index

