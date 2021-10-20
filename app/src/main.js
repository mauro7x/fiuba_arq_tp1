const cluster = require('cluster');

const server = require('./server');
const { n_workers, port } = require('./config');

if (n_workers > 1 && cluster.isMaster) {
  console.log(`[Master ${process.pid}] Starting workers...`);

  for (let i = 0; i < n_workers; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) =>
    console.log(
      `[Worker ${worker.process.pid}] Exited with code ${code} (signal: ${signal})`
    )
  );
} else {
  server(port);
}
