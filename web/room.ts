/* Original contents is available on https://github.com/syumai/go-playground-custom */

// Import dependencies from npm packages
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { CodemirrorBinding } from 'y-codemirror';
import { GoPlayground } from '@syumai/goplayground';

// Type declarations for global objects and interfaces
interface GoPlaygroundOptions {
  goimports: boolean;
  vimMode: boolean;
  tabSize: number;
}

interface GoPlaygroundResult {
  Errors: string;
  Events: Array<{
    Kind: string;
    Message: string;
  }>;
}

interface GoPlaygroundFormatResult {
  Error: string;
  Body: string;
}

interface CodeMirrorEditor {
  fromTextArea(textarea: HTMLTextAreaElement, config: any): any;
  setOption(option: string, value: any): void;
  setValue(value: string): void;
  save(): void;
}

declare global {
  interface Window {
    CodeMirror: CodeMirrorEditor;
    editor: any;
    roomId: string;
    sharedContentId: string;
    gpOptionsForm: HTMLFormElement;
  }
}

// Go Playground setup
let gpOriginal: GoPlayground, gpTip: GoPlayground, gp: GoPlayground;

function initGoPlayground(): void {
  gpOriginal = new GoPlayground();
  gpTip = new GoPlayground("https://gotipplay.golang.org");
  gp = gpOriginal;
}

// CodeMirror editor setup
const gpBody = document.getElementById("gpBody") as HTMLTextAreaElement;
const editor = window.CodeMirror.fromTextArea(gpBody, {
  lineNumbers: true,
  mode: "text/x-go",
  tabSize: 8,
  indentUnit: 8,
  indentWithTabs: true,
  matchBrackets: true,
});
window.editor = editor;

// Options management
const optionsStr: string | null = window.localStorage.getItem("goplayground-options");
const optionKeys: (keyof GoPlaygroundOptions)[] = ["goimports", "vimMode", "tabSize"];
const defaultOptions: GoPlaygroundOptions = {
  goimports: false,
  vimMode: false,
  tabSize: 8,
};
const parsedOptions: Partial<GoPlaygroundOptions> = optionsStr ? JSON.parse(optionsStr) : {};
const options: GoPlaygroundOptions =
  optionKeys.length === Object.keys(parsedOptions).length
    ? parsedOptions as GoPlaygroundOptions
    : defaultOptions;

// DOM elements
const gpResult = document.getElementById("gpResult") as HTMLDivElement;
const gpOptions = document.getElementById("gpOptions") as HTMLDivElement;
const gpRunBtn = document.getElementById("gpRunBtn") as HTMLButtonElement;
const gpFmtBtn = document.getElementById("gpFmtBtn") as HTMLButtonElement;
const gpShareBtn = document.getElementById("gpShareBtn") as HTMLButtonElement;

// Utility functions
const createLine = (kind: string, message: string): HTMLDivElement => {
  const line = document.createElement("div");
  line.classList.add("line");
  line.classList.add(kind);
  line.textContent = message;
  return line;
};

const createLink = (url: string): HTMLDivElement => {
  const div = document.createElement("div");
  const link = document.createElement("a");
  link.textContent = url;
  link.href = url;
  link.target = "_blank";
  div.appendChild(link);
  return div;
};

const waitingMsg = "Waiting for remote server...";

// Go Playground functions
async function executeRun(): Promise<void> {
  if (!gp) return;
  editor.save();
  gpResult.textContent = waitingMsg;
  const result: GoPlaygroundResult = await gp.compile(gpBody.value);
  gpResult.textContent = "";
  if (result.Errors !== "") {
    const line = createLine("stderr", result.Errors);
    gpResult.appendChild(line);
    return;
  }
  for (const event of result.Events) {
    const line = createLine(event.Kind, event.Message);
    gpResult.appendChild(line);
  }
  gpResult.appendChild(
    createLine(
      "system",
      `
Program exited.`
    )
  );
}

async function executeFmt(): Promise<void> {
  if (!gp) return;
  editor.save();
  gpResult.textContent = waitingMsg;
  const result: GoPlaygroundFormatResult = await gp.format(gpBody.value, options.goimports);
  gpResult.textContent = "";
  if (result.Error !== "") {
    const line = createLine("stderr", result.Error);
    gpResult.appendChild(line);
    return;
  }
  gpBody.value = result.Body;
  editor.setValue(result.Body);
}

function genShareQuery(key: string): string {
  const query = `?p=${key}`;
  if ((options as any).gotip) {
    return query + "&gotip=on";
  }
  return query;
}

async function executeShare(): Promise<void> {
  if (!gp) return;
  editor.save();
  gpResult.textContent = waitingMsg;
  const result: string = await gp.share(gpBody.value);
  console.log({ result });
  gpResult.innerHTML = "";
  gpResult.appendChild(createLink(`https://go.dev/play/p/${result}`));
}

