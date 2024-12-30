# To run with docker compose

Build image in sensor-consumer project main directory.
```
docker build -t sensor-dashboard-dev .
```
Modify the `compose.yaml` file to set API_URL.

Run the docker compose file in the main directory.
```
docker compose up -d
```

## Login
The base login and password is admin:admin
### Configure your own login and password
https://docs.nginx.com/nginx/admin-guide/security-controls/configuring-http-basic-authentication/
1. Delete password file .htpasswd
2. Create a new password file
```
sudo htpasswd -c .htpasswd admin
```
3. Make sure the password file is in the same directory as the compose file and you are done.


## If you want an image file 
Save image in tar file
```
docker save sensor-dashboard-dev > sensor-dashboard-dev.tar
```