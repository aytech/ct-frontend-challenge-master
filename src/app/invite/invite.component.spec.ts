import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { InviteComponent } from './invite.component';
import { InviteService } from '../service/invite.service';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { Router } from '@angular/router';

describe('InviteComponent', () => {
  let component: InviteComponent;
  let fixture: ComponentFixture<InviteComponent>;
  let inviteSpy: jasmine.SpyObj<InviteService>;
  let routerSpy: jasmine.SpyObj<Router>;
  const userStub = {id: 1, email: 'test@comtravo.com'};

  beforeEach(() => {
    inviteSpy = jasmine.createSpyObj('InviteService', ['errorHandler', 'update', 'incrementInvited', 'clearCache', 'getUsers', 'invite']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule
      ],
      providers: [{provide: InviteService, useValue: inviteSpy}, {provide: Router, useValue: routerSpy}],
      declarations: [InviteComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should increment invited on successful invite', () => {
    component.successHandler(userStub);
    expect(inviteSpy.update.calls.count()).toBe(1);
    expect(inviteSpy.incrementInvited.calls.count()).toBe(1);
  });

  it('should update user on unsuccessful invite', () => {
    component.errorHandler(userStub, {statusText: ''});
    expect(inviteSpy.update.calls.count()).toBe(1);
  });

  it('should try to invite all users', () => {
    inviteSpy.clearCache.and.returnValue(inviteSpy);
    inviteSpy.getUsers.and.returnValue(of([userStub]));
    inviteSpy.invite.and.returnValue(of());
    routerSpy.navigate.and.returnValue(Promise.resolve());
    component.onSubmit();
    expect(inviteSpy.clearCache.calls.count()).toBe(1);
    expect(inviteSpy.getUsers.calls.count()).toBe(1);
    expect(inviteSpy.invite.calls.count()).toBe(11);
    expect(routerSpy.navigate.calls.count()).toBe(1);
  });
});
