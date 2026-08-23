# 构建
FROM node:20 AS build

WORKDIR /app
COPY . .

# RUN rm -rf package-lock.json
# RUN rm -rf node_modules
RUN npm i
RUN npm run build:test

# 运行
FROM nginx
COPY --from=build /app/dist /usr/share/nginx/html

# 复制配置文件
COPY conf/default.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动
ENTRYPOINT ["nginx", "-g", "daemon off;"]
