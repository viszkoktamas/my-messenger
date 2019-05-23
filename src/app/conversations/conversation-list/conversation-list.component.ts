import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { ConversationPreview } from '../conversation-preview.model';
import { ConversationsService } from '../conversations.service';

@Component({
  templateUrl: './conversation-list.component.html',
  styleUrls: ['./conversation-list.component.css'],
})
export class ConversationListComponent implements OnInit, OnDestroy {
  list: ConversationPreview[] = [];
  isLoading = false;
  totalCount = 0;
  countPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private listSub: Subscription;
  private authStatusSub: Subscription;

  constructor(public conversationsService: ConversationsService, private authService: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.conversationsService.getConversations(this.countPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.listSub = this.conversationsService
      .getConversationsUpdateListener()
      .subscribe((data: { conversations: ConversationPreview[]; conversationCount: number }) => {
        console.log(data.conversations);
        this.isLoading = false;
        this.totalCount = data.conversationCount;
        this.list = data.conversations;
      });
    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthneticated => {
      this.userIsAuthenticated = isAuthneticated;
      this.userId = this.authService.getUserId();
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.countPerPage = pageData.pageSize;
    this.conversationsService.getConversations(this.countPerPage, this.currentPage);
  }

  onDelete(elemId: string) {
    this.conversationsService.deletePost(elemId).subscribe(
      () => {
        this.conversationsService.getConversations(this.countPerPage, this.currentPage);
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this.listSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
