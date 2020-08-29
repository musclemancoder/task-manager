# task-manager
This is a node js based API
https://vcmyself-task-manager.herokuapp.com/
Uses:-

Middleware , Router , Model , Email , JWT , Test Cases

It Consists of two modules:

1.User
2.Task

User Module:-

All REST CURD Operation with File Upload and JWT Token

Task :-

ALL REST CURD with relationship to USER Model


To Run this project 

You need to create "Config" Folder with two ENV files

dev.env
PORT = 3000
SEND_GRID_API_KEY="SendGridAPIKeyForMailShoot"
JWT_SECRET="AnyRandomKeyYouWant"
MONGODB_URL="mongodb://127.0.0.1/task-manager-api"

test.env

PORT = 3000
SEND_GRID_API_KEY="SendGridAPIKeyForMailShoot"
JWT_SECRET="AnyRandomKeyYouWant"
MONGODB_URL="mongodb://127.0.0.1/task-manager-api-test"
