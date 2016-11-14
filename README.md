#gulp-xunit-runner

[![Build Status](https://travis-ci.org/StefanBilliet/gulp-xunit-runner.svg?branch=master)](https://travis-ci.org/StefanBilliet/gulp-xunit-runner.svg?branch=master)

A [gulp.js](http://gulpjs.com/) plugin to facilitate running [XUnit](http://xunit.github.io/) tests on .NET assemblies. Much of this work was inspired by the [gulp-nunit-runner](https://github.com/keithmorris/gulp-nunit-runner) plugin.

##Installation
From the root of your project (where your `gulpfile.js` is), issue the following command:

```bat
npm install --save-dev gulp-xunit-runner
```

##Usage
The plugin uses standard `gulp.src` globs to retrieve a list of assemblies that should be tested with XUnit. By default the plugin looks for the XUnit console runner in your `PATH`. You can optionally specify the XUnit `bin` folder or the full path of the runner as demonstrated below. You should add `{read: false}` to your `gulp.src` so that it doesn't actually read the files and only grabs the file names.

```javascript
var gulp = require('gulp'),
    xunit = require('gulp-xunit-runner');

gulp.task('unit-test', function () {
  return gulp.src(['**/*.Test.dll'], {read: false})
    .pipe(xunit({
      executable: 'C:/xunit/bin/xunit-console.exe',
    }));
});

```
This would result in the following command being executed (assuming you had Database and Services Test assemblies.)

```bat
C:/xunit/bin/xunit-console.exe "C:\full\path\to\Database.Test.dll" "C:\full\path\to\Services.Test.dll"
```

Note: If you use Windows paths with `\`'s, you need to escape them with another `\`. (e.g. `C:\\xunit\\bin\\xunit-console.exe`). However, you may also use forward slashes `/` instead which don't have to be escaped.

You may also add options that will be used as XUnit command line switches. Any property that is a boolean `true` will simply be added to the command line, String values will be added to the switch parameter separated by a colon and arrays will be a comma seperated list of values.

For more information on available switches, see the XUnit documentation:

[http://xunit.github.io/#documentation](http://xunit.github.io/#documentation)

```javascript
var gulp = require('gulp'),
    xunit = require('gulp-xunit-runner');

gulp.task('unit-test', function () {
  return gulp.src(['**/*.Test.dll'], {read: false})
    .pipe(xunit({
      executable: 'C:/xunit/bin/xunit-console.exe',
      options: {
        nologo: true,
        xml: 'test_results.xml'
      }
    }));
});
```
This would result in the following command:

```bat
C:/xunit/bin/xunit-console.exe /nologo /config:"Release" /transform:"myTransform.xslt" "C:\full\path\to\Database.Test.dll" "C:\full\path\to\Services.Test.dll"
```

### Mono

Running xUnit on Mono for those needed running it on Mac and Linux. 
Probably will run only with xUnit 2.1.0+, because of some issues with xUnit and mono.
Use latest mono possible e.g. `4.4.1` or above.

```javascript
var gulp = require('gulp'),
    xunit = require('gulp-xunit-runner');

gulp.task('unit-test', function () {
  return gulp.src(['**/*.Test.dll'], {read: false})
    .pipe(xunit({
      executable: './packages/xunit.runner.console.2.1.0/tools/xunit.console.exe',
      useMono: true,
      options: {
        nologo: true,
	    noshadow: true
      }      
    }));
});
```
This would result in the following command:

```shell
mono "./packages/xunit.runner.console.2.1.0/tools/xunit.console.exe" -nologo -noshadow "/path/to/src/Database.Test.dll" "/path/to/src/Services.Test.dll"
```

## Options

Below are all avialable options.

```js
xunit({
    // The XUnit bin folder or the full path of the console runner.
    // If not specified the XUnit bin folder must be in the `PATH`.
    executable: 'path to xunit console runner',

    // is xUnit runnnig on Mono. 
    // Probably will work with xUnit 2.1.0+. 
    // Mac and Linux only, not sure about Windows.
    // Assumes that 'mono' command is in the `PATH`.
    // `false` by default.
    useMono: true
             false,

    // The options below map directly to the XUnit console runner. See here
    // for more info: http://www.xunit.org/index.php?p=consoleCommandLine&r=2.6.3
    options: {

        // Set parallelisation based on option.
        parallel: none - turn off all parallelization
                  collections - only parallelize collections
                  assemblies - only parallelize assemblies
                  all - parallelize assemblies & collections,

        // Maximum thread count for collection parallelization.
        maxthreads: 0 - run with unbounded thread count
                    >0 - limit task thread pool size to 'count',

        // Do not shadow copy assemblies.
        noshadow: true
                  false,

        // Forces TeamCity mode (normally auto-detected).
        teamcity: true
                  false,

        // Forces AppVeyor CI mode (normally auto-detected).
        appveyor: true
                  false,

        // Do not show the copyright message.
        nologo: true
                false,

        // Do not show progress messages.
        quiet: true
               false,

        // Wait for input after completion.
        wait: true
              false,

        // Launch the debugger to debug the tests.
        debug: true
               false,

        // Only run tests with matching name/value traits. If specified more than once, acts as an OR operation.
        trait: 'name=value',

        // Do not run tests with matching name/value traits. If specified more than once, acts as an AND operation.
        notrait: 'name=value',

        // Run a given test method (should be fully specified; i.e., 'MyNamespace.MyClass.MyTestMethod'). If specified more than once, acts as an OR operation
        method: 'name',

        // Run all methods in a given test class (should be fully specified; i.e., 'MyNamespace.MyClass'). If specified more than once, acts as an OR operation.
        class: 'name',

        // Output results to xUnit.net v2 style XML file.
        xml: 'filename',

        // Output results to xUnit.net v1 style XML file.
        xmlv1: 'filename',

        // Output results to NUnit-style XML file.
        nunit: 'filename',

        // Output results to HTML file.
        html: 'filename'
    }
});
```

## Release Notes

### 0.1.0 (02 March 2015)
- Initial release
