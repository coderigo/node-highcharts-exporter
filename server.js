var express     = require('express');
var svg2png     = require('svg2png');
var fs          = require('fs');
var pdfkit      = require('pdfkit');
var jpegConvert = require('netpbm').convert;
var crypto      = require('crypto');
var rmdir       = require('rimraf');

var server = express();
server.use(express.bodyParser());

// The POST handler (the incoming request has a JSON object with the SVG to convert)
server.post('/export', function(request, response){

    var exportRequest   = request.body;
    var processingDir   = crypto.createHash('md5').update(Date().toString()+exportRequest.svg).digest('hex') + '/';

    // Exports chart and hands the exported chart to the callback
    var exportChart = function(callback){

        var outputChartName = exportRequest.filename,
            outputFormat    = exportRequest.type.split('/')[1],
            outputExtension = outputFormat == 'svg+xml' ? '.svg' : '.' + outputFormat,
            outputFile      = processingDir + outputChartName + outputExtension,
            basePNGFile     = processingDir + outputChartName + '.png',
            baseSVGFile     = processingDir + outputChartName + '.svg';

        fs.writeFile(baseSVGFile, exportRequest.svg, function(svgErr){
            if(svgErr){
                throw svgErr;
            }
            else{
                if(outputFormat == 'svg+xml'){
                    callback(baseSVGFile);
                }
                else{
                    svg2png(baseSVGFile, basePNGFile, exportRequest.scale, function(err){
                        switch(outputFormat){
                            case 'pdf':
                                var pdf = new pdfkit({size:'A4',layout:'landscape'});
                                pdf.image(basePNGFile,{width : 700})
                                    .write(outputFile, function(){
                                        callback(outputFile);
                                    });
                                break;
                            case 'jpeg':
                                jpegConvert(basePNGFile, outputFile , {width : 1200}, function(jpegError){
                                    if(jpegError) throw jpegError;
                                    callback(outputFile);
                                });
                                break;
                            default:
                                callback(basePNGFile); // Send png if no matching type
                        }
                    });
                }
            }
        });
    };

    // Create processing directory and export chart
    fs.mkdir(processingDir, function(err){
        exportChart(function(outputFile){
            response.download(outputFile, function(){
                rmdir(processingDir, function(err){});
            });
        });
    });
});


server.listen(3000, function(){
    console.log('node-highcharts-exporter listening to http://localhost:3000/export');
});

