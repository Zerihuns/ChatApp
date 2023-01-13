import { HomeComponent } from './home/home.component';
import { NgModule, OnInit } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';

const routes: Routes = [
  {path : 'chat/:username', component : ChatComponent},
  {path : 'home', component : HomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule implements OnInit {
  constructor( private router: Router){}
  ngOnInit(): void {
    this.router.navigate(['/chat']);
  }
}
