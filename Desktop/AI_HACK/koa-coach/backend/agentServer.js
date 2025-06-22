const http = require('http');
const { spawn } = require('child_process');
const path = require('path');

const scriptPath = path.join(__dirname, '..', '..', '..', 'unify-hackathon-demo', 'video_agent', '__main__.py');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/run-agent') {
    const proc = spawn('python3', [scriptPath]);
    proc.stdout.on('data', d => console.log(d.toString()));
    proc.stderr.on('data', d => console.error(d.toString()));
    proc.on('close', c => console.log('agent exited', c));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'started' }));
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Agent server listening on ${PORT}`);
});
