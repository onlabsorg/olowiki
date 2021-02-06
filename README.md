# olowiki

**olowiki** is an [olojs-cli] plugin that contains a store server allowing you
to render and edit your olojs documents in the browser.


### Getting started
First you need to install the [olojs-cli] and create a document package:

```
npm install -g @onlabsorg/olojs-cli
cd /path/to/my-library
olojs init
```

Then you can install this plugin:

```
olojs install @onlabsorg/olowiki
```

Once olowiki is installed, you can serve the library as follows:

```
olojs run olowiki
```

This will start a server listening on port 8010 (customize the port with
-p &lt;port-number&gt;). Now you can manage your library in the browser by
visiting the url:

```
http://localhost:8010/#/path/to/doc
```  

> The URL hash is interpreted as a document ID, therefore it can also contain
> document arguments. For example: #/path/to/doc?x=10;y=20;z=30


### License
[MIT](https://opensource.org/licenses/MIT)


### Related projects
* [olojs-cli] is a command-line interface written in NodeJS that allows you to
  create and mange local olojs document repositories.
* [olojs](https://github.com/onlabsorg/olojs) is a content management system
  based on a distributed network of documents having the following properties.


[olojs-cli]: https://github.com/onlabsorg/olojs-cli/blob/main/README.md
