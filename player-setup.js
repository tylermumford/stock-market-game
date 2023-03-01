export function init(selector) {
  let element = document.querySelector(selector);
  element.addEventListener("keyup", handleEnterKey);

  let button = document.querySelector("#start-game");
  button.addEventListener("click", tryStartGame);

  // // testing code to quickly reach the game ui
  // setTimeout(() => {
  //   window.Game.addPlayer("Jane")
  //   window.Game.addPlayer("Sarah")
  //   window.Game.addPlayer("Tyler")
  //   tryStartGame()
  // }, 250)
}

function handleEnterKey(event) {
  if (event.key !== "Enter") { return; }
  tryStartGame();
}

function tryStartGame() {
  let inputs = document.querySelectorAll("input");

  inputs.forEach(element => {
    const playerName = element.value
    if (playerName) {
      window.Game.addPlayer(playerName)
    }
  })

  try {
    window.Game.startPlaying()
    alert(`Game starting with ${window.Game.playerCount} players.`)
    document.dispatchEvent(new Event("startGame"));
  } catch (e) {
    alert(e)
  }
}
