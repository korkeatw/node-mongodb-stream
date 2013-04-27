Nodejs-mongodb-stream
=====================

Streaming data in collection and push to client.


## Installation
* Download Nodejs from http://nodejs.org/. In Ubuntu 13.04 you can install using apt-get

 ```sudo apt-get install nodejs```

* Download source code of this project from https://github.com/khasathan/nodejs-mongodb-stream. However, you can clone by git

 ```git clone https://github.com/khasathan/nodejs-mongodb-stream.git```


## Set up environments

### Nodejs
Install requires modules for this project. you can use NPM (Nodejs Package Manager)
```
npm install
``` 
NPM will be install specific modules in _package.json_ file. After install you should have _node\_modules_ directory.

### MongoDB
Collection we will use MUST BE capped collection so it's use stream feature. You can create capped collection by mongodb command

  ``` db.createCollection('col_name', { capped : true, size : 100000, max : 10 }); ```

Or you want to convert exist collection to capped 

  ```db.runCommand({'convertToCapped' : 'col_name', size : 100000, max : 10 });```
  
Check the collection you create is capped 

  ```db.col_name.isCapped();```

#### options
* **capped (boolean)** set collection to capped
* **size (int)** size of colleciton in byte
* **max (int)** max document in collection

>**NOTE:** The capped collection provide to use in some case like real-time push service. It's NOT used for data storage because old data in capped collection will be deleted automatically. If you want store data, you can insert data into general collection too.
>See MongoDB document about _Capped Collection_ here http://docs.mongodb.org/manual/core/capped-collections


## Running and testing app
* Start Mongodb first
* Running Nodejs server
 
 ```cd nodejs-mongodb-stream
 node app.js```
 
* Open index.html in web browser
* Insert document into MongoDB message should be appear in browser





