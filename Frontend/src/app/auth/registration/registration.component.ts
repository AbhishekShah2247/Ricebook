import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {Md5} from 'ts-md5/dist/md5';
import { RegistrationService } from './registration.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  registrationForm = this.fb.group({
    displayName: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
    zipcode: ['', Validators.pattern("[0-9]{5}")],
    email: ['', [Validators.required, Validators.email]],
    dateOfBirth: [''],
    phoneNumber: ['', Validators.pattern("((\([0-9]{3}\)|[0-9]{3}-)[0-9]{3}-[0-9]{4})|[0-9]{10}")]
  })
  isFormInvalid = false;
  isUsernameAbsent = false;
  isDisplayNameAbsent = false;
  isPasswordAbsent = false;
  isConfirmPasswordAbsent = false;
  invalidEmail = false;
  invalidMobile = false;
  invalidZipCode = false;
  passwordConfirmIncorrect = false;
  userAlreadyexists = false;
  constructor(private fb: FormBuilder, private router: Router, private route:ActivatedRoute, private registrationService: RegistrationService ) {
    this.router = router;
  }
  isLogin = true;

  ngOnInit(): void {
  }

  register() {
    this.isFormInvalid = false;
    this.isDisplayNameAbsent = false;
    this.isPasswordAbsent = false;
    this.isConfirmPasswordAbsent = false;
    this.invalidEmail = false;
    this.invalidMobile = false;
    this.invalidZipCode = false;
    this.passwordConfirmIncorrect = false;
    if (!this.registrationForm.valid) {
      if (this.registrationForm.value.displayName == "") {
        this.isDisplayNameAbsent = true;
      }
      if (this.registrationForm.value.password == "") {
        this.isPasswordAbsent = true;
      }
      if (this.registrationForm.value.password != "" && this.registrationForm.value.confirmPassword =="") {
        this.isConfirmPasswordAbsent = true;
      }
      if (this.registrationForm.controls.email.status == "INVALID") {
        this.invalidEmail = true;
      }
      if (this.registrationForm.controls.phoneNumber.status == "INVALID") {
        this.invalidMobile = true;
      }
      if (this.registrationForm.controls.zipcode.status == "INVALID") {
        this.invalidZipCode = true;
      }
      return false;
    }
    if(this.registrationForm.value.password != this.registrationForm.value.confirmPassword) {
      this.passwordConfirmIncorrect = true;
      return false;
    }
    this.registrationForm.markAllAsTouched();
    this.registrationService.register(this.registrationForm).subscribe((resp: any) => {
      this.router.navigateByUrl('/posts');
    }, (error) => {
      if(error.status == 409) {
        this.userAlreadyexists = true;
        this.registrationForm.value.email = '';
      }
      if(error.status == 401) {
        this.router.navigateByUrl('login');
      }
    });
    return true;
  }
}
