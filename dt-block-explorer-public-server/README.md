# Deploy Instructions

- Create a .env file in the root folder with the following properties

  - API_URL (defaults to http://54.84.189.173:8545) - api endpoint for dtc
  - MONGO_URL (defaults to mongodb://localhost:27017/prod) - change it with a valid mongodb endpoint OR see below

- Setting up mongodb

  - If a local mongodb instance is used (under no circumstance open port 27017 publicly or let it through the firewall)
  - `sudo apt update && sudo apt install mongodb`
  - `sudo mongod`
  - If an external mongodb instance is used, change the MONGO_URL in the .env file

- To install nodejs and run the server:

  - `curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -`
  - `sudo apt install -y nodejs`
  - `sudo npm i -g pm2 yarn`
  - in the servers directory,
    - `yarn`
    - `yarn build`
    - `pm2 start bin`

- Configuring nginx

  - `sudo apt install nginx`
  - use vim/nano(any preferred text editor) to edit /etc/nginx/sites-enabled/default

    - Replace the part that looks like

    ```
    location / {
        .....
    }
    ```

    with

    ```
    location /
    {
        proxy_pass http://localhost:5000/graphql/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    ```

  - run `sudo systemctl start nginx`
