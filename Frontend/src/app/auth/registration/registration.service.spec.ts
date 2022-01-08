import { inject, TestBed } from '@angular/core/testing';

import { RegistrationService } from './registration.service';
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

describe('RegistrationService', () => {
  let service: RegistrationService;
  let loginForm: FormGroup;
  let fb: FormBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        HttpClientModule,
        ReactiveFormsModule,
      ],});
    fb = new FormBuilder();
    service = TestBed.inject(RegistrationService);
    loginForm = fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    })
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('should log in a user (login state should be set)',
  //   (done: DoneFn) => {
  //     loginForm.value.username = 'Bret';
  //     loginForm.value.password = 'Kulas Light';
  //     service.login(loginForm).then(value => {
  //       expect(value).toBe(true);
  //       done();
  //     });
  //   });

  // it('should not log in an invalid user (error state should be set)',
  //   (done: DoneFn) => {
  //     loginForm.value.username = 'Bret';
  //     loginForm.value.password = 'Hello World';
  //     service.login(loginForm).then(value => {
  //       expect(value).toBe(false);
  //       done();
  //     });
  //   });

  it('get all Existing users',
    (done: DoneFn) => {
      service.getExistingUsers().subscribe(value => {
        expect(value).toBeDefined();
        done();
      });
    });

});
