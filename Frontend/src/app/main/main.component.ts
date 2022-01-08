import { Component, OnInit } from '@angular/core';
import { PostsService } from './posts/posts.service';
import { Router } from "@angular/router";
import { FormBuilder, Validators, ReactiveFormsModule } from "@angular/forms";
import posts from './posts/_files/posts.json';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  addPostForm = this.fb.group({
    title: [''],
    text: ['', Validators.required],
  })
  addFriendForm = this.fb.group({
    username: ['', Validators.required]
  })
  updateStatusForm = this.fb.group({
    headline: ['', Validators.required],
  })
  searchForm = this.fb.group({
    searchText: ['', Validators.required],
  })
  data: any;
  addNewPost = new FormData();
  selectedFiles: any;
  username: any;
  displayName: any;
  userId: any;
  id: any;
  addFriendExists: boolean = true;
  timeStamp: Date = new Date();
  catchPhrase: string = 'ABCD';
  user: any;
  postsUsername = '';
  postsName = '';
  friends: Array<{ username: string, image: string }> = new Array<{ username: string, image: string }>();
  friendsArray: Array<string> = new Array<string>();
  posts: Array<{id: number, title: string, text: string, image: string, username: string, timestamp: Date, comments}>
    = new Array<{id: number, title: string, text: string; image: string, username: string, timestamp: Date, comments}>();

  filteredPosts: Array<{id: number, title: string, text: string, image: string, username: string, timestamp: Date, comments}>
    = new Array<{id: number, title: string, text: string; image: string, username: string, timestamp: Date, comments}>();

  profileImage = "";

  allUsers: Array<{ userId: number, username: string }> = new Array<{ userId: number, username: string }>();

  images = ["https://picsum.photos/id/237/200/300",
    "https://picsum.photos/seed/picsum/200/300",
    "https://picsum.photos/200/300?grayscale",
    "https://picsum.photos/200/300/?blur",
    "https://picsum.photos/id/870/200/300?grayscale&blur=2",
    "https://source.unsplash.com/user/c_v_r/1600x900",
    "https://images.pexels.com/photos/858115/pexels-photo-858115.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "https://i.ytimg.com/vi/PuJgZUDPX-U/maxresdefault.jpg",
    "https://img.i-scmp.com/cdn-cgi/image/fit=contain,width=1098,format=auto/sites/default/files/styles/1200x800/public/d8/images/methode/2020/06/24/cf9d675c-b1fe-11ea-953d-a7ecc5cbd229_image_hires_144326.jpg?itok=iQiYpV_1&v=1592981014",
    "https://thumbor.forbes.com/thumbor/fit-in/416x416/filters%3Aformat%28jpg%29/https%3A%2F%2Fspecials-images.forbesimg.com%2Fimageserve%2F5ec595d45f39760007b05c07%2F0x0.jpg%3Fbackground%3D000000%26cropX1%3D989%26cropX2%3D2480%26cropY1%3D74%26cropY2%3D1564"
  ];

  friend_images = ["https://cdn.vox-cdn.com/thumbor/beBJA7JX9NCA3K2OOll0VAvqys4=/0x60:1920x1020/fit-in/1200x600/cdn.vox-cdn.com/uploads/chorus_asset/file/22730081/Fortnite_Ferrari_In_Game_Screenshot_1920x1080.jpg",
    "https://img.jamesedition.com/listing_images/2021/08/23/14/49/33/4e4b3664-c568-42a5-a181-00f2e77f3714/je/600x354xc.jpg",
    "https://www.redbullstudios.com/RBMH_Icon.png"]

  constructor(private fb: FormBuilder, private postsService: PostsService, private router:Router) {
  }

  ngOnInit(): void {
    // this.postsService.checkUserLoggedIn().subscribe((resp) => {
      this.checkLoggedInAndLoadData();
    // }, (error) => {
    //   console.log(error)
    //   this.router.navigateByUrl('login');
    // })
  }

  checkLoggedInAndLoadData() {
    let j = 0;
    this.getProfileData();
    this.postsService.getProfileData().subscribe((response: any) => {
      this.catchPhrase = response.profile.headline;
      this.username = response.profile.username;
      this.displayName = response.profile.displayName;
      this.profileImage = response.profile.avatar;
      response.profile.following.forEach(element => {
        this.friendsArray.push(element);
        this.postsService.getAvatar(element).subscribe((resp: any) => {
          this.friends.push({ username: resp.username, image: resp.avatar })
        }, (error) => {
          if(error.status == 401) {
            this.router.navigateByUrl('login');
          }
        })
      });
      this.postsService.getPosts().subscribe(resp => {
        this.data = resp['articles'];
        for (let post of this.data) {
          var today = new Date();
          this.posts.unshift({id: post.postId, title:post.title, text:post.body, image: post.image, username: post.username, timestamp: today, comments: post.comments});
          this.filteredPosts.unshift({id: post.postId, title:post.title, text:post.body, image: post.image, username: post.username, timestamp: today, comments: post.comments});
        }
      }, (error) => {
        if(error.status == 401) {
          this.router.navigateByUrl('login');
        }
      })
    }, (error) => {
      if(error.status == 401) {
        this.router.navigateByUrl('login');
      }
    });
  }

  getProfileData() {
    this.postsService.getProfileData().subscribe((response: any) => {
      this.catchPhrase = response.profile.headline;
      this.username = response.profile.username;
    }, (error) => {
      if(error.status == 401) {
        this.router.navigateByUrl('login');
      }
    });
  }

  updateStatus() {
    this.updateStatusForm.markAllAsTouched();
    if (this.updateStatusForm.value.headline != null && this.updateStatusForm.value.headline != '') {
      this.postsService.putHeadline(this.updateStatusForm.value).subscribe(resp =>
        {
          this.catchPhrase = this.updateStatusForm.value.headline;
        }, (error) => {
          if(error.status == 401) {
            this.router.navigateByUrl('login');
          }
        });
    }
    return this.catchPhrase;
  }

  addFriend() {
    this.addFriendExists = true;
    this.addFriendForm.markAllAsTouched();
    if (this.addFriendForm.value.username != null && this.addFriendForm.value.username != "") {
      this.postsService.addFollowing(this.addFriendForm.value.username).subscribe((resp) => {
        this.addFriendExists = true;
        if (!this.friendsArray.some((item) => item == this.addFriendForm.value.username)) {
          this.friendsArray.push(this.addFriendForm.value.username);
          this.postsService.getProfileDataByUsername(this.addFriendForm.value.username).subscribe((resp: any) => {
            if(resp.avatar != '') {
              this.friends.push({username: this.addFriendForm.value.username, image: resp.avatar})
            } else {
              this.friends.push({username: this.addFriendForm.value.username, image: ''})
            }
          })
          this.postsService.getPostsByUsername(this.addFriendForm.value.username).subscribe(resp => {
            this.data = resp['articles'];
            for (let post of this.data) {
              var today = new Date();
              this.posts.unshift({id: post.postId, title:post.title, text:post.body, image: post.image, username: post.username, timestamp: today, comments: post.comments});
              this.filteredPosts.unshift({id: post.postId, title:post.title, text:post.body, image: post.image, username: post.username, timestamp: today, comments: post.comments});
            }
          }, (error) => {
            if(error.status == 401) {
              this.router.navigateByUrl('login');
            }
          })
        }
      }, (error) => {
        if(error.status == 401) {
          this.router.navigateByUrl('login');
        }
        this.addFriendExists = false;
      })
    }
  }

  addPost() {
    this.addPostForm.markAllAsTouched();
    this.addNewPost.append('title', this.addPostForm.value.title);
    this.addNewPost.append('text', this.addPostForm.value.text);
    this.postsService.addPost(this.addNewPost).subscribe(resp => {
      this.addNewPost = new FormData();
      this.posts.unshift({id: resp['articles'][0]['postId'], title: resp['articles'][0]['title'], text: this.addPostForm.value.text, image: resp['articles'][0]['image'], username: this.username, timestamp: new Date(), comments: resp['articles'][0]['comments']});
      this.filteredPosts.unshift({id: resp['articles'][0]['postId'], title: resp['articles'][0]['title'], text: this.addPostForm.value.text, image: resp['articles'][0]['image'], username: this.username, timestamp: new Date(), comments: resp['articles'][0]['comments']});
    }, (error) => {
      if(error.status == 401) {
        this.router.navigateByUrl('login');
      }
      this.addNewPost = new FormData();
    })

    this.addPostForm.value.title = '';
    this.addPostForm.value.body = '';
  }

  removeFollowing(friend: { username: string, image: string }) {
    this.postsService.removeFollowing(friend.username).subscribe(res => {
      this.friendsArray.forEach((element,index)=>{
        if (element == friend.username) {
          this.friendsArray.splice(index,1);
        }
      });
      this.friends.forEach((element,index)=>{
        if (element == friend) {
          this.friends.splice(index,1);
        }
      });
      this.posts.forEach((element,index)=>{
        if (element.username == friend.username) {
          this.posts.splice(index,1);
        }
      });
      this.filteredPosts.forEach((element,index)=>{
        if (element.username == friend.username) {
          this.filteredPosts.splice(index,1);
        }
      });
    }, (error) => {
      if(error.status == 401) {
        this.router.navigateByUrl('login');
      }
    });
  }

  searchPosts() {
    this.filteredPosts = [];

    for (let post of this.posts) {
      if (post.text.toLowerCase().search(this.searchForm.value.searchText.toLowerCase()) != -1 ||
        post.title.toLowerCase().search(this.searchForm.value.searchText.toLowerCase()) != -1 ||
        post.username.toLowerCase().search(this.searchForm.value.searchText.toLowerCase()) != -1) {
        this.filteredPosts.unshift(post);
      }
    }
  }

  selectFile(event) {
    this.addNewPost.append('image', event.target.files[0]);
  }
}
