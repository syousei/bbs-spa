import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { NavbarComponent } from './_directives/index';
import { AlertComponent } from './_directives/index';
import { UserRequired } from './_helpers/index';
import { AlertService, AuthenticationService, UserService, TopicService, CommentService } from './_services/index';
import { HomeComponent } from './home/index';
import { SignUpComponent, SignInComponent, SignOutComponent } from './users/index';
import { CreateTopicComponent } from './topics/index';
import { TopicComponent } from './topics/index';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    AlertComponent,
    HomeComponent,
    SignUpComponent,
    SignInComponent,
    SignOutComponent,
    CreateTopicComponent,
    TopicComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
  ],
  providers: [
    UserRequired,
    AlertService,
    AuthenticationService,
    UserService,
    TopicService,
    CommentService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
