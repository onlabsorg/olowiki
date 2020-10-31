# olowiki

**olowiki** is an [olojs](https://github.com/onlabsorg/olojs/blob/master/README.md)
plugin that brings an environment server allowing you to render and edit your
olo-documents in the browser.


### Getting started
First you need to install the [olojs-cli](https://github.com/onlabsorg/olojs-cli/blob/main/README.md)
and create a libray:

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
olojs serve -t @onlabsorg/olowiki/server
```

This will start a server listening on port 8010 (customize the port with 
-p <port-number>).
At this point you can manage your library in your browser by visiting the url:

```
http://localhost:8010/#/home/path/to/doc
```  
  
# MIT License

Copyright (c) 2017 OnLabs.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
