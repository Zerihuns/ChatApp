import { ChatService } from './chat.service';
import {
  AfterViewInit, Component,
  ElementRef,
  NgZone,
  OnDestroy, OnInit,  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';
import { Message } from './model/Message';



@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']

})
export class ChatComponent  implements OnInit,AfterViewInit, OnDestroy{

  public scrollbarOptions: any = { axis: 'y', theme: 'my-theme'}
  username = ''
  inputMessage = ''
  userAvater = ''

  constructor(
    private mScrollbarService: MalihuScrollbarService,
    private elementRef:ElementRef,
    private _chatService : ChatService,
    private _ngZone: NgZone,
    private router: Router,
    private param : ActivatedRoute
    ) {
      this.mScrollbarService.update('#scrollContainer')
      this.subscribeToEvents()
}

  ngOnDestroy(): void {}
  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    this.param.paramMap.subscribe(params =>{
      let username = params.get('username')
      if(username){
        this.username = username
        this.userAvater = generateAvatar(username[0], "white", "#009578")
        this._chatService.StartConnection(username);
      }else{
        console.log("Username unknown")
        this.router.navigate(['/home'])

      }

    })
  }

  insertMessage(message:string){
    let elemnt = this.elementRef.nativeElement.querySelector('.mCSB_container');
    this.updateScrollbar()

    elemnt.insertAdjacentHTML('beforeend', SendMessageView(message))

    this._chatService.sendMessage(message);
    this.updateScrollbar()
    this.inputMessage = ''
  }

  updateScrollbar() {
    this.mScrollbarService.scrollTo('#scrollContainer', 'bottom', {
      scrollInertia: 10,
      timeout: 0
    })
  }

  private subscribeToEvents(): void {
    this._chatService.messageReceived.subscribe((message: Message) => {
      this._ngZone.run(() => {
        let elemnt = this.elementRef.nativeElement.querySelector('.mCSB_container');
        elemnt.insertAdjacentHTML('beforeend', SendLoad(message.Username[0]))
        this.updateScrollbar()
        this.sendMessageWithLoadding(message.Message,message.Username)
        console.log(message)
      });
    });
  }
  sendMessageWithLoadding(msg : string,username : string){
    setTimeout(()=>{
      let load = this.elementRef.nativeElement.querySelector('.message.loading');
      load.remove()
      let d1 = this.elementRef.nativeElement.querySelector('.mCSB_container');
      d1.insertAdjacentHTML('beforeend', MessageReceived(msg,username[0]))
      this.updateScrollbar()
    },1000 + (Math.random() * 10) * 100)
  }
}



function MessageReceived(msg:String,ava :string):String{
  return `
  <div class="message new">
  <figure class="avatar">
    <img src=${generateAvatar(ava, "white", "#009578")}>
  </figure>${msg}</div>
  `
}

function SendMessageView(msg:string):string{
  return `<div class="message new message-personal">${msg}</div>`
}

function generateAvatar(text:string, foregroundColor:string, backgroundColor:string) {
  let canvas = document.createElement("canvas");
  let context = canvas.getContext("2d");

  canvas.width = 250;
  canvas.height = 250;

  // Draw background
  if(context){
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

     // Draw text
    context.font = "bold 100px Comic Sans MS";
    context.fillStyle = foregroundColor;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text.toUpperCase(), canvas.width / 2, canvas.height / 2);
  }




  return canvas.toDataURL("image/png");
}

function SendLoad(ava:string):string{
  return`
  <div class="message loading new">
    <figure class="avatar">
      <img src=${generateAvatar(ava, "white", "#009578")} />
    </figure>
    <span></span>
  </div>
  `
}
