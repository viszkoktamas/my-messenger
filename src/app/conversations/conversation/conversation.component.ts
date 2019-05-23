import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { ConversationsService } from '../conversations.service';
import { Message } from '../message.model';
import { Conversation } from '../conversation.model';

@Component({
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css'],
})
export class ConversationComponent implements OnInit, OnDestroy {
  newMessage: '';
  conversation: Conversation;
  isLoading = false;
  userIsAuthenticated = false;
  userId: string;
  private toId: string;
  private conversationId: string;
  private conversationSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public conversationsService: ConversationsService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });
    this.userId = this.authService.getUserId();
    this.conversationSub = this.conversationsService
      .getConversationUpdateListener()
      .subscribe(({ message, conversation }) => {
        this.conversation = conversation;
        this.toId = conversation.userIds.filter(id => id !== this.userId)[0];
      });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.conversationId = paramMap.get('conversationId');
      this.isLoading = true;
      this.conversationsService.getConversation(this.conversationId).subscribe(data => {
        console.log('ngOnInit here', data.userIds, this.userId);
        this.isLoading = false;
        this.conversation = data;
        this.toId = data.userIds.filter(id => id !== this.userId)[0];
        console.log(this.toId);
      });
    });
  }

  sendMessage() {
    console.log(this.toId);
    this.conversationsService.sendMessage(this.toId, this.newMessage);
    this.newMessage = '';
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
