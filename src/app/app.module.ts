import { ChatService } from '@app/_services/chat.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { MsgreplayDirective } from './chat/msgreplay.directive';
import { TextareaAutoresizeDirectiveDirective } from './chat/textarea-autoresize-directive.directive';
import { LoginComponent } from './login/login.component';
import { HttpClientModule , HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import {NgToastModule} from 'ng-angular-popup';
import { UsersComponent } from './users/users.component';

@NgModule({
    declarations: [
        AppComponent,
        ChatComponent,
        MsgreplayDirective,
        TextareaAutoresizeDirectiveDirective,
        LoginComponent,
        UsersComponent,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        ChatService
    ],
    bootstrap: [AppComponent],
    imports: [
        NgToastModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        CommonModule,
        HttpClientModule,
    ]
})
export class AppModule { }
