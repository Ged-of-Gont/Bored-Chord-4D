const http = require("http");
const fs = require("fs/promises");
const path = require("path");

const host = process.env.HOST || "127.0.0.1";
const port = Number.parseInt(process.env.PORT || "4173", 10);
const rootDir = __dirname;

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8"
};

function resolveFilePath(requestUrl) {
  const url = new URL(requestUrl, `http://${host}:${port}`);
  const decodedPath = decodeURIComponent(url.pathname);
  let filePath = path.resolve(rootDir, `.${decodedPath}`);

  if (filePath === rootDir) {
    return path.join(rootDir, "index.html");
  }

  if (!filePath.startsWith(rootDir + path.sep)) {
    return null;
  }

  return filePath;
}

async function sendFile(filePath, response) {
  try {
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
      return sendFile(path.join(filePath, "index.html"), response);
    }

    const data = await fs.readFile(filePath);
    const extension = path.extname(filePath).toLowerCase();
    response.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Type": mimeTypes[extension] || "application/octet-stream"
    });
    response.end(data);
  } catch (error) {
    if (error.code === "ENOENT" || error.code === "ENOTDIR") {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("404 Not Found");
      return;
    }

    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("500 Internal Server Error");
  }
}

const server = http.createServer((request, response) => {
  const filePath = resolveFilePath(request.url || "/");
  if (!filePath) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("403 Forbidden");
    return;
  }

  void sendFile(filePath, response);
});

server.on("error", error => {
  const message = error.code === "EADDRINUSE"
    ? `Port ${port} is already in use. Try a different one with PORT=3000 npm run dev.`
    : `Unable to start BORED CHORD 4D dev server: ${error.message}`;
  console.error(message);
  process.exit(1);
});

server.listen(port, host, () => {
  console.log(`BORED CHORD 4D available at http://${host}:${port}`);
});
