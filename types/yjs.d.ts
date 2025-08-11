declare module 'yjs' {
  export class Doc {
    constructor();
    getText(name?: string): Text;
    getMap(name?: string): Map<any>;
    getArray(name?: string): Array<any>;
    transact(fn: () => void, origin?: any): void;
    destroy(): void;
    clientID: number;
  }

  export class Text {
    insert(index: number, text: string, attributes?: any): void;
    delete(index: number, length: number): void;
    toString(): string;
    observe(fn: (event: any) => void): void;
    unobserve(fn: (event: any) => void): void;
    length: number;
  }

  export class Map<T> {
    set(key: string, value: T): void;
    get(key: string): T | undefined;
    delete(key: string): void;
    observe(fn: (event: any) => void): void;
    unobserve(fn: (event: any) => void): void;
  }

  export class Array<T> {
    insert(index: number, content: T[]): void;
    delete(index: number, length?: number): void;
    get(index: number): T;
    observe(fn: (event: any) => void): void;
    unobserve(fn: (event: any) => void): void;
    length: number;
  }

  export function createRelativePositionFromTypeIndex(type: any, index: number): any;
  export function createAbsolutePositionFromRelativePosition(relativePosition: any, doc: Doc): any;
  export function compareRelativePositions(a: any, b: any): boolean;
  export function createRelativePositionFromJSON(json: string): any;
}

declare module 'y-websocket' {
  import { Doc } from 'yjs';
  
  export class WebsocketProvider {
    constructor(serverUrl: string, roomname: string, doc: Doc, options?: any);
    awareness: any;
    doc: Doc;
    roomname: string;
    url: string;
    destroy(): void;
    disconnect(): void;
    connect(): void;
  }
}

declare module 'y-codemirror' {
  import { Text } from 'yjs';
  import { Editor } from 'codemirror';

  export class CodemirrorBinding {
    constructor(ytext: Text, editor: Editor, awareness?: any, options?: any);
    destroy(): void;
  }
}

declare module 'y-protocols/awareness' {
  export class Awareness {
    constructor(doc: any);
    getLocalState(): any;
    setLocalStateField(field: string, value: any): void;
    getStates(): Map<number, any>;
    on(eventName: string, handler: (event: any) => void): void;
    off(eventName: string, handler: (event: any) => void): void;
    destroy(): void;
  }
}

declare module '@syumai/goplayground-node' {
  export class GoPlayground {
    constructor();
    download(sharedContentId: string): Promise<string>;
  }
}