import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.css']
})
export class VotingComponent implements OnInit{

  // TDD in ANgular: https://youtu.be/oevY4WE1lnw


  public voters:voter[] = [];

  ngOnInit(): void {

    this.voters = [{name: 'x'}, {name: 'y'}, {name: 'z'}];
  }

}

type voter = { name: string;}
