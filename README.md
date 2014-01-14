node-highcharts-exporter
========================

  A basic [Node.js](http://nodejs.org) [Highcharts](http://www.highcharts.com/) export server converting SVG into PDF, PNG, or JPEG. It is intended to simply convert the SVG Highcharts sends the server on chart export into any of the formats: `svg, jpeg, png, or pdf`.

## Usage

  In your node app file:
```js
var nhe = require('node-highcharts-exporter');
nhe.exportChart(nhe.exportChart(highchartsExportRequest, function(error, exportedChartInfo){
    // error, if defined returns an error object with a 'message' property
    //
    // exportedChartInfo, is an object with the following structure:
    //
    //  {
    //      fileName  : 'myChart',
    //      file      : 'myChart.png',
    //      type      : 'png',
    //      parentDir : 'directory/holding/chart/',
    //      filePath  : 'directory/holding/chart/myChart.png'
    //  }
});
```
  In your client-side Higcharts code:
```js
new Highcharts.Chart({
    \\ some chart options
    exporting:{
        url: 'http://localhost:3000/export'
    }
    \\ more chart options
};
```

## Installation

  One of its dependencies is *netpbm utilities*. As described by [node-netpbm](https://npmjs.org/package/netpbm), this needs some minor setup outside of `npm` and node. On OSX, a simple `brew install netpbm` took care of the installation. After that, you can proceed to:

    $ npm install -g node-highcharts-exporter

## Limitations

    * Handles only SVG, not JSON for rendering server-side like other solutions out there.
    * Does exporting a quick and dirty way by converting everything that is not SVG to PNG first then to PDF or JPEG.

## To-dos

    * Write tests of some sort
    * Enable a logging scheme
    * General refactoring, especially to prevent an error in one request stabbing the server in the neck.
    * Investigate JSON-based server-side rendering as an option