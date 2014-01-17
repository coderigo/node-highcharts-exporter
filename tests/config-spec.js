"use strict";

var testsConfig = require('./testsConfig.json'),
    nhe         = require(testsConfig.mainPath);

describe('Config behaviour', function(){

    it('should complain when given an invalid config option to set', function () {
        expect(function(){nhe.config.set('notAnOption', 'not an option value')}).toThrow();
    });

    it('should allow setting of processing directory', function () {
        var defaultProcessingDir = process.cwd() + '/' + testsConfig.defaultProcessingDirName;
        expect(nhe.config.get().processingDir).toBe(defaultProcessingDir);

        nhe.config.set('processingDir', testsConfig.testProcessingDir);
        expect(nhe.config.get().processingDir).toBe(testsConfig.testProcessingDir);
    });
});