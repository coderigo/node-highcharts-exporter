'use strict';

var testsConfig = require('./testsConfig.json'),
    nhe         = require(testsConfig.mainPath),
    fs          = require('fs'),
    chart1SVG   = fs.readFileSync(__dirname + '/chart1.svg'),
    rmdir       = require('rimraf');

describe('Chart exporting', function () {

    /**
     * Tests exporting to supported formats as they come 
     * @param  {object}  format An export test format
     * @return {boolean}        Test chartExport synchronous version
     */
    var testExport = function(format, sync){

        it('should return ' + format.extension +' when requested ' + format.extension, function(done){

            var chartName             = 'export_to_' + format.extension,
                chartNameAndExtension = chartName + '.' + format.extension,
                highchartsRequest     = { // The mock POSTed request from Highcharts
                    type     : format.mediaType,
                    filename : chartName,
                    scale    : 2,
                    svg      : chart1SVG
                };

            nhe.exportChart(highchartsRequest, function(error, exportedChartInfo){

                expect(error).toBe(null);

                expect(exportedChartInfo['parentDir']).toBeDefined();
                expect(fs.existsSync(exportedChartInfo['parentDir'])).toBe(true);
                expect(exportedChartInfo['filePath']).toBeDefined();
                expect(fs.existsSync(exportedChartInfo['filePath'])).toBe(true);

                expect(exportedChartInfo['type']).toBe(format.extension);
                expect(exportedChartInfo['fileName']).toBe(chartName);
                expect(exportedChartInfo['file']).toBe(chartNameAndExtension);

                expect(exportedChartInfo['parentDir']).toBeDefined();

                // Done sync as tests may run too quickly and thus land in
                // the same processing directory as its name comes from a hash avec timestamp
                rmdir.sync(exportedChartInfo['parentDir']);

                done();
            });
        }, 5000);
    };

    /**
     * Supported export formats to test
     * @type {Array}
     */
    var exportFormats = [
        {extension : 'svg' , type : 'svg' , mediaType : 'image/svg+xml'},
        {extension : 'png' , type : 'png' , mediaType : 'image/png'},
        {extension : 'jpeg', type : 'jpeg', mediaType : 'image/jpeg'},
        {extension : 'pdf' , type : 'pdf' , mediaType : 'application/pdf'}
    ];

    /**
     * Run testExport over all supported formats
     * @param  {object} format A format object as per exportFormats array
     * @return {void}        Nothing
     */
    exportFormats.forEach(function(format){
        testExport(format);
    });

});