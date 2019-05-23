import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from './user.model';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private users: User[] = [];
  private usersUpdated = new Subject<{ users: User[]; userCount: number }>();

  constructor(private http: HttpClient) {}

  getUsersByName(usersPerPage: number, currentPage: number, filter: string) {
    const queryParams = `?page_size=${usersPerPage}&page=${currentPage}&name=${filter}`;
    this.http
      .get<{ message: string; users: User[]; maxUsers: number }>(BACKEND_URL + queryParams)
      .subscribe(({ users, maxUsers }) => {
        this.users = users;
        this.usersUpdated.next({
          users: [...this.users],
          userCount: maxUsers,
        });
      });
  }

  getUser(id: string) {
    return this.http.get<User>(BACKEND_URL + id);
  }

  getUserUpdateListener() {
    return this.usersUpdated.asObservable();
  }
}
