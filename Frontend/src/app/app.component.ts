import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AppService } from "./app.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend';
  username: any = '';
  constructor( private router: Router, private cdr:ChangeDetectorRef, private appService: AppService ) {
  }

  ngOnInit() {
  }

  switchToHome() {
    this.router.navigateByUrl('posts');
  }

  switchToProfile() {
    this.router.navigateByUrl('profile');
  }

  logout() {
    this.appService.logout().subscribe((resp) => {
      this.router.navigateByUrl('/login')
    }, (error) => {
      this.router.navigateByUrl('/login')
    });
  }
}
