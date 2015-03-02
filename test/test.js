var path = require('path');

/* global require,describe,it,beforeEach */
(function () {
	"use strict";
	var expect = require('chai').expect,
		xunit;

	function clearXunit() {
		delete require.cache[require.resolve('../')];
		xunit = require('../');
	}

	describe('Tests for gulp-xunit-runner', function () {
		beforeEach(function () {
			clearXunit();
		});

		describe('Test quoted executable path and path with spaces.', function () {
			var opts;

			it('Should not quote a non-quoted string', function () {
				opts = {
					executable: 'C:\\xunit\\bin\\xunit.console.exe'
				};

				expect(xunit.getExecutable(opts)).to.equal('C:\\xunit\\bin\\xunit.console.exe');
			});

			it('Should unquote a double-quoted string', function () {
				opts = {
					executable: '"C:\\xunit\\bin\\xunit.console.exe"'
				};

				expect(xunit.getExecutable(opts)).to.equal('C:\\xunit\\bin\\xunit.console.exe');
			});

			it('Should unquote a single-quoted string', function () {
				opts = {
					executable: "'C:\\xunit\\bin\\xunit.console.exe'"
				};

				expect(xunit.getExecutable(opts)).to.equal('C:\\xunit\\bin\\xunit.console.exe');
			});

			it('Should add the anycpu executable if only a path is passed and no platform is specified', function () {
				opts = {
					executable: path.join('C:', 'xunit', 'bin')
				};

				expect(xunit.getExecutable(opts)).to.equal(path.join('C:', 'xunit', 'bin', 'xunit.console.exe'));
			});

			it('Should add the anycpu executable if only a path is passed and anycpy platform is specified', function () {
				opts = {
					executable: path.join('C:', 'xunit', 'bin'),
					platform  : 'anycpu'
				};

				expect(xunit.getExecutable(opts)).to.equal(path.join('C:', 'xunit', 'bin', 'xunit.console.exe'));
			});

			it('Should add the x86 executable if only a path is passed and platform is x86', function () {
				opts = {
					executable: path.join('C:', 'xunit', 'bin'),
					platform  : 'x86'
				};

				expect(xunit.getExecutable(opts)).to.equal(path.join('C:', 'xunit', 'bin', 'xunit.console.x86.exe'));
			});

			it('Should be the anycpu executable if no path is passed and no platform is specified', function () {
				expect(xunit.getExecutable({})).to.equal('xunit.console.exe');
			});

			it('Should be the anycpu executable if no path is passed and anycpy platform is specified', function () {
				opts = {
					platform: 'anycpu'
				};

				expect(xunit.getExecutable(opts)).to.equal('xunit.console.exe');
			});

			it('Should be the x86 executable if no path is passed and platform is x86', function () {
				opts = {
					platform: 'x86'
				};

				expect(xunit.getExecutable(opts)).to.equal('xunit.console.x86.exe');
			});
		});

		describe('Adding assemblies and option switches should yield correct command.', function () {
			var stream;
			var opts;
			var assemblies;

			it('Should throw an error with no assemblies', function (cb) {
				stream = xunit({
					executable: 'C:\\xunit\\bin\\xunit.console.exe'
				});
				stream.on('error', function (err) {
					expect(err.message).to.equal('File may not be null.');
					cb();
				});
				stream.write();
			});

			it('Should have correct options with assemblies only.', function () {
				opts = {
					executable: 'C:\\xunit\\bin\\xunit.console.exe'
				};

				assemblies = ['First.Test.dll', 'Second.Test.dll'];

				expect(xunit.getArguments(opts, assemblies)).to.deep.equal(['First.Test.dll', 'Second.Test.dll']);
			});

			it('Should have correct options with options and assemblies.', function () {
				opts = {
					executable: 'C:\\xunit\\bin\\xunit.console.exe',
					options: {
              parallel: 'none',
              maxthreads: '1',
              noshadow: true,
              teamcity: true,
              appveyor: true,
              quiet: true,
              debug: true,
              trait: "desiredTrait=value",
              notrait: "unwantedTrait=value",
            	xml: 'TestResults.xml'
            }
				};

				assemblies = ['First.Test.dll', 'Second.Test.dll'];


				expect(xunit.getArguments(opts, assemblies)).to.deep.equal(
					[
						'First.Test.dll',
						'Second.Test.dll',
						'-parallel',
						'none',
						'-maxthreads',
						'1',
						'-noshadow',
						'-teamcity',
						'-appveyor',
						'-quiet',
						'-debug',
						'-trait',
						'desiredTrait=value',
						'-notrait',
						'unwantedTrait=value',
						'-xml',
						'TestResults.xml'
					]);
			});			
		});
	});
}());
