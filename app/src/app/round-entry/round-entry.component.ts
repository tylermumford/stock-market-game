import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'round-entry',
  templateUrl: './round-entry.component.html',
  styleUrls: ['./round-entry.component.css']
})
export class RoundEntryComponent implements OnInit {

  @Input() round: number

  constructor() { }

  ngOnInit(): void {
  }

}
