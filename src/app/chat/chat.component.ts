import {
  AfterViewInit, Component,
  ElementRef,
  NgZone,QueryList,
  OnDestroy, OnInit, ViewChildren, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from '../_models/Message';
import { AvatarService } from '../_services/avatar.service'
import { MsgreplayDirective } from './msgreplay.directive';
import { AccountService } from '@app/_services';
import { User } from '@app/_models';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatService } from '@app/_services/chat.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']

})
export class ChatComponent  implements OnInit,AfterViewInit, OnDestroy{
  AllMessages:Message[] = []
  ActiveMessages:Message[] = []
  inputMessage = ''
  receiver? : User
  username = ''
  @ViewChild('messagesbox') private myScrollContainer?: ElementRef;
  @ViewChildren(MsgreplayDirective) scrollableMsg?: QueryList<MsgreplayDirective>

  constructor(
    private elementRef:ElementRef,
    private _chatService : ChatService,
    private _ngZone: NgZone,
    private router: Router,
    private route: ActivatedRoute,
    private _avatarService :AvatarService,
    private _accountService: AccountService
    ) {
      this.subscribeToEvents()

    }


  ngOnDestroy(): void {}
  ngAfterViewInit(): void {}

  ngOnInit(): void {
      //TODO Fix
      this.username = this._accountService.userValue?.username ?? ""
      this._chatService.StartConnection(this.username);
      this.route.params.subscribe((params) => {

        let users : BehaviorSubject<User[]> = new BehaviorSubject(JSON.parse(localStorage.getItem('users')!));
        this.receiver = users.value.filter(u => u.userID == +params['id'])[0]
        console.log(params);
        console.log(this.route.snapshot.data);
      });

  }

  async insertMessage(...args: KeyboardEvent[]) {
    if (args.length > 0){
      if(!((args[0].key == "Enter" || args[0].keyCode == 10) && args[0].ctrlKey))
        return
    }
    if (this.inputMessage) {
      let newMessage:Message = {
        Username: this.username,
        Msg: this.inputMessage,
        TypingState: false,
        Personal: true,
        Avatar : ""
      }

      this.AllMessages.push(newMessage);
      this.ActiveMessages.push(newMessage)

      try {
        await this._chatService.sendMessage(this.inputMessage,this.receiver?.username??'');
      } catch {
      }

      this.inputMessage = '';
      this.updateScrollbar();
    }
  }

  updateScrollbar() {
    if(this.myScrollContainer){
      this.myScrollContainer.nativeElement.scrollTo(0, 0);
    }
  }

  private subscribeToEvents(): void {
    this._chatService.messageReceived.subscribe((message: Message) => {
      this._ngZone.run(() => {
        this.sendMessageWithLoadding(message.Msg,message.Username)
        console.log("Message From Server : " + message.Msg)
      });
    });
  }

  sendMessageWithLoadding(msg : string,username : string){
    let newMessage:Message = {
      Username: username,
      TypingState: false,
      Msg: msg,
      Personal: false,
      Avatar : this._avatarService.GenerateAvatar(username[0], "white", "#009578")
    }

    this.AllMessages.push(newMessage)

    if (this.receiver?.username === username){
      let elemnt = this.elementRef.nativeElement.querySelector('.messages-content');
      elemnt.insertAdjacentHTML('beforeend', this.SendLoad(username[0]))

      setTimeout(()=>{

        let load = this.elementRef.nativeElement.querySelector('.message.loading');
        load.remove()
        this.ActiveMessages.push(newMessage)
        this.updateScrollbar()
      },1000 + (Math.random() * 10) * 100)
    }

  }

  SendLoad(ava:string):string{
    return`
    <div class="message loading new">
      <figure class="avatar">
        <img src=${this._avatarService.GenerateAvatar(ava, "white", "#009578")} />
      </figure>
      <span></span>
    </div>
    `
  }
}





/*

  <div class="message message-with-replay">
  <div class="message message-replay">..</div>
  <div class="message message-personal"> ${msg} </div>
  </div>


  */
