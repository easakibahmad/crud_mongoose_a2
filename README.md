# crud_mongoose_a2

# to run application locally

1. npm run build (for build)
2. npm start / npm start (that can start the project )
3. This information is from my package.json file. You can clearly understand it by reviewing this:
   {"start:prod": "node ./dist/server.js",
   "start": "node ./dist/server.js",
   "start:dev": "ts-node-dev --respawn --transpile-only ./src/server.ts", "build": "tsc",}

# project setup(part 1)

1. npm initialization
2. mongoose, express, typescript, dotenv, cors installation
3. tsc initialization (root and source directory setup)
4. dotenv configuration folder
5. connect with mongodb
6. typescript declaration file installation for express and cors

# project setup(part 2)

ts-node-dev installation

# mongoose

1. create interface file for user
2. create model file for user to apply schema
3. schema declared
4. controller file
5. service file
6. route file

# api

1. create new user api
2. retrieve all users api
3. get single user api
4. single user deleting api
5. updating user data api
6. api for user order push in orders array
7. get user orders api
8. get total price of user orders api

# static

1. static method to check user exists or not
