You can install and run olowiki on your server in a few steps.

First of all you should install the `olowiki` command line interface.

```
npm install -g @onlabsorg/olowiki
```

Then create the folder that will contain your node's documents and
initialize the instance.

```
mkdir <your-olowiki-node-folder>
cd <your-olowiki-node-folder>
olowiki init <your-email-address>
```

The `olowiki init` command creates a configuration file named `olonv.js` and the 
three directories `doc`, `lib` and `users` where your node documents will be 
stored as plain text files. 

You are almost done. In order to complete the setup of your node, you need to provide 
the configuration parameters of a SMTP server that olowiki will use to 
send identity tokens to your users. To do that open the `olonv.js` file in your
favorite editor and fill-in the missing parameters of the `dispatch` function.

If you have followed all the previous steps, you are ready to start your
olowiki node

```
olowiki start <port>
```