// Event listeners for Go Playground
gpRunBtn.addEventListener("click", () => executeRun());
gpFmtBtn.addEventListener("click", () => executeFmt());
gpShareBtn.addEventListener("click", () => executeShare());

window.addEventListener("keypress", (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    if (e.shiftKey) {
      e.preventDefault();
      executeRun();
    }
    if (e.ctrlKey) {
      e.preventDefault();
      executeFmt();
    }
  }
});

// Options functions
function applyOptions(): void {
  editor.setOption("keyMap", options.vimMode ? "vim" : "default");
  editor.setOption("tabSize", options.tabSize);
  editor.setOption("indentUnit", options.tabSize);
}

// initialize gotipEnabled
const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
let gotipEnabled: boolean = urlParams.get("v") === "gotip";

const goVersionSelect = document.getElementById("goVersion") as HTMLSelectElement;
goVersionSelect.value = gotipEnabled ? "gotip" : "gorelease";

function applyGotipOption(): void {
  const urlParams = new URLSearchParams(window.location.search);
  if (gotipEnabled) {
    urlParams.set("v", "gotip");
    gp = gpTip;
  } else {
    urlParams.delete("v");
    gp = gpOriginal;
  }
  const search: string = urlParams.toString();
  const url: URL = new URL(window.location.href);
  if (search) {
    url.search = `?${search}`;
  } else {
    url.search = "";
  }
  window.history.replaceState(null, "", url);
}

goVersionSelect.addEventListener("change", () => {
  gotipEnabled = goVersionSelect.value === "gotip";
  applyGotipOption();
});

function initOptionsForm(): void {
  const gpOptionsForm = document.getElementById("gpOptionsForm") as HTMLFormElement;
  window.gpOptionsForm = gpOptionsForm;

  for (const key of optionKeys) {
    const input = (gpOptionsForm as any)[key] as HTMLInputElement;
    const value = options[key];
    if (input.type === "checkbox") {
      input.checked = value as boolean;
      continue;
    }
    input.value = value.toString();
  }

  gpOptionsForm.addEventListener("submit", (e: Event) => {
    e.preventDefault();
    for (const key of optionKeys) {
      const input = (gpOptionsForm as any)[key] as HTMLInputElement;
      if (input.type === "checkbox") {
        (options as any)[key] = input.checked;
        continue;
      }
      if (input.type === "number") {
        (options as any)[key] = parseInt(input.value);
        continue;
      }
      (options as any)[key] = input.value;
    }
    applyOptions();
    window.localStorage.setItem(
      "goplayground-options",
      JSON.stringify(options)
    );
  });

  applyOptions();
}

const gpOptionsBtn = document.getElementById("gpOptionsBtn") as HTMLButtonElement;
gpOptionsBtn.addEventListener("click", () => {
  const closedLabel = "Options";
  const openedLabel = "Hide Options";
  if (gpOptionsBtn.textContent === closedLabel) {
    gpOptionsBtn.textContent = openedLabel;
    gpOptions.classList.remove("hidden");
    gpResult.classList.add("hidden");
    return;
  }
  gpOptionsBtn.textContent = closedLabel;
  gpResult.classList.remove("hidden");
  gpOptions.classList.add("hidden");
});

// Yjs collaborative editing setup
function initCollaborativeEditing(): void {
  // Get room information from global variables set in template
  const roomId: string = window.roomId;
  const sharedContentId: string = window.sharedContentId;
  
  if (!roomId) {
    console.log('No roomId found, skipping collaborative editing setup');
    return;
  }

  // yjs collaborative editing setup
  const ydoc: Y.Doc = new Y.Doc();
  const wsUrl: string = `ws://${window.location.hostname}:8136/ws?room=${roomId}`;
  const provider: WebsocketProvider = new WebsocketProvider(wsUrl, roomId, ydoc);
  const ytext: Y.Text = ydoc.getText('codemirror');
  const binding: CodemirrorBinding = new CodemirrorBinding(ytext, editor, provider.awareness);

  // Set up awareness (cursor sharing)
  provider.awareness.setLocalStateField('user', {
    name: 'User ' + Math.floor(Math.random() * 100),
    color: '#' + Math.floor(Math.random() * 16777215).toString(16)
  });

  // Load shared content if provided
  if (sharedContentId && sharedContentId.trim() !== '') {
    console.log(`Loading shared content: ${sharedContentId}`);
    // The server will handle loading shared content
  }

  console.log('yjs collaborative editing initialized');
}

// Initialize everything when DOM is loaded
function init(): void {
  initGoPlayground();
  applyGotipOption();
  initOptionsForm();
  
  // Wait for CodeMirror to be fully initialized
  setTimeout(() => {
    initCollaborativeEditing();
  }, 100);
}

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}