# TinyTodo

> 本项目前端使用 Vue 和 Element-UI，服务端使用 Koa2 + Mongoose 开发。运行前请自行安装最新版本的 nodejs 和 MongoDB 并启动 MongoDB服务。

> 本项目线上地址 https://chderon.oicp.io

## 项目前端基于Vue官方手脚架Vue CLI开发

node.js安装完毕后在命令行运行 `npm install -g vue` 来全局安装Vue CIL

## 安装依赖

node.js和Vue安装完毕后在本目录运行 `npm install` 来进行本项目的依赖安装

## 项目运行

依赖安装完成后在本目录运行 `npm run dev`，前端页面将在 http://localhost:8080 运行，在本目录运行 `node ./server/app.js` 服务器将在 http://localhost:1030 运行，运行服务器前请确保 `MongoDB` 服务已经运行。

## 项目目录

- `build`：Vue 和 Webpack 相关配置目录
- `config`：dev 环境和 prod 环境配置目录
- `server`：项目服务端目录
  - `./config`： 服务端配置目录
  - `./controllers`：服务端控制器目录
  - `./models`：服务端数据库 model 目录
  - `./routers`：服务端路由目录
  - `./app.js`: 服务端入口文件，运行该文件可启动服务端
- `src`：项目前端目录
  - `./assets`：前端静态资源目录
  - `./components`：前端组件目录
  - `./router`：前端路由目录

