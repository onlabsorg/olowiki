# olowiki

This is a wiki based on [olojs] documents.

![olowiki screenshot](./docs/screenshot.png)


### Getting started
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


### Install olowiki as olojs-cli plugin
Instead of creating your own server in javascript, you can also use olowiki as
an [olojs-cli] plugin. First you need to install olojs-cli and create a document 
package:

```
npm install -g @onlabsorg/olojs-cli
cd /path/to/my-library
olojs init
```

Then you can add the olowiki plugin to your package:

```
olojs install @onlabsorg/olowiki
```

Once olowiki is installed, you can serve the library as follows:

```
olojs run wiki
```

You can now render and edit the olojs documents contained in `/path/to/my-library`
in the browser at `http://localhost:8010/#/path/to/doc`.

> The URL hash is interpreted as a document ID, therefore it can also contain
> document arguments. For example: #/path/to/doc?x=10;y=20;z=30


### License
[MIT](https://opensource.org/licenses/MIT)


### Related projects
* [olojs-cli] is a command-line interface written in NodeJS that allows you to
  create and mange local olojs document repositories.
* [olojs] is a content management system based on a distributed network of 
  documents having the following properties.

[olojs]: https://github.com/onlabsorg/olojs/blob/master/README.md
[olojs-cli]: https://github.com/onlabsorg/olojs-cli/blob/main/README.md
