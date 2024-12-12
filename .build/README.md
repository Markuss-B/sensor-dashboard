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

## If you want an image file 
Save image in tar file
```
docker save sensor-dashboard-dev > sensor-dashboard-dev.tar
```