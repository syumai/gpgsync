import { Hono } from "hono";
import { yRoute } from "y-durableobjects";
import { serveStatic } from "hono/cloudflare-workers";
import { GPSyncDurableObject, GPSyncEnv } from "./gpsync-durable-object.js";
import { 
  validateRoomId, 
  validateSharedContentIdLength,
  InvalidArgumentError 
} from "./validators.js";
import { homeTemplate, roomTemplate } from "./templates.js";

type Env = GPSyncEnv;

const app = new Hono<{ Bindings: Env }>();

// Serve static assets using the ASSETS binding
app.get("/*", async (c, next) => {
  const url = new URL(c.req.url);
  
  // Skip API routes and specific application routes
  if (url.pathname.startsWith("/yjs/") || 
      url.pathname.startsWith("/rooms/") ||
      url.pathname.startsWith("/p/") ||
      url.pathname.startsWith("/health") ||
      url.pathname === "/") {
    await next();
    return;
  }
  
  // Try to serve static asset
  try {
    return await c.env.ASSETS.fetch(c.req.raw);
  } catch (error) {
    // If asset not found, continue to next handler
    await next();
  }
});

// Home route handlers
app.get("/", (c) => {
  const html = homeTemplate({ sharedContentId: "" });
  return c.html(html);
});

app.get("/p/:sharedContentId", (c) => {
  const { sharedContentId } = c.req.param();
  
  try {
    validateSharedContentIdLength(sharedContentId);
    const html = homeTemplate({ sharedContentId });
    return c.html(html);
  } catch (error) {
    if (error instanceof InvalidArgumentError) {
      return c.text(error.message, 400);
    }
    console.error("Error handling shared content request:", error);
    return c.text("Internal Server Error", 500);
  }
});

// Room route handlers
app.get("/rooms/:roomId", (c) => {
  const { roomId } = c.req.param();
  
  try {
    validateRoomId(roomId);
    const html = roomTemplate({ roomId, sharedContentId: "" });
    return c.html(html);
  } catch (error) {
    if (error instanceof InvalidArgumentError) {
      return c.text(error.message, 400);
    }
    console.error("Error handling shared content request:", error);
    return c.text("Internal Server Error", 500);
  }
});

app.get("/rooms/:roomId/p/:sharedContentId", (c) => {
  const { roomId, sharedContentId } = c.req.param();
  
  try {
    validateRoomId(roomId);
    validateSharedContentIdLength(sharedContentId);
    const html = roomTemplate({ roomId, sharedContentId });
    return c.html(html);
  } catch (error) {
    if (error instanceof InvalidArgumentError) {
      return c.text(error.message, 400);
    }
    console.error("Error handling shared content request:", error);
    return c.text("Internal Server Error", 500);
  }
});

// Y.js WebSocket route using y-durableobjects
// This handles WebSocket upgrades for room collaboration
const yjsRoute = yRoute<{ Bindings: Env }>((env: Env) => env.GPGSYNC_ROOMS);
app.route("/yjs", yjsRoute);

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.notFound((c) => {
  return c.text("Not Found", 404);
});

// Error handler
app.onError((error, c) => {
  console.error("Worker error:", error);
  return c.text("Internal Server Error", 500);
});

export default app;
export { GPSyncDurableObject };