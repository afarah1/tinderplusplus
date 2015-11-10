// TODO: automate updating desktop-app/package.json version
console.log('Before running, make sure versions are updated in both package.json and desktop-app/package.json');

var NwBuilder = require('node-webkit-builder');
var appPkg = require('./desktop-app/package.json');
var appName = 'Tinder⁺⁺';

var nw = new NwBuilder({
  files: 'desktop-app/**',
  platforms: ['osx32', 'win32', 'linux'],
  version: '0.11.6',
  appName: appName,
  appVersion: appPkg.version,
  buildType: 'default',
  mergeZip: false
});

nw.on('log', console.log);

nw.build()
  .then(function () {
    console.log('done building apps');
    createNW();
  })
  .catch(function (error) {
    console.error(error);
  });

// create the regular .nw file for updates
function createNW() {
  console.log('creating regular tinder.nw for updates...');
  var fs = require('fs');
  var archiver = require('archiver');
  var archive = archiver('zip');

  var output = fs.createWriteStream('./build/' + appName + '/tinder-' + appPkg.version + '.nw');
  output.on('close', function () {
    console.log((archive.pointer() / 1000000).toFixed(2) + 'mb compressed');
  });

  archive.pipe(output);
  archive.bulk([
    { expand: true, cwd: 'desktop-app', src: ['**'], dest: '.' }
  ]);
  archive.finalize();
}
