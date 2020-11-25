import { spawn } from 'child_process';

var process = spawn('node', [
  '/Users/pulkitsingh/dev/chaakar/electron/plugins/test.js',
  'arg1',
  'arg2',
]);

process.stdout.on('data', function (data) {
  console.log({ data: data?.toString() });
});
