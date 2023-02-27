# Stock Market Game

## Spec

- Choose the number of players
- Name the players
- Start the game

## Anti-spec

These features are not included.

- Choose the number of rounds to play.

## Extras

~~This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.0.~~

## Rewritten

I created this game with Angular 9 in 2020. In 2023, I updated it to Angular 15, but I wasn't satisfied with the upgrade experience, and I was frustrated with npm package conflicts. So I decided to port it away from Angular.

I settled on a bit of a strange mix of standard Web Components and Alpine.js. This required a couple small sacrifices from Angular (I switched from a CSS grid to a table in one component, and I haven't yet implemented sorting for the score list). It took a few nights.

But the benefits are worth it. Now:

- No build step
- No node_modules
- Only 1 dependency
- Only 10 files, instead of 54
- Only 532 lines of HTML+CSS+JS, instead of 1,029
- Complexity score of 37, instead of 77
  (And that's including Alpine, but not including Angular!!)
- ~70kb footprint, instead of ~300kb
- Runtime performance is very similar, with room for improvement

(code metrics from scc)

Much. Better.
