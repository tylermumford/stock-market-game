import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortScores'
})
export class SortScoresPipe implements PipeTransform {

  transform(value: any[], ...args: unknown[]): unknown {
    let shallowCopy = value.slice();
    shallowCopy.sort((a, b) => {
      // Sorts from highest to lowest
      return (b.points - a.points);
    })
    return shallowCopy;
  }

}
