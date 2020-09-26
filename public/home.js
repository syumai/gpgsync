import { nanoid } from "https://cdn.jsdelivr.net/npm/nanoid@3.1.12/nanoid.js";

const generatedId = nanoid(6);

const joinForm = document.getElementById("joinForm");
joinForm.roomId.setAttribute("placeholder", generatedId);
joinForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let roomId = e.target.roomId.value;
  if (roomId === "") {
    roomId = generatedId;
  }
  let roomUri = `/rooms/${roomId}`;
  if (sharedContentId) {
    roomUri += `/p/${sharedContentId}`;
  }
  window.location.href = roomUri;
});
