import { createServer } from "node:http";
import { serve } from "../dist/server/index.js";
const server = createServer(async (req, res) => {
  try {
    const response = serve(
      new Request(`http://127.0.0.1:4178${req.url}`, { method: req.method }),
    );
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(Buffer.from(await response.arrayBuffer()));
  } catch {
    res.writeHead(500);
    res.end("Unable to load page");
  }
});
server.listen(4178, "127.0.0.1", () =>
  console.log("Built website: http://127.0.0.1:4178"),
);
