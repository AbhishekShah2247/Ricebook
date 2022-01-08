import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { FormGroup } from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  path: String = 'https://hw8-backend-ams35-comp531.herokuapp.com';
  // path: String = 'http://localhost:3000';

  constructor(private httpClient: HttpClient) { }

  setProfilePassword(password): Observable<Object> {
    return this.httpClient.put(this.path + "/password", { password: password }, { withCredentials: true });
  }

  setEmail(email) {
    return this.httpClient.put(this.path + "/email", {email: email}, { withCredentials: true });
  }

  setZipcode(zipcode) {
    return this.httpClient.put(this.path + "/zipcode", { zipcode: zipcode }, { withCredentials: true });
  }

  setPhoneNumber(phoneNumber) {
    return this.httpClient.put(this.path + "/phoneNumber", { phoneNumber: phoneNumber }, { withCredentials: true });
  }

  setDisplayName(displayName) {
    return this.httpClient.put(this.path + "/displayName", { displayName: displayName }, { withCredentials: true });
  }

  setAvatar(fd) {
    return this.httpClient.put(this.path + "/avatar", fd, { withCredentials: true });
  }
}
