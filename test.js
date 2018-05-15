#!/usr/bin/env node
//Spawn a local HTTP server which can be accessed through port 8080. The URL being http://localhost:8080
var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname)).listen(8080, function () {
  console.log('Server running on 8080...');
});
console.log('Press Ctrl+C to stop http server once the test completes')

const webdriver = require('selenium-webdriver')
const browserstack = require('browserstack-local')
const local = new browserstack.Local()

var capabilities = {
  'build': 'CircleCI Build',
  'browserName': 'Chrome',
  'browser_version': '66.0',
  'os': 'OS X',
  'browserstack.local': true,
  'browserstack.debug': true,
  'browserstack.user': process.env.BROWSERSTACK_USERNAME,
  'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY
}

var options = {
  'key': process.env.BROWSERSTACK_ACCESS_KEY
}

console.log('Starting tunnel...')

local.start(options, function (error) {
  if (error) {
    console.error('Received error while starting tunnel', error)
    process.exit(1)
  }
  console.log('Is Running', local.isRunning())
  console.log('Started')
  //Updating the driver.get method to use http://bs-local.com:8080/ instead of http://localhost:8080
  var driver = new webdriver.Builder().usingServer('http://hub.browserstack.com/wd/hub').withCapabilities(capabilities).build()
  driver.get('http://localhost:8080').then(function () {
    driver.findElement(webdriver.By.id('hw')).then(function () {
      driver.getTitle().then(function (title) {
        console.log(title).then(function () {
          driver.quit().then(function () {
            process.exit(0);
          });
        });
      });
    });
  })
});