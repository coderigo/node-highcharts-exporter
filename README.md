node-highcharts-exporter
========================

[![Build Status](https://travis-ci.org/coderigo/node-highcharts-exporter.png?branch=master)](https://travis-ci.org/coderigo/node-highcharts-exporter)

  A basic [Node.js](http://nodejs.org) [Highcharts](http://www.highcharts.com/) export module for converting the SVG sent by Highcharts's [export module](http://www.highcharts.com/docs/export-module/export-module-overview) into `svg` (i.e. unaltered), `jpeg`, `png`, or `pdf`.

## Usage

  In your node app file:

```js
// Assume this is executed inside the POST handler for a server
// running on http://localhost:3000/export
var nhe = require('node-highcharts-exporter');
nhe.exportChart(highchartsExportRequest, function(error, exportedChartInfo){
    if(error){
        console.log('Uh oh!',error.message);
        // Can send error message back to client
    } else{
        console.log('Exported chart. Here are the deets:', exportedChartInfo);
        // Can send exported chart back to client here. The chart's
        // path is in exportedChartInfo.filePath
    }
});
```
  In your client-side Highcharts code:
```js
new Highcharts.Chart({
    // some chart options
    exporting:{
        url: 'http://localhost:3000/export'
    }
    // more chart options
});
```

## Demo

  Start a server:

    $ cd example;     // The example directory inside this module
    $ npm install;    // Installs demo dependencies
    $ node server.js; // Start the demo server listening on 'http://localhost:3000'

  Now open `example/demo.html` in the browser and export the demo chart to any format.


## Installation

  One of its dependencies is *netpbm utilities* for conversion to `jpeg`. As described by [node-netpbm](https://npmjs.org/package/netpbm), this needs some minor setup outside of `npm` and node. At this juncture, `node-netpbm` works on most *nix and OSX OSes, but no guarantees are made for Windows. It's not the end of the game, however, if you're running this on Windows and it doesn't work if your use case can do without `jpeg` exporting as it should work with `png` and `pdf` still. On OSX, a simple `brew install netpbm` takes care of the installation. After that, you can proceed to:

    $ npm install -g node-highcharts-exporter

## Methods

  * **exportChart(exportRequest, callback)**: `exportRequest` is the request `POST`ed by Highcharts as described [here](http://www.highcharts.com/docs/export-module/export-module-overview). `callback` is a function with two parameters `error` and `exportedChartInfo` as below:

```js
    // error object
    {
        message : 'Some error'
    }

    // exportedChartInfo object
    {
        fileName  : 'myChart',     // The name of the chart
        file      : 'myChart.png', // The name of the chart plus its extension
        type      : 'png',         // The type of file (png,svg,pdf,jpeg)
        parentDir : 'path/to/processingDir/exportRequestHash', // The directory where the file has been stored
        filePath  : 'path/to/processingDir/exportRequestHash/myChart.png' // Absolute path to exported chart
    }
```

  * **config.set(configPropertyName, configPropertyValue)** and **config.get()**: Setter and getter for config object. The getter returns the entire config object. At the moment, the config object is simply:

```js
    {
        processingDir : 'defaults/to/directory/of/this/module' // If doesn't exist, will be created.
    }
```

## Limitations

* Handles only `SVG`, not `JSON` for rendering server-side like other solutions out there.
* Does exporting a quick and dirty way by converting everything that is not `SVG` to `PNG` first then to `PDF` or `JPEG`.

## To-dos

* Handle chart sizes neatly to fit into PDF (if too big at the moment they'll get truncated)
* Make an `exportChartSync` (if there is interest. It's hard with dependencies only having async methods themselves)
* Enable a logging scheme (?)
* Investigate JSON-based server-side rendering as an option
