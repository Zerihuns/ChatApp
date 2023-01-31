import { ChatService } from './chat.service';
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


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']

})
export class ChatComponent  implements OnInit,AfterViewInit, OnDestroy{
  Messages:Message[] = []
  user: User | null;
  username = 'D'
  inputMessage = ''
  userAvater = ''
  @ViewChild('messagesbox') private myScrollContainer?: ElementRef;
  @ViewChildren(MsgreplayDirective) scrollableMsg?: QueryList<MsgreplayDirective>

  constructor(
    private elementRef:ElementRef,
    private _chatService : ChatService,
    private _ngZone: NgZone,
    private router: Router,
    private param : ActivatedRoute,
    private _avatarService :AvatarService,
    private accountService: AccountService
    ) {
      this.subscribeToEvents()
      this.user = this.accountService.userValue;

    }


  ngOnDestroy(): void {}
  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    console.log("Chat componet load ")

      // if(!this.accountService.IsLogin()){
      //   this.router.navigate(['/login'], {
      //     skipLocationChange: true,
      //   });
      // }

      let username = this.accountService.userValue?.username
      console.log("Active UserName : "+this.accountService.userValue?.username);
      if(username){
        this.username = username
        this.userAvater = this._avatarService.GenerateAvatar(username[0], "white", "#009578")
        this._chatService.StartConnection(username);
      }else{
        console.log("Username unknown")
        this.router.navigate(['/login'], {
          skipLocationChange: true,
        });
      }

  }
  logout(){
    this.accountService.logout();
  }
  async insertMessage(...args: KeyboardEvent[]) {
    if (args.length > 0){
      if(!((args[0].key == "Enter" || args[0].keyCode == 10) && args[0].ctrlKey))
        return
    }
    if (this.inputMessage) {
      this.Messages.push({
        Username: this.username,
        Msg: this.inputMessage,
        TypingState: false,
        Personal: true,
        Avatar : ""
      });

      try {
        await this._chatService.sendMessage(this.inputMessage);
      } catch { }

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
        let elemnt = this.elementRef.nativeElement.querySelector('.messages-content');
        elemnt.insertAdjacentHTML('beforeend', this.SendLoad(message.Username[0]))
        this.updateScrollbar()
        this.sendMessageWithLoadding(message.Msg,message.Username)
        console.log(message)
      });
    });
  }
  sendMessageWithLoadding(msg : string,username : string){
    setTimeout(()=>{
      let load = this.elementRef.nativeElement.querySelector('.message.loading');
      load.remove()
      this.Messages.push({
        Username: username,
        TypingState: false,
        Msg: msg,
        Personal: false,
        Avatar : this._avatarService.GenerateAvatar(username[0], "white", "#009578")
      })
      this.updateScrollbar()
    },1000 + (Math.random() * 10) * 100)
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
