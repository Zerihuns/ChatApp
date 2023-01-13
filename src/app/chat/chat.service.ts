import { Message } from './model/Message';
import { EventEmitter,Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr"
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})



export class ChatService {

  public data?: string;
  private hubConnection: signalR.HubConnection
  messageReceived = new EventEmitter<Message>();
  connectionEstablished = new EventEmitter<Boolean>();
  private connectionIsEstablished = false;
  username = "not login"

  constructor(

  ){
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(environment.ServerURL+'/ChatHub')
    .build();
    this.registerOnServerEvents();
  }

  sendMessage(message : string) {
    this.hubConnection.invoke('SendMessage', this.username ,message);
  }
  sendJoinMessage(username : string) {
  this.hubConnection.invoke("Register",username)
  }
  public StartConnection(username : string ) {
    this.hubConnection
    .start()
    .then(() => {
      this.connectionIsEstablished = true;
      console.log('Hub connection started')
      this.connectionEstablished.emit(true)
      this.username = username
      this.sendJoinMessage(username)
    })
    .catch(err => {
      console.log('Error while establishing connection, retrying...');
      setTimeout(()=>{
         this.StartConnection(username)
        }, 5000);
    });

  }

    public registerOnServerEvents = () => {
      this.hubConnection.on('ReceiveMessage', (username,message) => {
        if(username != this.username){
          this.messageReceived.emit({Username:username,Message:message});
          console.log(username +" : " + message );
        }
      });
    }
}

