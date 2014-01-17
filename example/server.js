'use strict';

// Ye-olde requires
var express = require('express'),
    nhe     = require('node-highcharts-exporter'),
    rmdir   = require('rimraf'),
    server  = express(),
    fs      = require('fs');

// Enable request body parsing
server.use(express.bodyParser());

// Set a custom directory to export charts to
var customExportPath = require('path').dirname(require.main.filename) + '/exported_charts';
nhe.config.set('processingDir', customExportPath);

// The POST handler
// The incoming request has a JSON object with the SVG to convert
server.post('/export', function(request, response){
    var highchartsExportRequest = request.body;
    nhe.exportChart(highchartsExportRequest, function(error, exportedChartInfo){
        if(error){ // Send an error response
            response.send(error);
        }
        else{ // Send the file back to client
            response.download(exportedChartInfo.filePath, function(){
                // Optional, remove the directory used for intermediate
                // exporting steps
                rmdir(exportedChartInfo.parentDir, function(err){});
            });
        }
    });
});

// Start the server and listen for export requests
server.listen(3000, function(){
    console.log('node-highcharts-exporter listening to http://localhost:3000/export');
});