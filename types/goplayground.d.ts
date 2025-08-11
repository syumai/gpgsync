declare module '@syumai/goplayground-node' {
  export class GoPlayground {
    constructor();
    download(sharedContentId: string): Promise<string>;
  }
}