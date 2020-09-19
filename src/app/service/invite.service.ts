import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface User {
  id?: number;
  email: string;
  invited?: boolean;
  message?: string;
}

@Injectable()
export class InviteService {
  private users: User[] = [];
  private readonly url = 'http://localhost:3000/users';

  invitedCount = 0;

  constructor(private http: HttpClient) {
  }

  getUsers(): Observable<User[]> {
    if (this.users.length > 0) {
      return new Observable<User[]>(observer => {
        observer.next(this.users);
      });
    }
    return this.http.get<User[]>(this.url).pipe(map(users => {
      this.users = users;
      return users;
    }));
  }

  invite(user: User) {
    if (user.id !== undefined) {
      return this.http.put(`${this.url}/${user.id}`, user);
    }
    return this.http.post<User>(this.url, user);
  }

  update(user: User) {
    const index = this.users.findIndex(_user => _user.email === user.email);
    if (index === -1) {
      this.users.push(user);
    } else {
      this.users[index] = user;
    }
  }

  incrementInvited() {
    this.invitedCount++;
  }

  clearCache() {
    this.users = [];
    this.invitedCount = 0;
    return this;
  }
}
