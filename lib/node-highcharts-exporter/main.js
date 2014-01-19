'use strict';

/**
 * Ye-olde requires. Note that netpbm requires some setup outside of Node.js
 * On the host machine. See : https://npmjs.org/package/netpbm
 */
var svg2png     = require('svg2png'),
    fs          = require('fs'),
    pdfkit      = require('pdfkit'),
    jpegConvert = require('netpbm').convert,
    crypto      = require('crypto'),
    async       = require('async');

/**
 * Default exporting configuration. Basic but extendable.
 * @type {Object}
 */
var config = {
    processingDir : process.cwd() + '/highcharts_exports' // Default: the same directory of the using module
};

/**
 * Set and gets config options
 * @param {string}   key   Key of the config object
 * @param {anything} value Value for the key
 */
exports.config = {
    set : function(key, value){
        if(key && value && config.hasOwnProperty(key)){
            config[key] = value;
        }
        else{
            throw 'Error! you must supply a valid config property and give a value when calling the set() function.';
        }
    },
    get : function(){
        return config;
    }
};

/**
 * Makes the directory to process and store the requested chart
 * @param  {object} hcExportRequest The Highcharts POSTed export request object
 * @param  {function} asyncCallback A reference to the async callback
 * @return {void}                   Nothing
 */
var _makeDirs = function(hcExportRequest,asyncCallback){

    var makeThisExportDir = function(mkExportDirErr){
        var thisExportDir = [config.processingDir, crypto.createHash('md5').update(Date().toString()+hcExportRequest.svg).digest('hex'),''].join('/');
        fs.mkdir(thisExportDir, function(error){
            asyncCallback(mkExportDirErr, thisExportDir, hcExportRequest);
        });
    };

    if(fs.existsSync(config.processingDir)){
        makeThisExportDir(null);
    }
    else{
        fs.mkdir(config.processingDir, function(error){
            makeThisExportDir(error);
        });
    }
};

/**
 * Exports chart into desired format
 * @param  {string}   processingDir   The processing directory to export the chart to (returned by _makeDirs() function)
 * @param  {object}   hcExportRequest The Highcharts POSTed export request object
 * @param  {Function} asyncCallback   A reference to the async callback
 * @return {void}                     Nothing
 * Notes: At this juncture, if you request anything other than svg, a PNG will be
 *        created first and if requested, a PDF or JPEG will be then created from 
 *        that PNG.
 */
var _exportChart = function(processingDir, hcExportRequest, callback){
    var outputChartName = hcExportRequest.filename,
        outputFormat    = hcExportRequest.type.split('/')[1],
        outputExtension = outputFormat == 'svg+xml' ? '.svg' : '.' + outputFormat,
        outputFile      = outputChartName + outputExtension,
        outputFilePath  = processingDir + outputFile,
        basePNGFile     = processingDir + outputChartName + '.png',
        baseSVGFile     = processingDir + outputChartName + '.svg',
        exportInfo      = {
                            fileName  : outputChartName,
                            file      : outputFile,
                            type      : outputExtension.replace('.',''),
                            parentDir : processingDir,
                            filePath  : outputFilePath
                        };

    fs.writeFile(baseSVGFile, hcExportRequest.svg, function(svgErr){
        if(outputFormat == 'svg+xml'){
            callback(null, exportInfo);
        }
        else{
            svg2png(baseSVGFile, basePNGFile, hcExportRequest.scale, function(err){
                switch(outputFormat){
                    case 'png':
                        callback(null, exportInfo);
                        break;
                    case 'pdf':
                        var pdf = new pdfkit({size:'A4',layout:'landscape'});
                        pdf.image(basePNGFile,{width : 700})
                            .write(outputFilePath, function(){
                                callback(null, exportInfo);
                            });
                        break;
                    case 'jpeg':
                    case 'jpg':
                        jpegConvert(basePNGFile, outputFilePath , {width : 1200}, function(jpegError){
                            if(jpegError) throw jpegError;
                            callback(null,exportInfo);
                        });
                        break;
                    default:
                        var errorMessage = ['Invalid export format requested:',outputFormat+'.','Currently supported outputFormats: svg+xml, pdf, jpeg, jpg, and png.'].join(' ');
                        callback({message: errorMessage}, null);
                }
            });
        }
    });
};

/**
 * Executes an incoming Highcharts request into the requested format the async way
 * @param  {object}   hcExportRequest An object as POSTed by Highcharts
 * @param  {Function} callback        A callback, with first parameter an error 
 *                                    and the second a success function handed the 
 *                                    directory where the file is exported.
 * @return {void}                     Nothing
 * Notes: As of Highcharts v3.0.7, the hcExportRequest looks something like this:
 *     {
 *         filename : 'someName'
 *         type     : 'application/pdf',
 *         svg      : '<svg>An SVG representation of the chart here</svg>',
 *         scale    : 2
 *     }
 */
exports.exportChart = function(hcExportRequest, exportCallback){
    async.waterfall([
            function(callback){
                _makeDirs(hcExportRequest, callback);
            },
            function(processingDir, hcExportRequest, callback){
                _exportChart(processingDir, hcExportRequest, callback);
            }
        ], 
        function(error, exportedChartInfo){
            exportCallback(error, exportedChartInfo);
        }
    );
};
