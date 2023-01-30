import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { ChatService } from './chat/chat.service';
import { HomeComponent } from './home/home.component';
import { MsgreplayDirective } from './chat/msgreplay.directive';
import { TextareaAutoresizeDirectiveDirective } from './chat/textarea-autoresize-directive.directive';
import { LoginComponent } from './login/login.component';
import { HttpClientModule , HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';


@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    HomeComponent,
    MsgreplayDirective,
    TextareaAutoresizeDirectiveDirective,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    CommonModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ChatService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
