import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistrationService } from '../registration/registration.service';

@Component({
  selector: 'app-google-redirect',
  templateUrl: './google-redirect.component.html',
  styleUrls: ['./google-redirect.component.css']
})
export class GoogleRedirectComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private registrationService: RegistrationService) { }

  username;
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.username = params['id'];
      if(this.username != '' && this.username != null) {
        this.registrationService.loginWithGoogle(this.username).subscribe((resp : any) => {
          this.router.navigateByUrl('posts');
        })
      }
    });
  }

}
