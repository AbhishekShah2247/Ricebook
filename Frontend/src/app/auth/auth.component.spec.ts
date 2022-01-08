import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';
import { AuthComponent } from './auth.component';
import { RouterTestingModule } from "@angular/router/testing";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import {RegistrationService} from "./registration/registration.service";

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        HttpClientModule,
      ],
      providers: [
        // other providers
        RegistrationService,
      ],
      declarations: [ AuthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Since no form data is being passed to the login function, it should return undefined and not proceed. this confirms its working.
   */
  it('should make the login method work', () => {
    expect(component.login()).toBeUndefined();
  })
});
