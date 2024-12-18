# 从零开始部署 Cityhunt 前后端 - 2024F

System: Ubuntu 24.04 LTS

The following commands are assumed to be run as `ubuntu` user. It is suggested to setup a proxy to global Internet before starting.

1. Clone github repository. Here we assume they're cloned to `~`:

```
cd ~
sudo apt update
sudo apt install -y git
git clone https://github.com/Prurite/city-hunt-backend
git clone https://github.com/Prurite/city-hunt
```

2. Install node js (v22.11.0 LTS) and yarn

```
# installs nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
logout
```

```
# download and install Node.js (you may need to restart the terminal)
nvm install 22
# verifies the right Node.js version is in the environment
node -v # should print `v22.11.0`
# verifies the right npm version is in the environment
npm -v # should print `10.9.0`
corepack enable
```

3. Install MongoDB(v8.0)

```
sudo apt install -y gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg \
   --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo bash -c "ulimit -f unlimited -t unlimited -v unlimited -l unlimited -n 64000 -m unlimited -u 64000"
sudo systemctl enable mongod
sudo systemctl start mongod
```

4. Import user list

   - Create a `users.csv` file, with columns `uid` ,`password`, `type`. `type` can be `admin` or `user`.

   - Install python and requirements.

     ```
     sudo apt install -y python3-full python3-pip
     sudo mv /usr/lib/python3.12/EXTERNALLY-MANAGED /usr/lib/python3.12/EXTERNALLY
     -MANAGED.old
     pip3 install pymongo
     ```

   - Put the `users.csv` within the `city-hunt-backend` folder, and run the import script.

     ```
     cd ~/city-hunt-backend
     python3 ./import_users.py
     ```

5. Setup frontend app

   In the `city-hunt` folder:

   - Create `config.json` from `config_example.json`
   - Build frontend app and copy the artifacts

   ```
   yarn
   yarn build
   mv build ~/cityhunt-react
   ```

6. Put all images to `~/cityhunt-images`.
7. Set up nginx

```
sudo chmod -R 755 ~/cityhunt-react
sudo apt install -y nginx
```

And put the following in `/etc/nginx/nginx.conf`:

```
# Change the locations if necessary

# For more information on configuration, see:
#   * Official English Documentation: http://nginx.org/en/docs/
#   * Official Russian Documentation: http://nginx.org/ru/docs/

user root;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

# Load dynamic modules. See /usr/share/doc/nginx/README.dynamic.
include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 1024;
}

http {
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 2048;
    client_max_body_size 10M;
    gzip on;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    # Load modular configuration files from the /etc/nginx/conf.d directory.
    # See http://nginx.org/en/docs/ngx_core_module.html#include
    # for more information.

    include /etc/nginx/conf.d/*.conf;

    server {
        # listen 443 ssl http2;
        # listen [::]:443 ssl http2;
        listen       80;
        listen       [::]:80;
        # ssl_certificate     /etc/ssl/cert.pem;
        # ssl_certificate_key /etc/ssl/key.pem;
        server_name cityhunt.sieako.com;

        location /api/ {
            # Remove /api/ prefix when forwarding to backend
            rewrite ^/api/(.*) /$1 break;
            proxy_pass http://127.0.0.1:3001;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "Upgrade";
            proxy_read_timeout 600s;

            # By default, don't cache anything
            add_header Cache-Control "no-store, no-cache, must-revalidate";

            # Cache jpg images for 1 year
            location ~ \.jpg$ {
                rewrite ^/api/(.*) /$1 break;
                proxy_pass http://127.0.0.1:3001;
                add_header Cache-Control "public, max-age=31536000";
            }
        }
        
        location /images/ {
            alias /home/ubuntu/cityhunt-images/;
            add_header Cache-Control "public, max-age=31536000, immutable";
        }

        location / {
            root /home/ubuntu/cityhunt-react;
            index index.html;
            try_files $uri $uri/ /index.html =404;
            add_header Cache-Control "no-cache, no-store, must-revalidate";
        }
    }
}
```

```
sudo service nginx restart
```

6. Run backend

   - Put `TaskList.json` to `city-hunt-backend/TaskList.json`

   - Create `config.json` from `config_example.json`

   - Install dependencies

     ```
     yarn global add pm2
     ```
   
   - Run the backend
   
     ```
     cd /home/ubuntu/city-hunt-backend
     yarn
     pm2 start ./app.js
     ```





问题：检查 sudo；检查用户路径
