import { Role } from "./role";

export class User {
  userID?: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  token?: string;
  constructor(username:string){
    this.username = username
  }
}
