import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { PostsService } from '../main/posts/posts.service';
import { ProfileService } from './profile.service';

const googleLogoURL = "https://raw.githubusercontent.com/fireflysemantics/logo/master/Google.svg";
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {


  updateProfileForm = this.fb.group({
    displayName: [''],
    email: ['', Validators.email],
    mobile: ['', Validators.pattern("((\([0-9]{3}\)|[0-9]{3}-)[0-9]{3}-[0-9]{4})|[0-9]{10}")],
    zipcode: ['', Validators.pattern("[0-9]{5}")],
    password: [''],
    cpassword: [''],
  })
  profileEmail;
  profileMobile;
  profileZipcode;
  profileImage;
  profileDisplayName;
  display_password;


  str_update = '';
  display_update = false;
  display_cpassword = false;
  display_alert_password = false;
  displayErrorString = 'Error! ';
  errorUpdate = false;
  username;
  displayName;
  gid = '';
  constructor(private fb: FormBuilder,  private postsService: PostsService, private router: Router, private profileService: ProfileService, private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer ) {
    this.matIconRegistry.addSvgIcon("logo", this.domSanitizer.bypassSecurityTrustResourceUrl(googleLogoURL));
      this.postsService.getProfileData().subscribe((resp: any) => {
        this.username = resp.profile.username;
        this.displayName = resp.profile.displayName;
        this.profileDisplayName = resp.profile.displayName;
        this.profileEmail = resp.profile.email;
        this.gid = resp.profile.gid;
        this.profileMobile = resp.profile.phoneNumber;
        this.profileZipcode = resp.profile.zipcode;
        this.profileImage = resp.profile.avatar;
        this.hiddenPassword();
      }, (error) => {
        if(error.status == 401) {
          this.router.navigateByUrl('login')
        }
      });
  }

  ngOnInit(): void {
  }

  myUpdate() {
    this.updateProfileForm.markAllAsTouched();
    this.str_update = '';
    this.display_update = false;

    if (this.updateProfileForm.value.password != null && this.updateProfileForm.value.password.length != 0) {
      if (this.updateProfileForm.value.password === this.updateProfileForm.value.cpassword) {
        this.profileService.setProfilePassword(this.updateProfileForm.value.password).subscribe((resp) => {
          this.display_alert_password = false;
          this.updateProfileForm.value.password = '';
          this.updateProfileForm.value.cpassword = '';
          this.updateCPassword();
          this.str_update += "Password: " + "updated <br/>";
          this.display_update = true;
        }, (error) => {
          if(error.status == 401) {
            this.router.navigateByUrl('login');
          }
        })
      } else {
        this.display_alert_password = true;
      }
    }

    if (!this.display_alert_password) {
      if (this.updateProfileForm.value.email != null && this.updateProfileForm.value.email.length != 0) {
        if(this.profileEmail != this.updateProfileForm.value.email) {
          this.profileService.setEmail(this.updateProfileForm.value.email).subscribe((resp: any) => {
            this.str_update += "Email: " + this.profileEmail + " updated to " + resp.email + "<br/>";
            this.profileEmail = resp.email;
          }, (error) => {
            if(error.status == 401) {
              this.router.navigateByUrl('login')
            }
          })
        } else {
          this.str_update += "Email: unchanged <br/>";
        }
        this.updateProfileForm.value.email = '';
        this.display_update = true;
      }
      if (this.updateProfileForm.value.mobile != null && this.updateProfileForm.value.mobile.length != 0) {
        if(this.profileMobile != this.updateProfileForm.value.mobile) {
          this.profileService.setPhoneNumber(this.updateProfileForm.value.mobile).subscribe((resp: any) => {
            this.str_update += "Phone Number: " + this.profileMobile + " updated to " + resp.phoneNumber + "<br/>";
            this.profileMobile = resp.phoneNumber;
          }, (error) => {
            if(error.status == 401) {
              this.router.navigateByUrl('login')
            }
          })
        } else {
          this.str_update += "Phone Number: unchanged <br/>";
        }
        this.updateProfileForm.value.mobile = '';
        this.display_update = true;
      }
      if (this.updateProfileForm.value.displayName != null && this.updateProfileForm.value.displayName.length != 0) {
        if(this.profileDisplayName != this.updateProfileForm.value.displayName) {
          this.profileService.setDisplayName(this.updateProfileForm.value.displayName).subscribe((resp: any) => {
            this.str_update += "Phone Number: " + this.profileDisplayName + " updated to " + resp.displayName + "<br/>";
            this.profileDisplayName = resp.displayName;
            this.displayName = resp.displayName;
          }, (error) => {
            if(error.status == 401) {
              this.router.navigateByUrl('login')
            }
          })
        } else {
          this.str_update += "Phone Number: unchanged <br/>";
        }
        this.updateProfileForm.value.mobile = '';
        this.display_update = true;
      }
      if (this.updateProfileForm.value.zipcode != null && this.updateProfileForm.value.zipcode != 0) {
        if(this.profileZipcode != this.updateProfileForm.value.zipcode) {
          this.profileService.setZipcode(this.updateProfileForm.value.zipcode).subscribe((resp: any) => {
            this.str_update += "Zip Code: " + this.profileZipcode + " updated to " + resp.zipcode + "<br/>";
            this.profileZipcode = resp.zipcode;
          }, (error) => {
            if(error.status == 401) {
              this.router.navigateByUrl('login')
            }
          })
        } else {
          this.str_update += "Zip Code: unchanged <br/>";
        }
        this.updateProfileForm.value.zipcode = '';
        this.display_update = true;
      }
      this.updateProfileForm.reset();
    }
    else if (!this.updateProfileForm.valid) {
      this.errorUpdate = true;
      if (this.updateProfileForm.controls.mobile.status =="INVALID" && this.updateProfileForm.value.mobile !== '') {
        this.displayErrorString += "Invalid Mobile Number <br>";
      }
      if (this.updateProfileForm.controls.email.status =="INVALID" && this.updateProfileForm.value.email !== '') {
        this.displayErrorString += "Invalid Email <br>";
      }
      if (this.updateProfileForm.controls.zipcode.status =="INVALID" && this.updateProfileForm.value.zipcode !== '') {
        this.displayErrorString += "Invalid Zip Code <br>";
      }
    }
  }

  updateCPassword() {
    this.display_cpassword = this.updateProfileForm.value.password.length != 0;
  }

  // Change password letters to *
  hiddenPassword() {
    this.display_password = '**********';
  }

  fd = new FormData();

  selectFile(event) {
    this.fd.append('image', event.target.files[0]);
  }

  changeAvatar() {
    if(this.fd.get('image')) {
      this.profileService.setAvatar(this.fd).subscribe((res: any) => {
        this.profileImage = res.avatar;
      }, (error) => {
        if(error.status == 401) {
          this.router.navigateByUrl('login');
        }
      });
    }
  }

}
