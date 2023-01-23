import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form = new FormGroup({
    'username': new FormControl(),
    'password': new FormControl(),
    'checkbox': new FormControl()
  })
  constructor( private router: Router){}
  JoinChat(){
    let username : string = this.form.value.username
    this.router.navigate(['/chat',username]);
  }
}
