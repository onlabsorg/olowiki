# olowiki

This is a wiki based on [olojs] documents.

![olowiki screenshot](./docs/screenshot.png)

If you want to use olowiki, you have a few options:

* Use the stand-alone application, which runs entirely in the browser
* Add olowiki to [stilo] as plugin and execute `stilo run wiki` at the command line
* Create your own custom version of olowiki in JavaScript

Let's explore each of these options.

### Standalone web app
You can run olowiki in your browser by visiting [https://www.onlabs.org/olowiki/dist].

The standalone version of olowiki:
* stores files in the browser storage
* allows you to download your documents to your computer
* allows you to render external documents via HTTP(s)
* allow your documents to import external documents via HTTP(s)

### The stilo plugin
You can install olowiki as [stilo] plugin and use it to edit your local 
olojs repository in the browser. To do so, first you need to install stilo and 
create a document repository:

```
npm install -g @onlabsorg/stilo
cd /path/to/my-library
stilo init
```

Then you can add the olowiki plugin to your package:

```
stilo install @onlabsorg/olowiki
```

Once olowiki is installed, you can serve the library as follows:

```
stilo run wiki
```

You can now render and edit the olojs documents contained in `/path/to/my-library`
in the browser at `http://localhost:8010/#/path/to/doc`.

> The URL hash is interpreted as a document ID, therefore it can also contain
> document arguments. For example: #/path/to/doc?x=10;y=20;z=30


### Create a custom olowiki server
Another way to use olowiki is by creating a custom wiki server in JavaScript.
First install olojs and olowiki:

```
npm install @onlabsorg/olojs
npm install @onlabsorg/olowiki
```

Then create an olojs store:

```js
olojs = require('@onlabsorg/olojs');
store = new olojs.FileStore('/path/to/store/directory');    // it can be any store type, not just a FileStore
```

Then create and start the olowiki server:

```js
olowiki = require('@onlabsorg/olowiki');

server = olowiki.createServer(store);

server.listen(8010, () => {
    console.log('olowiki server listening on port 8010');
});
```

You can now render and edit the olojs documents contained in `/path/to/store/directory`
in the browser at `http://localhost:8010/`.


### License
This software is released under the [ISC](https://opensource.org/licenses/ISC) 
license.


### Related projects
* [stilo] is a command-line interface written in NodeJS that allows you to
  create and mange local olojs document repositories.
* [olojs] is a content management system based on a distributed network of 
  documents having the following properties.

[olojs]: https://github.com/onlabsorg/olojs/blob/master/README.md
[stilo]: https://github.com/onlabsorg/stilo/blob/main/README.md
