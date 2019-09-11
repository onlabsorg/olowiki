You can install and run olowiki on your server in a few steps.

First of all you install the `olowiki` command line interface.

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

The `olowiki init` command creates a configuration files and the three directories
`doc`, `lib` and `users` where your node documents will be stored as plain text
files. 

You are almost done. In order to complete the setup of your node, you need to provide the configuration parameters of a SMTP server that olowiki will use to 
send identity tokens to your users.

```
olowiki set-smtp <host> <port> <user> <password>
```

>   Olowiki uses [Nodemailer](https://nodemailer.com/about/) to send emails.
>   The `olowiki set-smtp` command creates an `email` field in your `olowiki.json`
>   configuration file, which is the `options` parameter passed to
>   [nodemailer.createTransport](https://nodemailer.com/smtp/). If your mail
>   server needs more advanced configuration (e.g. gmail), you can edit the
>   `email` object directly in `olowiki.json`.

If you have followed all the previous steps, you are ready to start your
olowiki node

```
olowiki start <port>
```
