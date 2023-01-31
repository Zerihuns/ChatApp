import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { User } from '@app/_models';


@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;

  constructor(
      private router: Router,
      private http: HttpClient
  ) {
      this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
      this.user = this.userSubject.asObservable();
  }

  public get userValue() {
      return this.userSubject.value;
  }

  login(username: string, password: string) {
      return this.http.post<any>(`${environment.ServerURL}/users/authenticate`, { username, password })
          .pipe(map(response => {
              // store user details and jwt token in local storage to keep user logged in between page refreshes
              console.log("user :: " + JSON.stringify(response.data.user))
              let user : User = response.data.user;
              user.token = response.data.token
              localStorage.setItem('user', JSON.stringify(user));
              this.userSubject.next(user);
              return user;
          }));
    }
  IsLogin() : boolean {
    if (localStorage.getItem("user") === null) {
      return false;
    }
    return true;
  }

  logout() {
      // remove user from local storage and set current user to null
      localStorage.removeItem('user');
      this.userSubject.next(null);
      this.router.navigate(['/login']);
  }

  register(user: User) {
      return this.http.post(`${environment.ServerURL}/users/register`, user);
  }

  getAll() {
      return this.http.get<User[]>(`${environment.ServerURL}/users`);
  }

  getById(id: string) {
      return this.http.get<User>(`${environment.ServerURL}/users/${id}`);
  }

  update(id: Number, params: any) {
      return this.http.put(`${environment.ServerURL}/users/${id}`, params)
          .pipe(map(x => {
              // update stored user if the logged in user updated their own record
              if (id == this.userValue?.userID) {
                  // update local storage
                  const user = { ...this.userValue, ...params };
                  localStorage.setItem('user', JSON.stringify(user));

                  // publish updated user to subscribers
                  this.userSubject.next(user);
              }
              return x;
          }));
  }

  delete(id: number) {
      return this.http.delete(`${environment.ServerURL}/users/${id}`)
          .pipe(map(x => {
              // auto logout if the logged in user deleted their own record
              if (id == this.userValue?.userID) {
                  this.logout();
              }
              return x;
          }));
  }
}
