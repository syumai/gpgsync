/* Original contents is available on https://github.com/syumai/go-playground-custom */

// Import dependencies from npm packages
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { CodemirrorBinding } from 'y-codemirror';
import { GoPlayground } from '@syumai/goplayground';

// Go Playground setup
let gpOriginal, gpTip, gp;

function initGoPlayground() {
  gpOriginal = new GoPlayground();
  gpTip = new GoPlayground("https://gotipplay.golang.org");
  gp = gpOriginal;
}

// CodeMirror editor setup
const gpBody = document.getElementById("gpBody");
const editor = CodeMirror.fromTextArea(gpBody, {
  lineNumbers: true,
  mode: "text/x-go",
  tabSize: 8,
  indentUnit: 8,
  indentWithTabs: true,
  matchBrackets: true,
});
window.editor = editor;

// Options management
const optionsStr = window.localStorage.getItem("goplayground-options");
const optionKeys = ["goimports", "vimMode", "tabSize"];
const defaultOptions = {
  goimports: false,
  vimMode: false,
  tabSize: 8,
};
const parsedOptions = JSON.parse(optionsStr) || {};
const options =
  optionKeys.length === Object.keys(parsedOptions).length
    ? parsedOptions
    : defaultOptions;

// DOM elements
const gpResult = document.getElementById("gpResult");
const gpOptions = document.getElementById("gpOptions");
const gpRunBtn = document.getElementById("gpRunBtn");
const gpFmtBtn = document.getElementById("gpFmtBtn");
const gpShareBtn = document.getElementById("gpShareBtn");

// Utility functions
const createLine = (kind, message) => {
  const line = document.createElement("div");
  line.classList.add("line");
  line.classList.add(kind);
  line.textContent = message;
  return line;
};

const createLink = (url) => {
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
async function executeRun() {
  if (!gp) return;
  editor.save();
  gpResult.textContent = waitingMsg;
  const result = await gp.compile(gpBody.value);
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

async function executeFmt() {
  if (!gp) return;
  editor.save();
  gpResult.textContent = waitingMsg;
  const result = await gp.format(gpBody.value, options.goimports);
  gpResult.textContent = "";
  if (result.Error !== "") {
    const line = createLine("stderr", result.Error);
    gpResult.appendChild(line);
    return;
  }
  gpBody.value = result.Body;
  editor.setValue(result.Body);
}

function genShareQuery(key) {
  let query = `?p=${key}`;
  if (options.gotip) {
    query += "&gotip=on";
  }
  return query;
}

async function executeShare() {
  if (!gp) return;
  editor.save();
  gpResult.textContent = waitingMsg;
  const result = await gp.share(gpBody.value);
  console.log({ result });
  gpResult.innerHTML = "";
  gpResult.appendChild(createLink(`${gp.hostName}/p/${result}`));
}

// Event listeners for Go Playground
gpRunBtn.addEventListener("click", () => executeRun());
gpFmtBtn.addEventListener("click", () => executeFmt());
gpShareBtn.addEventListener("click", () => executeShare());

window.addEventListener("keypress", (e) => {
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
function applyOptions() {
  editor.setOption("keyMap", options.vimMode ? "vim" : "default");
  editor.setOption("tabSize", options.tabSize);
  editor.setOption("indentUnit", options.tabSize);
}

// initialize gotipEnabled
const urlParams = new URLSearchParams(window.location.search);
let gotipEnabled = urlParams.get("v") === "gotip";

const goVersionSelect = document.getElementById("goVersion");
goVersionSelect.value = gotipEnabled ? "gotip" : "gorelease";

function applyGotipOption() {
  const urlParams = new URLSearchParams(window.location.search);
  if (gotipEnabled) {
    urlParams.set("v", "gotip");
    gp = gpTip;
  } else {
    urlParams.delete("v");
    gp = gpOriginal;
  }
  const search = urlParams.toString();
  const url = new URL(window.location.href);
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

function initOptionsForm() {
  const gpOptionsForm = document.getElementById("gpOptionsForm");
  window.gpOptionsForm = gpOptionsForm;

  for (const key of optionKeys) {
    const input = gpOptionsForm[key];
    const value = options[key];
    if (input.type === "checkbox") {
      input.checked = value;
      continue;
    }
    input.value = value;
  }

  gpOptionsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    for (const key of optionKeys) {
      const input = gpOptionsForm[key];
      if (input.type === "checkbox") {
        options[key] = input.checked;
        continue;
      }
      if (input.type === "number") {
        options[key] = parseInt(input.value);
        continue;
      }
      options[key] = input.value;
    }
    applyOptions();
    window.localStorage.setItem(
      "goplayground-options",
      JSON.stringify(options)
    );
  });

  applyOptions();
}

const gpOptionsBtn = document.getElementById("gpOptionsBtn");
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
function initCollaborativeEditing() {
  // Get room information from global variables set in template
  const roomId = window.roomId;
  const sharedContentId = window.sharedContentId;
  
  if (!roomId) {
    console.log('No roomId found, skipping collaborative editing setup');
    return;
  }

  // yjs collaborative editing setup
  const ydoc = new Y.Doc();
  const wsUrl = `ws://${window.location.hostname}:1234/ws?room=${roomId}`;
  const provider = new WebsocketProvider(wsUrl, roomId, ydoc);
  const ytext = ydoc.getText('codemirror');
  const binding = new CodemirrorBinding(ytext, editor, provider.awareness);

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
function init() {
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