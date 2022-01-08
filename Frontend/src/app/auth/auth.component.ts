import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../app.service';
import { RegistrationService } from "./registration/registration.service";

const googleLogoURL = "https://raw.githubusercontent.com/fireflysemantics/logo/master/Google.svg";
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  loginForm: any;
  invalidCredentials = false;
  incompleteForm = false;
  constructor( private fb: FormBuilder, private router: Router, private route:ActivatedRoute, private registrationService: RegistrationService, private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer, private appService: AppService ) {
    this.matIconRegistry.addSvgIcon("logo", this.domSanitizer.bypassSecurityTrustResourceUrl(googleLogoURL));
    this.router = router;
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    })
  }
  username: any;
  ngOnInit(): void {
    // this.registrationService.checkUserLoggedIn().subscribe((resp) => {
      // this.router.navigateByUrl('posts');
    // }, (error) => {

    // })
  }

  login() {
    if(this.loginForm.value.password == "" || this.loginForm.value.username =="") {
      this.incompleteForm = true;
      return
    }
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      this.incompleteForm = false;
      this.invalidCredentials = false;

      this.registrationService.login(this.loginForm).subscribe((resp) => {
        this.router.navigateByUrl('/posts');
      }, (error) => {
        if(error.status == 401) {
          this.router.navigateByUrl('login');
        }
        this.invalidCredentials = true;
      });
    }
  }

}
