node-highcharts-exporter
========================

A basic Node.js Highcharts export server converting SVG into PDF, PNG, or JPEG. It is intended to simply convert the SVG Highcharts sends the server on chart export into any of the formats: `svg, jpeg, png, or pdf`.

# Demo
1. Run the server with `node server.js`
2. Open `demo.html` in the browser

# Installation and running
1. Requires *netpbm utilities* as described by [node-netpbm](https://npmjs.org/package/netpbm). On OSX, a simple `brew install netpbm` took care of the installation.
2. `npm install` to install all the dependencies
3. `node server.js` to start the server. Change the port from 3000 as you wish.

# Limitations
* Handles only SVG, not JSON for rendering server-side like other solutions out there.
* Does exporting a quick and dirty way by converting everything that is not SVG to PNG first then to PDF or JPEG.

# To-dos
* Write tests of some sort
* Enable a logging scheme
* General refactoring, especially to prevent an error in one request stabbing the server in the neck.
* Investigate JSON-based server-side rendering as an option