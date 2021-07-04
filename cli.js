#!/usr/bin/env node
const program = require('commander');
const api = require('./index.js');
const pkg = require('./package.json')

program
    .version(pkg.version)
program
    .option('-x, --test', 'this is a test')
program
    .command('add')
    .description('add a task')
    .action((...args) => {
        let words = args.slice(0, -1).join(" ");
        api.add(words).then(() => { console.log('add success') }, () => { console.log('add fail'); });
    });
program
    .command('clear')
    .description('clear all tasks')
    .action((...args) => {
        api.clear().then(() => { console.log('clear success') }, () => { console.log('clear fail'); });
    });

program.parse(process.argv);

if (process.argv.length === 2) {
    api.showAll();
}