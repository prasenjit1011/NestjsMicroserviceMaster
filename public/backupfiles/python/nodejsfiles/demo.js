// demo.js
const path = require('node:path');
const { Worker } = require('node:worker_threads');

function runFib(n) {
  return new Promise((resolve, reject) => {
    const workerPath = path.resolve(__dirname, 'cpu-worker.js');
    const worker = new Worker(workerPath, { workerData: { n } });

    worker.once('message', resolve);
    worker.once('error', reject);
    worker.once('exit', (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

(async () => {
  const n = Number(process.argv[2] ?? 40); // default to 40 if not provided
  const start = Date.now();
  const result = await runFib(n);
  console.log(`fib(${n}) = ${result} (computed in ${Date.now() - start}ms)`);
})();