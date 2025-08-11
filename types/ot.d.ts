declare module 'ot/lib/text-operation' {
  class TextOperation {
    static fromJSON(obj: any): TextOperation;
    toJSON(): any;
  }
  export = TextOperation;
}

declare module 'ot/lib/wrapped-operation' {
  import TextOperation = require('ot/lib/text-operation');
  import Selection = require('ot/lib/selection');
  
  class WrappedOperation {
    constructor(operation: TextOperation, selection?: Selection);
    wrapped: TextOperation;
    meta: Selection;
    toJSON(): any;
  }
  export = WrappedOperation;
}

declare module 'ot/lib/server' {
  import TextOperation = require('ot/lib/text-operation');
  import WrappedOperation = require('ot/lib/wrapped-operation');
  
  class Server {
    constructor(document: string, operations: any[]);
    document: string;
    operations: any[];
    receiveOperation(revision: number, operation: WrappedOperation): any;
  }
  export = Server;
}

declare module 'ot/lib/selection' {
  class Selection {
    static fromJSON(obj: any): Selection;
    toJSON(): any;
  }
  export = Selection;
}