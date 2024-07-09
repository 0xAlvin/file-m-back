#!/bin/bash


sudo apt update
sudo apt install -y curl gnupg2 wget

echo "Installing Redis..."

wget -qO- https://download.redis.io/redis-stable.tar.gz | tar xvz
cd redis-stable
make
sudo make install
cd utils
sudo ./install_server.sh

echo "Redis installed successfully."

echo "Installing MongoDB..."

wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -

echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list

sudo apt update
sudo apt install -y mongodb-org

sudo systemctl start mongod
sudo systemctl enable mongod

echo "MongoDB installed successfully."

cd ..
rm -rf redis-stable

echo "Setup complete!"
