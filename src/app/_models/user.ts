
export class User {
  userID: number;
  firstName?: string;
  lastName?: string;
  username: string;
  Avater? : string;
  token?: string;
  constructor(username:string,id :number){
    this.username = username
    this.userID = id
  }
}
