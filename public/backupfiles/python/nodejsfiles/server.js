// server.js
const express = require('express');
const { Worker } = require('node:worker_threads');

function runCpuTask(input) {
  return new Promise((resolve, reject) => {
    // Inline worker code as a string. We enable { eval: true } so Node treats the string as a module.
    const workerCode = `
      const { parentPort, workerData } = require('node:worker_threads');
      function fib(n) {
        if (n <= 1) return n;
        return fib(n - 1) + fib(n - 2);
      }
      const out = fib(workerData.n);
      parentPort.postMessage(out);
    `;

    const worker = new Worker(workerCode, {
      eval: true,
      workerData: input,
    });

    console.log('Worker started with threadId:', input, worker.threadId);
    worker.once('message', resolve);
    worker.once('error', reject);
    worker.once('exit', (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with code ${code}`));
    });
  });
}

const app = express();

// Example endpoint: compute fib(n). Defaults to n=45 if not provided.
app.get('/compute', async (req, res) => {
  const n = Number(req.query.n ?? 45);

  if (!Number.isInteger(n) || n < 0) {
    return res.status(400).json({ error: 'Query param "n" must be a non-negative integer.' });
  }

  try {
    const started = Date.now();
    const result = await runCpuTask({ n });
    const elapsedMs = Date.now() - started;
    res.json({ input: n, result, elapsedMs });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Server listening on http://localhost:${port}`);
  console.log(`Try: http://localhost:${port}/compute?n=45`);
});
