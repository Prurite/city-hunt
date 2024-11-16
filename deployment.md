# 从零开始部署 Cityhunt 前后端 - 2024F

System: Ubuntu 24.04 LTS

1. Clone github repository. Here we assume they're cloned to `~`:

```
cd ~
sudo apt update
sudo apt install -y  git
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
ulimit -f unlimited -t unlimited -v unlimited -l unlimited -n 64000 -m unlimited -u 64000
sudo systemctl enable mongod
sudo systemctl start mongod
```

4. Import user list

   - Create a `users.csv` file, with columns `uid` ,`password`, `type`. `type` can be `admin` or `user`.

   - Install python and requirements.

     ```
     sudo apt install -y python3-full
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
            proxy_pass http://127.0.0.1:3001/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "Upgrade";
            proxy_read_timeout 600s;
        }
        
        location /images/ {
            alias /root/cityhunt-images/;
        }

        location / {
            root /root/cityhunt-react;
            index index.html;
            try_files $uri $uri/ /index.html =404;
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

   - Run the backend

     ```
     yarn global add pm2
     cd /root/city-hunt-backend
     pm2 start ./app.js
     ```
