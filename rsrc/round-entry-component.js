class RoundEntry extends HTMLElement {
  connectedCallback() {
    this.round = this.dataset.round;

    Alpine.data('round_' + this.round, this.createReactiveData.bind(this));

    this.render();
  }

  createReactiveData() {
    return {
      round: this.round,
      get pointsAtStake() {
        return window.Game.pointsAtStakeInRound(this.round);
      },
      get columnCount() {
        const fixedColumnCount = 2
        const dynamicColumnCount = window.Game.players.length
        return fixedColumnCount + dynamicColumnCount;
      },
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

<section class="control-grid limit-height" x-bind:style="{'--columnCount': columnCount}">

  <span class="column-header">Roll #</span>
  <span class="column-header center">Rolled</span>
  <span class="column-header" *ngFor="let playerName of players">{{playerName}}</span>

  <ng-container *ngFor="let _ of diceRolls.controls; index as iRow" formArrayName="diceRolls">
    <span class="cell col1">{{iRow + 1}}</span>
    <div class="roll-input col2" >
      <input type="text" class="roll-input" [formControlName]="iRow" tabindex="10" #rollInput>
    </div>
  </ng-container>
  <ng-container *ngFor="let _ of diceRolls.controls; index as iRow">
    <input type="radio"
      *ngFor="let playerName of players; index as iPlayer"
      [value]="iRow"
      (click)="refocusNextEmptyRollInput()"
      title="Mark that {{playerName}} went out after this roll"

      [style.grid-row]="1 + iRow + 1"
      [style.grid-column]="2 + iPlayer + 1"
      [formControlName]="playerName">
  </ng-container>

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
