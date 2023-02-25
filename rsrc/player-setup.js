export function init(selector) {
  let element = document.querySelector(selector);
  element.innerHTML = html;

  element.addEventListener("keyup", handleEnterKey)
}

function handleEnterKey(event) {
  if (event.key !== "Enter") { return; }
  tryStartGame();
}

const html = `
<h2>Game Setup</h2>

<p>
  <label>Player 1: <input type="text" autofocus></label>
</p>
<p>
  <label>Player 2: <input type="text"></label>
</p>
<p>
  <label>Player 3: <input type="text"></label>
</p>
<p>
  <label>Player 4: <input type="text"></label>
</p>
<p>
  <label>Player 5: <input type="text"></label>
</p>
<p>
  <label>Player 6: <input type="text"></label>
</p>
<p>
  <label>Player 7: <input type="text"></label>
</p>
<p>
  <label>Player 8: <input type="text"></label>
</p>
<p>
  <label>Player 9: <input type="text"></label>
</p>
<p>
  <label>Player 10: <input type="text"></label>
</p>

<button (click)="tryStartGame()">Start game</button>
`
