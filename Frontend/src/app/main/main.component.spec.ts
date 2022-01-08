import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import { MainComponent } from './main.component';
import {RouterTestingModule} from "@angular/router/testing";
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {PostsService} from "./posts/posts.service";

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let userService: PostsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        HttpClientModule,
      ],
      declarations: [ MainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    userService = TestBed.inject(PostsService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have all the posts loaded', () => {
    component.checkLoggedInAndLoadData();
    expect(component.filteredPosts.length).toBeGreaterThan(0);
  })

  it(' should check if all users are loaded ', () => {
    component.checkLoggedInAndLoadData();
    component.getAllUsers();
    expect(component.filteredPosts).toBeDefined();
  })

  it('should add posts when user adds post', () => {
    component.addPostForm.value.title = "Post Title";
    component.addPostForm.value.body = "Post Body";
    component.addPost();
    expect(component.posts[0].title).toBe('Post Title');
    expect(component.posts[0].text).toBe('Post Body');
  })

  it(' should filter displayed articles by the search keyword', () => {
    component.checkLoggedInAndLoadData();
    component.searchForm.value.searchText = 'est ';
    component.searchPosts();
    expect(component.filteredPosts.length).toBeLessThan(40);
    expect(component.filteredPosts.length).toBeGreaterThan(0);
  })

  it('should add articles when adding a follower', () => {
    component.checkLoggedInAndLoadData();
    const initialLength = component.posts.length;
    component.addFriendForm.value.username = 'Bret';
    component.addFriend();
    const finalLength = component.posts.length;
    expect(component.filteredPosts.length).toBeGreaterThan(40);
  })

  it('should test update status', () => {
    component.checkLoggedInAndLoadData();
    component.updateStatusForm.value.status = "Updated Status";
    component.updateStatus();
    expect(component.catchPhrase).toBe("Updated Status");
    expect(component.catchPhrase).not.toBe("Update Status");
  })

  it('should remove articles when unfollowing a follower', () => {
    component.checkAndSetFriends();
    component.checkLoggedInAndLoadData();
    const initialLength = component.filteredPosts.length;
    component.removeFollowing({ name: "Leanne Graham", username: "Bret", image: '', status: '' });
    const finalLength = component.filteredPosts.length;
    expect(finalLength).toBeGreaterThan(0);
    expect(initialLength - finalLength).toBeLessThan(40);
  })

  it('should remove user and posts when unfriend is called', () => {
    component.checkAndSetFriends();
    component.checkLoggedInAndLoadData();
    const initialLength = component.filteredPosts.length;
    component.unfriend({ name: "Leanne Graham", username: "Bret", image: '', status: '' });
    const finalLength = component.filteredPosts.length;
    expect(finalLength).toBeGreaterThan(0);
    expect(component.friends.length).toBeLessThan(3)
    expect(initialLength - finalLength).toBeLessThan(40);
  })
});
