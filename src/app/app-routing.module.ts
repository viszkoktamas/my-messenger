import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { UserListComponent } from './users/user-list/user-list.component';
import { ConversationListComponent } from './conversations/conversation-list/conversation-list.component';
import { ConversationComponent } from './conversations/conversation/conversation.component';

const routes: Routes = [
  { path: '', component: ConversationListComponent, canActivate: [AuthGuard] },
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule' },
  { path: 'find-friends', component: UserListComponent, canActivate: [AuthGuard] },
  { path: 'conversations', component: ConversationListComponent, canActivate: [AuthGuard] },
  {
    path: 'conversation/:conversationId',
    component: ConversationComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', component: ConversationListComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
