/* Original contents is available on https://github.com/syumai/go-playground-custom */

import { GoPlayground } from "https://cdn.jsdelivr.net/npm/@syumai/goplayground@0.1.6/index.js";
const gpOriginal = new GoPlayground();
const gpTip = new GoPlayground("https://gotipplay.golang.org");
let gp = gpOriginal;

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

const optionsStr = window.localStorage.getItem("goplayground-options");
const optionKeys = ["goimports", "gotip", "vimMode", "tabSize"];
const defaultOptions = {
  goimports: false,
  gotip: false,
  vimMode: false,
  tabSize: 8,
};
const parsedOptions = JSON.parse(optionsStr) || {};
const options =
  optionKeys.length === Object.keys(parsedOptions).length
    ? parsedOptions
    : defaultOptions;

const gpResult = document.getElementById("gpResult");
const gpOptions = document.getElementById("gpOptions");

const gpRunBtn = document.getElementById("gpRunBtn");
const gpFmtBtn = document.getElementById("gpFmtBtn");
const gpShareBtn = document.getElementById("gpShareBtn");

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

async function executeRun() {
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
  editor.save();
  gpResult.textContent = waitingMsg;
  const result = await gp.share(gpBody.value);
  gpResult.innerHTML = "";
  gpResult.appendChild(createLink(`${gp.hostName}/p/${result}`));
}

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

function applyOptions() {
  editor.setOption("keyMap", options.vimMode ? "vim" : "default");
  editor.setOption("tabSize", options.tabSize);
  editor.setOption("indentUnit", options.tabSize);
  if (options.gotip) {
    gp = gpTip;
  } else {
    gp = gpOriginal;
  }
}

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
initOptionsForm();

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

const socket = io();
const adapter = new ot.SocketIOAdapter(socket);
const cmAdapter = new ot.CodeMirrorAdapter(editor);

socket.emit("join", {
  docId: roomId,
  sharedContentId,
});

socket.on("doc", (data) => {
  editor.setValue(data.str);
  new ot.EditorClient(data.revision, data.clients, adapter, cmAdapter);
});
