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
  username = ''

  constructor(
    private _avatarService :AvatarService,
    private _accountService: AccountService,
    private router: Router

  ){
    this.username = this._accountService.userValue?.username ?? ""

    let usersDb : BehaviorSubject<User[]> = new BehaviorSubject(JSON.parse(localStorage.getItem('users')!));
    if(usersDb.value){
      this.users = usersDb.value
    }else{
      _accountService.getAll().subscribe(users => {
        users.forEach(u => {if(u.username !== this.username) this.users.push(u)})
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
