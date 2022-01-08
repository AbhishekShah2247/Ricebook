import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import { PostsComponent } from './posts.component';
import {RouterTestingModule} from "@angular/router/testing";
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { of } from "rxjs";
import {PostsService} from "./posts.service";

describe('PostsComponent', () => {
  let component: PostsComponent;
  let userService: PostsService;
  let fixture: ComponentFixture<PostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        HttpClientModule,
      ],
      declarations: [ PostsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostsComponent);
    userService = TestBed.inject(PostsService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add comment', () => {
    component.addComment('Hello World');
    expect(component.commentsForThisPost[0].comment).toEqual('Hello World');
    expect(component.commentsForThisPost[0].email).toEqual('You');
  })

  it('check opening and closing of comment section', () => {
    let initialStateOfButton = component.isCommentsSectionOpen;
    component.commentClick();
    let finalStateOfButton = component.isCommentsSectionOpen;
    expect(initialStateOfButton).toEqual(!finalStateOfButton);
  })

  it("should call getUsers and return list of users", waitForAsync(() => {
    let response = [];
    component.userId = 1;
    spyOn(userService, 'getComments').and.returnValue(of(response));
    component.loadCommentsForPost();
    fixture.detectChanges();
    expect(component.commentsForThisPost).toEqual(response);
  }));

});
