import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { User } from '../user.model';
import { UsersService } from '../users.service';
import { ConversationsService } from 'src/app/conversations/conversations.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  isLoading = false;
  filter = '';
  totalUsers = 0;
  usersPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private usersSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public usersService: UsersService,
    public conversationsService: ConversationsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.usersService.getUsersByName(this.usersPerPage, this.currentPage, this.filter);
    this.userId = this.authService.getUserId();
    this.usersSub = this.usersService
      .getUserUpdateListener()
      .subscribe((userData: { users: User[]; userCount: number }) => {
        this.isLoading = false;
        this.totalUsers = userData.userCount;
        this.users = userData.users;
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
    this.usersPerPage = pageData.pageSize;
    this.usersService.getUsersByName(this.usersPerPage, this.currentPage, this.filter);
  }

  onFilterChanged() {
    this.isLoading = true;
    this.usersService.getUsersByName(this.usersPerPage, this.currentPage, this.filter);
  }

  onStartConversation(toId: string) {
    this.conversationsService.startConversation(toId);
  }

  ngOnDestroy() {
    this.usersSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
