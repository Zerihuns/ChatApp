import { Injectable } from '@angular/core';
import { User } from '@app/_models';
import { ColorService } from './color.service';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {

  constructor(
    private _colorService : ColorService
    ) {}
  //Generatr Avatar
 public GenerateAvatar(text:string, foregroundColor:string, backgroundColor:string):string {
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
  BuildAvatar(users:User[]){
        users.forEach(user => user.Avater = this.GenerateAvatar(user.username[0],"white",this._colorService.GetRandomColor()))
        return users
  }

  BuildWithUsername(username:string):void{

  }
}
