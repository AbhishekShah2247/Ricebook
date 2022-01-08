import { Injectable } from '@angular/core';
import { ActivatedRoute, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppGuard implements CanActivate {

  constructor(private router: Router) { }
  canActivate(){
    var dc = document.cookie;
    // var prefix = "sid=";
    // var begin = dc.indexOf("; " + prefix);
    // if(begin == -1) {
    //   return false;
    // } else {
    //   return true;
    // }
    // if(dc != '') {
      return true;
    // } else {
    //   this.router.navigateByUrl('login');
    //   return false;
    // }
  }
}
