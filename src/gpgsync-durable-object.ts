import { YDurableObjects } from "y-durableobjects";
import * as Y from "yjs";
import { Env } from "./worker.js";

export class GPGSyncDurableObject extends YDurableObjects<Env> {
  private isInitialized: boolean = false;
  
  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
  }

  async fetch(request: Request): Promise<Response> {
    // Initialize the room with default content if not already done
    if (!this.isInitialized) {
      await this.initializeRoom();
      this.isInitialized = true;
    }

    // Handle WebSocket upgrade requests and other HTTP requests
    return super.fetch(request);
  }

  private async initializeRoom(): Promise<void> {
    try {
      // Access the internal Yjs document directly
      // y-durableobjects provides access via this.doc
      const text = this.doc.getText('codemirror');
      
      if (text.length === 0) {
        // Initialize with default Go content
        const initialContent = this.getInitialGoContent();
        
        // Use a transaction to ensure atomicity
        this.doc.transact(() => {
          text.insert(0, initialContent);
        });
        
        console.log('Initialized room with default Go content');
      }
    } catch (error) {
      console.error('Error initializing room:', error);
    }
  }

  private getInitialGoContent(): string {
    return `package main

import "fmt"

func main() {
\tfmt.Println("Hello, 世界")
}`;
  }

  // Method to load shared content from Go Playground
  async loadSharedContent(sharedContentId: string): Promise<void> {
    try {
      const content = await this.fetchGoPlaygroundContent(sharedContentId);
      
      if (content) {
        // Access the internal Yjs document directly
        const text = this.doc.getText('codemirror');
        
        // Replace content atomically
        this.doc.transact(() => {
          text.delete(0, text.length);
          text.insert(0, content);
        });
        
        console.log(`Loaded shared content ${sharedContentId} into room`);
      }
    } catch (error) {
      console.error(`Failed to load shared content ${sharedContentId}:`, error);
      throw error;
    }
  }

  // Fetch content from Go Playground using standard fetch API
  private async fetchGoPlaygroundContent(sharedContentId: string): Promise<string | null> {
    try {
      // This mimics the functionality of @syumai/goplayground-node
      // but uses fetch API which is available in Cloudflare Workers
      const response = await fetch(`https://play.golang.org/p/${sharedContentId}.go`);
      
      if (response.ok) {
        return await response.text();
      } else {
        console.error(`Failed to fetch Go Playground content: ${response.status}`);
        return null;
      }
    } catch (error) {
      console.error('Error fetching Go Playground content:', error);
      return null;
    }
  }

  // Custom method to get room statistics
  async getRoomStats(): Promise<{ 
    connections: number; 
    documentSize: number; 
    lastUpdate: number 
  }> {
    try {
      // Note: We can't access private properties directly
      // This is a simplified version - actual implementation would need 
      // to track these metrics differently
      const connections = 0; // Would need to implement connection tracking
      const documentSize = 0; // Would need to get this from YDoc state
      const lastUpdate = Date.now();
      
      return {
        connections,
        documentSize,
        lastUpdate
      };
    } catch (error) {
      console.error('Error getting room stats:', error);
      return {
        connections: 0,
        documentSize: 0,
        lastUpdate: 0
      };
    }
  }

  // Handle custom WebSocket messages if needed
  async webSocketMessage(ws: WebSocket, message: ArrayBuffer | string): Promise<void> {
    // Handle custom message types if needed
    if (typeof message === 'string') {
      try {
        const data = JSON.parse(message);
        
        if (data.type === 'load-shared-content' && data.sharedContentId) {
          await this.loadSharedContent(data.sharedContentId);
          return;
        }
        
        if (data.type === 'get-room-stats') {
          const stats = await this.getRoomStats();
          ws.send(JSON.stringify({
            type: 'room-stats',
            data: stats
          }));
          return;
        }
      } catch (error) {
        console.error('Error parsing custom message:', error);
      }
    }

    // Delegate to parent for Yjs message handling
    await super.webSocketMessage(ws, message);
  }

  // Handle WebSocket close events
  async webSocketClose(ws: WebSocket): Promise<void> {
    console.log(`WebSocket closed`);
    
    // Call parent close handler
    await super.webSocketClose?.(ws);
    
    console.log('Connection closed, room will be cleaned up automatically by Cloudflare if no more connections');
  }
}