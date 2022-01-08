import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import {RouterTestingModule} from "@angular/router/testing";
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        HttpClientModule,
      ],
      declarations: [ ProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch the user\'s profile username', () => {
    expect(component.profileDisplayName).toBeDefined();
    expect(component.profileDisplayName.length).toBeGreaterThan(0);
  })

  it('should update the old profile values with new ones', () => {
    component.updateProfileForm.value.displayName = 'Rice University';
    component.updateProfileForm.value.email = 'comp@rice.edu';
    component.updateProfileForm.value.password = 'Hello World';
    component.updateProfileForm.value.cpassword = 'Hello World';
    component.myUpdate();
    expect(component.profileDisplayName).toBe('Rice University');
    expect(component.profileEmail).toBe('comp@rice.edu');
    expect(component.display_alert_password).toBe(false);
    expect(component.profilePassword).toBe('Hello World');
    expect(component.display_password).not.toBe('Hello World');
  })

});
