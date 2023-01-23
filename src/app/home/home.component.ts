import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  username = ''
  constructor( private router: Router){}
  JoinChat(){
    this.router.navigate(['/chat',this.username]);
  }
}
