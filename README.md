To get this to work :

You'll need to install the node deps with
	
	npm install

You will also need :

	- [browsermob-proxy](http://bmp.lightbody.net/)
	- [selenium server](http://docs.seleniumhq.org/download/)

Then you'll need to start both. index.js is expecting selenium to be running on port 4444 and browsermob-proxy to be running on 8080, which is the default right now, but you never know!

	$ java -jar ./selenium-server-standalone-<VERSION>.jar 

	$ sh browsermob-proxy

This will expose 2 functions: 

- internMob.setupBrowsermob() - wraps the intern suite setup to setup the proxy before the session is created, thus allowing tests to go through the proxy - call this from your test's module definition
- internMob.addGetHAR(remote);  - adds a getHAR function to the remote, which can be used to verify requests and anything else the HAR provides in your test.