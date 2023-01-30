import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { AlertService ,AccountService} from '@app/_services';

import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form = new FormGroup({
    'username': new FormControl(),
    'password': new FormControl(),
    'checkbox': new FormControl()
  })
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private router: Router,
    private alertService: AlertService,
    private accountService: AccountService,
    private route: ActivatedRoute,

    ){


    }


//  JoinChat(){
//    let username : string = this.form.value.username
//    this.router.navigate(['/chat',username]);
//  }

  get f() { return this.form.controls; }

  onSubmit() {
      this.submitted = true;

      // reset alerts on submit
      this.alertService.clear();

      // stop here if form is invalid
      if (this.form.invalid) {
          return;
      }

      this.loading = true;
      this.accountService.login(this.f.username.value, this.f.password.value)
          .pipe(first())
          .subscribe({
              next: () => {
                  // get return url from query parameters or default to Chat page
                  const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                  this.router.navigateByUrl(returnUrl);
              },
              error: error => {
                  this.alertService.error(error);
                  this.loading = false;
              }
          });
  }

}
