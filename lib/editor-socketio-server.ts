import type { Socket } from "socket.io";
import type { EventEmitter } from "events";
const EventEmitterClass = require("events").EventEmitter;
const TextOperation = require("ot/lib/text-operation");
const WrappedOperation = require("ot/lib/wrapped-operation");
const Server = require("ot/lib/server");
const Selection = require("ot/lib/selection");

interface Client {
  selection?: Selection;
  name?: string;
}

type MayWriteCallback = (mayWrite: boolean) => void;
type MayWriteFunction = (socket: Socket, callback: MayWriteCallback) => void;

interface EditorSocketIOServer extends EventEmitter {}

class EditorSocketIOServer extends Server {
  public users: { [clientId: string]: Client };
  public docId: string;
  public mayWrite: MayWriteFunction;

  constructor(document: string, operations: any[], docId: string, mayWrite?: MayWriteFunction) {
    super(document, operations);
    EventEmitterClass.call(this);
    this.users = {};
    this.docId = docId;
    this.mayWrite = mayWrite || ((_: Socket, cb: MayWriteCallback) => cb(true));
  }

  addClient(socket: Socket): void {
    socket.join(this.docId);
    socket.emit("doc", {
        str: this.document,
        revision: this.operations.length,
        clients: this.users,
      });
    
    socket.on("operation", (revision: number, operation: any, selection: any) => {
        this.mayWrite(socket, (mayWrite) => {
          if (!mayWrite) {
            console.log("User doesn't have the right to edit.");
            return;
          }
          this.onOperation(socket, revision, operation, selection);
        });
      });
    
    socket.on("selection", (obj: any) => {
        this.mayWrite(socket, (mayWrite) => {
          if (!mayWrite) {
            console.log("User doesn't have the right to edit.");
            return;
          }
          this.updateSelection(socket, obj && Selection.fromJSON(obj));
        });
      });
    
    socket.on("disconnect", () => {
        socket.leave(this.docId);
        this.onDisconnect(socket);
        if (Object.keys(this.users).length === 0) {
          this.emit("empty-room");
        }
      });
  }

  onOperation(socket: Socket, revision: number, operation: any, selection: any): void {
    let wrapped;
    try {
      wrapped = new WrappedOperation(
        TextOperation.fromJSON(operation),
        selection && Selection.fromJSON(selection)
      );
    } catch (exc) {
      console.error("Invalid operation received: " + exc);
      return;
    }

    try {
      const clientId = socket.id;
      const wrappedPrime = this.receiveOperation(revision, wrapped);
      this.getClient(clientId).selection = wrappedPrime.meta;
      socket.emit("ack");
      socket.broadcast
        .in(this.docId)
        .emit(
          "operation",
          clientId,
          wrappedPrime.wrapped.toJSON(),
          wrappedPrime.meta
        );
    } catch (exc) {
      console.error(exc);
    }
  }

  updateSelection(socket: Socket, selection: Selection | null): void {
    const clientId = socket.id;
    if (selection) {
      this.getClient(clientId).selection = selection;
    } else {
      delete this.getClient(clientId).selection;
    }
    socket.broadcast.in(this.docId).emit("selection", clientId, selection);
  }

  setName(socket: Socket, name: string): void {
    const clientId = socket.id;
    this.getClient(clientId).name = name;
    socket.broadcast.in(this.docId).emit("set_name", clientId, name);
  }

  getClient(clientId: string): Client {
    return this.users[clientId] || (this.users[clientId] = {});
  }

  onDisconnect(socket: Socket): void {
    const clientId = socket.id;
    delete this.users[clientId];
    socket.broadcast.in(this.docId).emit("client_left", clientId);
  }
}

function extend(target: any, source: any): void {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      target[key] = source[key];
    }
  }
}

extend(EditorSocketIOServer.prototype, EventEmitterClass.prototype);

module.exports = EditorSocketIOServer;
