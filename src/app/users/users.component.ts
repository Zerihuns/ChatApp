import { User } from '@app/_models';
import { Component } from '@angular/core';
import { AccountService, AvatarService } from '@app/_services';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  users :User[] = [];
  constructor(
    private _avatarService :AvatarService,
    private _accountService: AccountService,
    private router: Router

  ){

    let usersDb : BehaviorSubject<User[]> = new BehaviorSubject(JSON.parse(localStorage.getItem('users')!));
    if(usersDb.value){
      this.users = usersDb.value
    }else{
      _accountService.getAll().subscribe(users => {
        this.users = users
        this.users = _avatarService.BuildAvatar(this.users)
        localStorage.setItem('users', JSON.stringify(this.users));
      })
    }
  }

  goToChat(id:number) {
  this.router.navigate(['/chat', id]);
  }

  logout(){
    console.log("Logout Press")
    this._accountService.logout();
  }
}
