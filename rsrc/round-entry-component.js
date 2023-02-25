// Alpine.js is used in this component.
// Docs: https://alpinejs.dev/start-here

class RoundEntry extends HTMLElement {
  connectedCallback() {
    this.round = this.dataset.round;

    Alpine.data('round_' + this.round, this.createReactiveData.bind(this));

    this.render();
  }

  createReactiveData() {
    return {
      round: this.round,
      diceRolls: ['', '', ''],
      get pointsAtStake() {
        return window.Game.pointsAtStakeInRound(this.round);
      },
      get columnCount() {
        const fixedColumnCount = 2
        const dynamicColumnCount = window.Game.players.length
        return fixedColumnCount + dynamicColumnCount;
      },
      /** Remember, players are just names. */
      get players() {
        return window.Game.players;
      }
    }
  }

  render() {
    this.innerHTML =
      html
      .replace('x-data="round_1"', `x-data="round_${this.round}"`);
  }
}

const html = `
<div x-data="round_1">
<h3>
  Round <span x-text="round"></span> — <span x-text="pointsAtStake"></span> points at stake
</h3>

<section class="control-grid limit-height" x-bind:style="'--column-count: ' + columnCount">

  <span class="column-header">Roll #</span>
  <span class="column-header center">Rolled</span>
  <template x-for="player in players">
  <span class="column-header" x-text="player"></span>
  </template>

  <template x-for="(_, index) in diceRolls">
    <span class="cell col1" x-text="index + 1"></span>
  </template>

  <template x-for="(_, index) in diceRolls">
    <div class="roll-input col2" >
      <input type="text" class="roll-input" [formControlName]="iRow" tabindex="10" #rollInput>
    </div>
  </template>

  <template x-for="(_, iRow) in diceRolls">
    <template x-for="(playerName, iPlayer) in players">
      <input type="radio"
        [value]="iRow"
        (click)="refocusNextEmptyRollInput()"
        title="Mark that {{playerName}} went out after this roll"

        x-bind:style="{
          'grid-row': 1 + iRow + 1,
          'grid-column': 2 + iPlayer + 1
        }"
        [formControlName]="playerName">
    </template>
  </template>

  <span class="fainter normal-cursor center col2" title="(More rows will appear as needed.)">⏬</span>

  <button *ngFor="let playerName of players; index as iPlayer"
    (click)="setPlayerBackIn(playerName)"
    class="back-in-button"
    style.grid-row="last"
    [style.grid-column]="2 + iPlayer + 1"
    title="Undo marking {{playerName}} as out"
    [disabled]="isPlayerStillIn(playerName)">
    Back In
  </button>

</section>

<p *ngIf="errorMessage">{{errorMessage}}</p>

<div class="margin-after-round"></div>

</div>
`

customElements.define("round-entry", RoundEntry);
