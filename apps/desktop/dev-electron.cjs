// dev-electron.cjs
const waitOn = require('wait-on');
const { exec } = require('child_process');

const url = 'http://localhost:5173';

waitOn({ resources: [url], timeout: 10000 }, (err) => {
  if (err) {
    console.error('❌ wait-on failed:', err);
    process.exit(1);
  }

  console.log('✅ Vite is ready. Launching Electron...');
  const child = exec('electron .');

  child.stdout?.on('data', (data) => process.stdout.write(data));
  child.stderr?.on('data', (data) => process.stderr.write(data));
});
