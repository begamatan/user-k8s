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

Check if deployment success, you can see 2 pods, one for mongodb and another one for user-service
```
jaunty@jackalope:~/work/js/user-k8s$ kubectl get pod
NAME                                  READY   STATUS    RESTARTS   AGE
mongodb-deployment-774c9dbc86-vp9lc   1/1     Running   0          37s
user-api-5b785c874c-r4bk9             1/1     Running   0          27s
```

# Usage
User Service is exposed at port 30000 using NodePort Service type

Default admin role user:
```
username: admin
password: admin
```
Default user role user:
```
username: user
password: user
```

Authentication token is passed with header `x-access-token`

Postman docs with response examples for each status (unauthenticated, success, unauthorized, etc)
```
https://documenter.getpostman.com/view/17141422/VVBZQPUi
```

Please see [docs](https://github.com/begamatan/user-k8s/tree/main/docs) directory inside this repository for more information about API flowchart and postman collection
