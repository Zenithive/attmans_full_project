/ Redis setup in ubuntu //


1.step : sudo apt update && sudo apt upgrade -y

2.step : sudo apt install redis-server -y

3.step : sudo systemctl start redis

4.step : sudo systemctl enable redis

5.step : sudo systemctl status redis

6.step : sudo nano /etc/redis/redis.conf

7.step : changes : bind 0.0.0.0 { requirepass your-strong-password }

8.step : sudo systemctl restart redis

9.step : redis-cli

10.step : ping = pong
