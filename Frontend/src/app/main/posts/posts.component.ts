import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {PostsService} from "./posts.service";
@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  @Input() currentUser;
  @Input() comments;
  @Input() postId = 0;
  @Input() username = '';
  @Input() text = '';
  @Input() title = '';
  @Input() image = '';
  @Input() timestamp = new Date();
  header = '';
  data = null;
  timeForPost = '';
  isCommentsSectionOpen = false;
  currentTime: Date = new Date();
  editCommentForm: any;
  isEditArticleOpen = false;
  commentsForThisPost: Array<{ id: number, email: string, comment: string, isEditCommentOpen: boolean }> = new Array<{ id: number, email: string, comment: string, isEditCommentOpen: boolean }>();

  constructor( private fb: FormBuilder, private postsService: PostsService, private router: Router ) {
    let hours = this.currentTime.getHours() - this.timestamp.getHours();
    let minutes = this.currentTime.getMinutes() - this.timestamp.getMinutes();
    this.timeForPost += hours + ' hours ' + minutes + ' minutes ';
  }

  ngOnInit(): void {
    if (this.image == '') {
      this.header = "Text Post";
    } else {
      this.header = "Image Post";
    }
    this.editCommentForm = this.fb.group({
    })
    this.loadCommentsForPost();
  }

  loadCommentsForPost() {
    this.comments.forEach(comment => {
      this.commentsForThisPost.unshift({id: comment.commentId, email: comment.username, comment: comment.comment, isEditCommentOpen: false})
      this.editCommentForm.addControl('comment'+comment.commentId, new FormControl(''))
    });
  }

  addComment(comment) {
    if (comment != null) {
      let commentToAdd = {
        commentId: 0,
        text: comment
      }
      this.postsService.addComment(commentToAdd, this.postId).subscribe((resp: any) => {
        this.commentsForThisPost.unshift({ id: resp.comments.length, email: this.username, comment: comment, isEditCommentOpen: false })
      }, (error) => {
        if(error.status == 401) {
          this.router.navigateByUrl('login');
        }
      })
    }
  }

  commentClick() {
    this.isCommentsSectionOpen = !this.isCommentsSectionOpen;
  }

  editComment(comment) {
    this.commentsForThisPost.forEach(element => {
      if(element === comment) {
        element.isEditCommentOpen = !element.isEditCommentOpen;
      }
    });
  }

  pushEditCommentChange(comment, value) {
    let requestBody = {
      commentId: comment.id,
      text: value.target.value
    }
    this.postsService.editComment(this.postId, requestBody).subscribe((resp: any) => {
      comment.comment = value.target.value;
      comment.isEditCommentOpen = false;
    });
  }

  editArticleOpenClose() {
    this.isEditArticleOpen = !this.isEditArticleOpen;
  }

  pushArticleCommentChange(value) {
    let requestBody = {
      text: value.target.value
    }
    this.postsService.editComment(this.postId, requestBody).subscribe((resp: any) => {
      this.isEditArticleOpen != this.isEditArticleOpen
      this.text = value.target.value;
      this.isEditArticleOpen = !this.isEditArticleOpen;
    });
  }
}
