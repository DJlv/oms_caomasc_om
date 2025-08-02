# 开发环境外部依赖一键启动

## 启动命令
```bash
docker-compose up -d
```

## 关闭命令
```bash
docker-compose down
```

## 服务说明
- Nacos: http://localhost:8848
- Redis: localhost:6379
- RabbitMQ: http://localhost:15672 (guest/guest)
- MySQL: localhost:3306 (root/123456)


## 错误问题
```agsl
unable to get image 'mysql:8.0': error during connect...
```
原因：  
你的 Docker Desktop 没有启动，或者 Docker Desktop 没有开启 Linux 容器引擎。  
解决方法：  
确保 Docker Desktop 已经启动  
在 Windows 下，点击开始菜单，找到 Docker Desktop，启动它。  
等待 Docker Desktop 右下角变成绿色小鲸鱼图标。  
确保 Docker Desktop 运行在 Linux 容器模式  
右键 Docker Desktop 图标，选择“Switch to Linux containers”（如果当前是 Windows containers）。  
绝大多数镜像（如 nacos、mysql、redis）都需要 Linux 容器模式。  
命令行测试 Docker 是否可用  
打开 PowerShell 或 CMD，输入：  
Apply  
Run  
如果能正常显示 Docker 信息， 说明 Docker 已经启动。  
重新执行 docker-compose 命令  
在 env-starter 目录下再次运行：  
Apply  
Run  



docker exec -it mysql bash
mysql -uroot -p123456
ALTER USER 'root'@'%' IDENTIFIED BY '123456';
FLUSH PRIVILEGES;
