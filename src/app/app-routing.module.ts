import { LoginComponent } from './login/login.component';
import { NgModule, OnInit } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { AuthGuard } from './_helpers';

const routes: Routes = [
  {path: '', component: ChatComponent, canActivate: [AuthGuard] },
  {path : "login",component : LoginComponent},
  // otherwise redirect to home
   { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule implements OnInit {
  constructor( private router: Router){}
  ngOnInit(): void {
    console.log("App Routing Module ")
    this.router.navigate(['/login']);
  }
}
