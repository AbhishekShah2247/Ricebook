import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthComponent } from './auth/auth.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistrationComponent } from './auth/registration/registration.component';
import { MainComponent } from './main/main.component';
import { PostsComponent } from './main/posts/posts.component';
import { ProfileComponent } from './profile/profile.component';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RegistrationService } from "./auth/registration/registration.service";
import { PostsService } from "./main/posts/posts.service";
import { AppService } from './app.service';
import { GoogleRedirectComponent } from './auth/google-redirect/google-redirect.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    RegistrationComponent,
    MainComponent,
    PostsComponent,
    ProfileComponent,
    GoogleRedirectComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
  ],
  providers: [
    RegistrationService,
    PostsService,
    AppService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
