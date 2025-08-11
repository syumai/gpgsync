const { EventEmitter } = require("events");
const TextOperation = require("ot/lib/text-operation");
const WrappedOperation = require("ot/lib/wrapped-operation");
const Server = require("ot/lib/server");
const Selection = require("ot/lib/selection");

class EditorSocketIOServer extends Server {
  constructor(document, operations, docId, mayWrite) {
    super(document, operations);
    EventEmitter.call(this);
    this.users = {};
    this.docId = docId;
    this.mayWrite = mayWrite || ((_, cb) => cb(true));
  }

  addClient(socket) {
    socket
      .join(this.docId)
      .emit("doc", {
        str: this.document,
        revision: this.operations.length,
        clients: this.users,
      })
      .on("operation", (revision, operation, selection) => {
        this.mayWrite(socket, (mayWrite) => {
          if (!mayWrite) {
            console.log("User doesn't have the right to edit.");
            return;
          }
          this.onOperation(socket, revision, operation, selection);
        });
      })
      .on("selection", (obj) => {
        this.mayWrite(socket, (mayWrite) => {
          if (!mayWrite) {
            console.log("User doesn't have the right to edit.");
            return;
          }
          this.updateSelection(socket, obj && Selection.fromJSON(obj));
        });
      })
      .on("disconnect", () => {
        socket.leave(this.docId);
        this.onDisconnect(socket);
        if (Object.keys(this.users).length === 0) {
          this.emit("empty-room");
        }
      });
  }

  onOperation(socket, revision, operation, selection) {
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

  updateSelection(socket, selection) {
    const clientId = socket.id;
    if (selection) {
      this.getClient(clientId).selection = selection;
    } else {
      delete this.getClient(clientId).selection;
    }
    socket.broadcast.in(this.docId).emit("selection", clientId, selection);
  }

  setName(socket, name) {
    const clientId = socket.id;
    this.getClient(clientId).name = name;
    socket.broadcast.in(this.docId).emit("set_name", clientId, name);
  }

  getClient(clientId) {
    return this.users[clientId] || (this.users[clientId] = {});
  }

  onDisconnect(socket) {
    const clientId = socket.id;
    delete this.users[clientId];
    socket.broadcast.in(this.docId).emit("client_left", clientId);
  }
}

function extend(target, source) {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      target[key] = source[key];
    }
  }
}

extend(EditorSocketIOServer.prototype, EventEmitter.prototype);

module.exports = EditorSocketIOServer;
