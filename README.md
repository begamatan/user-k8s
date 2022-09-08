# user-k8s

# Installation
Make sure kubernetes installed, if you're using Docker Desktop and WSL2 you can enable kubernetes from Docker Desktop Setting.

**Notes: I commited .env and all secret config for k8s to make it simpler, in reality we should'nt commit that to repository**

Run the following command inside k8s directory:
```bash
# app secret for jwt
kubectl apply -f app-secret.yaml
# mongo credentials
kubectl apply -f mongo-secret.yaml 
# map mongo service to make it accessible from app
kubectl apply -f mongo-configmap.yaml
# volume persistent and claim so that data won't be destroyed when mongodb restarted
kubectl apply -f mongo-volume.yaml 
# mongodb deployment and service config
kubectl apply -f mongo.yaml 
# user api deployment and service config
kubectl apply -f user-api.yaml 
```

# Usage
User Service is exposed at port 30000 using NodePort Service type
