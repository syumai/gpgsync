import * as Y from 'yjs';
import * as ws from 'ws';
import * as http from 'http';
import * as encoding from 'lib0/encoding';
import * as decoding from 'lib0/decoding';
import * as syncProtocol from 'y-protocols/sync';
import { Awareness, encodeAwarenessUpdate, applyAwarenessUpdate } from 'y-protocols/awareness';

interface RoomManager {
  rooms: Map<string, Y.Doc>;
  getRoom(roomId: string): Y.Doc;
  destroyRoom(roomId: string): void;
  getRoomCount(): number;
}

class YjsRoomManager implements RoomManager {
  public rooms: Map<string, Y.Doc> = new Map();

  getRoom(roomId: string): Y.Doc {
    if (!this.rooms.has(roomId)) {
      const doc = new Y.Doc();
      // Initialize with hello world content if empty
      const text = doc.getText('codemirror');
      if (text.length === 0) {
        text.insert(0, this.getInitialContent());
      }
      this.rooms.set(roomId, doc);
      console.log(`Created room: ${roomId}`);
    }
    return this.rooms.get(roomId)!;
  }

  destroyRoom(roomId: string): void {
    const doc = this.rooms.get(roomId);
    if (doc) {
      doc.destroy();
      this.rooms.delete(roomId);
      console.log(`Destroyed room: ${roomId}`);
    }
  }

  getRoomCount(): number {
    return this.rooms.size;
  }

  private getInitialContent(): string {
    return `package main

import "fmt"

func main() {
\tfmt.Println("Hello, 世界")
}`;
  }
}

class YjsWebSocketServer {
  private server: http.Server;
  private wss: ws.WebSocketServer;
  private roomManager: RoomManager;
  private port: number;

  constructor(port: number = 8136) {
    this.port = port;
    this.roomManager = new YjsRoomManager();
    this.server = http.createServer();
    
    this.wss = new ws.WebSocketServer({
      server: this.server,
      path: '/ws'
    });

    this.setupWebSocketHandlers();
  }

  private setupYjsConnection(ws: ws.WebSocket, doc: Y.Doc): void {
    const awareness = new Awareness(doc);
    
    // Send sync step 1
    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, 0); // messageSync
    syncProtocol.writeSyncStep1(encoder, doc);
    ws.send(encoding.toUint8Array(encoder));

    const messageListener = (message: Uint8Array) => {
      try {
        const decoder = decoding.createDecoder(message);
        const messageType = decoding.readVarUint(decoder);
        
        switch (messageType) {
          case 0: // messageSync
            encoding.writeVarUint(encoder, 0);
            syncProtocol.readSyncMessage(decoder, encoder, doc, null);
            if (encoding.length(encoder) > 1) {
              ws.send(encoding.toUint8Array(encoder));
            }
            break;
          case 1: // messageAwareness
            applyAwarenessUpdate(awareness, decoding.readVarUint8Array(decoder), null);
            break;
        }
      } catch (err) {
        console.error('Error processing yjs message:', err);
      }
    };

    const awarenessChangeHandler = (changed: any, origin: any) => {
      if (origin !== null) {
        const encoder = encoding.createEncoder();
        encoding.writeVarUint(encoder, 1); // messageAwareness
        encoding.writeVarUint8Array(encoder, encodeAwarenessUpdate(awareness, changed.added.concat(changed.updated).concat(changed.removed)));
        ws.send(encoding.toUint8Array(encoder));
      }
    };

    const updateHandler = (update: Uint8Array, origin: any) => {
      if (origin !== ws) {
        const encoder = encoding.createEncoder();
        encoding.writeVarUint(encoder, 0); // messageSync
        syncProtocol.writeUpdate(encoder, update);
        ws.send(encoding.toUint8Array(encoder));
      }
    };

    (doc as any).on('update', updateHandler);
    (awareness as any).on('change', awarenessChangeHandler);

    ws.on('message', (data: Buffer) => {
      messageListener(new Uint8Array(data));
    });

    ws.on('close', () => {
      (doc as any).off('update', updateHandler);
      (awareness as any).off('change', awarenessChangeHandler);
      awareness.destroy();
    });
  }

  private setupWebSocketHandlers(): void {
    this.wss.on('connection', (ws, req) => {
      const url = new URL(req.url!, `http://${req.headers.host}`);
      const roomId = url.searchParams.get('room');
      
      if (!roomId) {
        ws.close(1008, 'Room ID required');
        return;
      }

      // Validate room ID (same validation as original)
      if (roomId.length > 20) {
        ws.close(1008, 'Room ID too long');
        return;
      }

      console.log(`Client connected to room: ${roomId}`);
      
      const doc = this.roomManager.getRoom(roomId);
      this.setupYjsConnection(ws, doc);

      ws.on('close', () => {
        console.log(`Client disconnected from room: ${roomId}`);
        // Note: We don't auto-destroy rooms like the original
        // yjs handles persistence better than manual cleanup
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });
  }

  start(): Promise<void> {
    return new Promise((resolve) => {
      this.server.listen(this.port, () => {
        console.log(`yjs WebSocket server running on port ${this.port}`);
        console.log(`WebSocket URL: ws://localhost:${this.port}/ws`);
        resolve();
      });
    });
  }

  stop(): Promise<void> {
    return new Promise((resolve) => {
      this.wss.close(() => {
        this.server.close(() => {
          console.log('yjs WebSocket server stopped');
          resolve();
        });
      });
    });
  }

  getRoomCount(): number {
    return this.roomManager.getRoomCount();
  }

  // Method to load shared content from Go Playground
  async loadSharedContent(roomId: string, sharedContentId: string): Promise<void> {
    try {
      const { GoPlayground } = await import('@syumai/goplayground-node');
      const gp = new GoPlayground();
      const content = await gp.download(sharedContentId);
      
      const doc = this.roomManager.getRoom(roomId);
      const text = doc.getText('codemirror');
      
      // Replace content atomically
      doc.transact(() => {
        text.delete(0, text.length);
        text.insert(0, content);
      });
      
      console.log(`Loaded shared content ${sharedContentId} into room ${roomId}`);
    } catch (error) {
      console.error(`Failed to load shared content ${sharedContentId}:`, error);
      throw error;
    }
  }
}

export { YjsWebSocketServer };
