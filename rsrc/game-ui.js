export function init(selector) {
  let element = document.querySelector(selector);
  element.innerHTML = templatize();
}

function templatize() {
  let roundEntries = [];
  for (let i = 1; i <= 20; i++) {
    roundEntries.push(`
      <div>
      <round-entry data-round=${i} class="overlay" x-data></round-entry>
      </div>
  `);
  }
  let roundEntryHtml = roundEntries.join("\n");

  return html.replace("{{roundEntryHtml}}", roundEntryHtml);
}

const html = `

<section class="left-section">
  <div class="overlay">
    <h2 class="reduced-spacing">Rounds</h2>
  </div>
  <div>
    {{roundEntryHtml}}
  </div>
</section>

<section class="floating-section overlay">
  <h2 class="mt0">Scores</h2>
  <table class="score-table">
    <tbody>
      <tr *ngFor="let score of scores | sortScores">
        <td>{{score.playerName}}</td>
        <td>{{score.points}} points</td>
      </tr>
    </tbody>
  </table>
  <div class="space-at-bottom"></div>
</section>
`
