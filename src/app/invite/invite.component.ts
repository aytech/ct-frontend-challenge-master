import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InviteService, User } from '../service/invite.service';

const users: User[] = [
  {email: 'user0@comtravo.com'},
  {email: 'user1@comtravo.com'},
  {email: 'user2@comtravo.com'},
  {email: 'user3@comtravo.com'},
  {email: 'user4@comtravo.com'},
  {email: 'user5@comtravo.com'},
  {email: 'user6@comtravo.com'},
  {email: 'user7@comtravo.com'},
  {email: 'user8@comtravo.com'},
  {email: 'user9@comtravo.com'},
  {email: 'user10@comtravo.com'}
];

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.css']
})
export class InviteComponent implements OnInit {

  constructor(private inviteService: InviteService, private router: Router) {
  }

  ngOnInit(): void {
  }

  successHandler = (user: User) => {
    user.invited = true;
    this.inviteService.update(user);
    this.inviteService.incrementInvited();
  };

  errorHandler = (user: User, error: any) => {
    user.invited = false;
    user.message = error.statusText;
    this.inviteService.update(user);
  };

  onSubmit(): void {
    this.inviteService.clearCache().getUsers().subscribe(_users => {
      users.map(async user => {
        const existing = _users.find(_user => _user.email === user.email);
        if (existing !== undefined) {
          await this.inviteService
            .invite(existing).subscribe(this.successHandler, this.errorHandler.bind(null, existing));
        } else {
          await this.inviteService.invite(user).subscribe(this.successHandler, this.errorHandler.bind(null, user));
        }
      });
      this.router.navigate(['/list']).then();
    });
  }
}
