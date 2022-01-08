import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  path: String = 'https://hw8-backend-ams35-comp531.herokuapp.com';
  // path: String = 'http://localhost:3000';

  constructor(private httpClient: HttpClient) { }

  logout() {
    return this.httpClient.put(this.path + "/logout", { withCredentials: true });
  }
}
