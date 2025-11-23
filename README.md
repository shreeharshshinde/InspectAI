You have successfully created an Atlassian Plugin!

Here are the SDK commands you'll use immediately:

* atlas-run   -- installs this plugin into the product and starts it on localhost
* atlas-debug -- same as atlas-run, but allows a debugger to attach at port 5005
* atlas-help  -- prints description for all commands in the SDK

Full documentation is always available at:


### In root directory
```
atlas-mvn clean install -U
atlas-run
```

### In Backend directory
* Make `.env` file
* copy paste content of `envExample.txt` to `.env`
```
npm install
npm run dev
```

### In Frontend directory
* Make `.env` file
* copy paste content of `envExample.txt` to `.env`
```
npm install
npm start
```

### Guide for Atlassian 
https://developer.atlassian.com/display/DOCS/Introduction+to+the+Atlassian+Plugin+SDK
