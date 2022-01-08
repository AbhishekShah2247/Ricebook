import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { FormGroup } from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  userId: number = -1;
  username: String = '';
  password: String = '';
  path: String = 'https://hw8-backend-ams35-comp531.herokuapp.com';
  // path: String = 'http://localhost:3000';
  constructor(private httpClient: HttpClient) {
  }

  getExistingUsers(): Observable<Object> {
    return this.httpClient.get("https://jsonplaceholder.typicode.com/users");
  }

  register(registrationForm: FormGroup) {
    return this.httpClient.post(this.path + "/register", registrationForm.value, { withCredentials: true });
  }

  login(loginForm: FormGroup) {
    return this.httpClient.post(this.path + "/login", loginForm.value, { withCredentials: true });
  }

  loginWithGoogle(id) {
    return this.httpClient.post(this.path + "/auth/google/login", {id: id}, { withCredentials: true });
  }
}
