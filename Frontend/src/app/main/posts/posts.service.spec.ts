import { TestBed } from '@angular/core/testing';

import { PostsService } from './posts.service';
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {HttpClientModule} from "@angular/common/http";
import {of} from "rxjs";

describe('PostsService', () => {
  let service: PostsService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        HttpClientModule,
        ReactiveFormsModule,
      ],});
    service = TestBed.inject(PostsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('get the user by id',
    (done: DoneFn) => {
      service.getUserById(1).subscribe(value => {
        expect(value).toBeDefined();
        done();
      });
    });

  it('get all Existing users(for posts and friends)',
    (done: DoneFn) => {
      service.getUsers().subscribe(value => {
        expect(value).toBeDefined();
        done();
      });
    });

  it('get all comments on a post',
    (done: DoneFn) => {
      service.getComments().subscribe(value => {
        expect(value).toBeDefined();
        done();
      });
    });

  it('get all posts',
    (done: DoneFn) => {
      service.getPosts().subscribe(value => {
        expect(value).toBeDefined();
        done();
      });
    });

  it('get an Existing User using promise',
    (done: DoneFn) => {
      service.getUser(1).then(value => {
        expect(value).toEqual({
          "id": 1,
          "name": "Leanne Graham",
          "username": "Bret",
          "email": "Sincere@april.biz",
          "address": {
            "street": "Kulas Light",
            "suite": "Apt. 556",
            "city": "Gwenborough",
            "zipcode": "92998-3874",
            "geo": {
              "lat": "-37.3159",
              "lng": "81.1496"
            }
          },
          "phone": "1-770-736-8031 x56442",
          "website": "hildegard.org",
          "company": {
            "name": "Romaguera-Crona",
            "catchPhrase": "Multi-layered client-server neural-net",
            "bs": "harness real-time e-markets"
          }
        });
        done();
      });
    });
});

