import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  path = 'https://hw8-backend-ams35-comp531.herokuapp.com';
  // path: String = 'http://localhost:3000';

  constructor(private httpClient: HttpClient) { }

  getPosts(): Observable<Object> {
    return this.httpClient.get(this.path + "/articles", { withCredentials: true });
  }

  getPostsByUsername(username): Observable<Object> {
    return this.httpClient.get(this.path + "/articles/" + username, { withCredentials: true });
  }

  getHeadlineByUsername(username): Observable<Object> {
    return this.httpClient.get(this.path + "/headline/" + username, { withCredentials: true });
  }

  getProfileData(): Observable<Object> {
    return this.httpClient.get(this.path + "/profile", { withCredentials: true });
  }

  getProfileDataByUsername(username): Observable<Object> {
    return this.httpClient.get(this.path + "/profile/" + username, { withCredentials: true });
  }

  addFollowing(username): Observable<Object> {
    return this.httpClient.put(this.path + "/following/" + username, null, { withCredentials: true });
  }

  removeFollowing(username): Observable<Object> {
    return this.httpClient.delete(this.path + "/following/" + username, { withCredentials: true });
  }

  putHeadline(headline): Observable<Object> {
    return this.httpClient.put(this.path + "/headline", headline, { withCredentials: true });
  }

  getAvatar(username): Observable<Object> {
    return this.httpClient.get(this.path + "/avatar/" + username, { withCredentials: true })
  }

  addPost(post): Observable<Object> {
    return this.httpClient.post(this.path + "/article/", post, { withCredentials: true });
  }

  addComment(commentText, articleId): Observable<Object> {
    return this.httpClient.put(this.path + '/articles/' + articleId, commentText, { withCredentials: true })
  }

  editComment(articleId, comment): Observable<Object> {
    return this.httpClient.put(this.path + '/articles/' + articleId, comment, { withCredentials: true })
  }

  // async getUser(user: Object) {
  //   return await this.httpClient.get(this.path + user, { withCredentials: true }).toPromise();
  // }
}
