import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRequired } from './_helpers/index';
import { HomeComponent } from './home/index';
import { SignUpComponent, SignInComponent, SignOutComponent } from './users/index'; import { CreateTopicComponent } from './topics/index';
import { TopicComponent } from './topics/index';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'users/signup', component: SignUpComponent },
  { path: 'users/signin', component: SignInComponent },
  { path: 'users/signout', component: SignOutComponent },
  { path: 'topics/create', component: CreateTopicComponent, canActivate: [UserRequired] },
  { path: 'topics/:id', component: TopicComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: []
})
export class AppRoutingModule { }