import { InviteService } from './invite.service';
import { of } from 'rxjs';

describe('InviteService', () => {
  let httpClientSpy: { get: jasmine.Spy, post: jasmine.Spy, put: jasmine.Spy };
  let service: InviteService;
  const userStub = {id: 1, email: 'test@comtravo.com'};

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put']);
    service = new InviteService(httpClientSpy as any);
  });

  it('should get users from backend', done => {
    httpClientSpy.get.and.returnValue(of([userStub]));
    service.getUsers().subscribe(users => {
      expect(users).toContain(userStub);
      done();
    });
    expect(httpClientSpy.get.calls.count()).toBe(1);
  });

  it('should send new invitation to existing user', done => {
    httpClientSpy.put.and.returnValue(of(userStub));
    service.invite(userStub).subscribe(done);
    expect(httpClientSpy.put.calls.count()).toBe(1);
  });

  it('should send invitation to new user', done => {
    httpClientSpy.post.and.returnValue(of(userStub));
    service.invite({email: 'test@comtravo.com'}).subscribe(done);
    expect(httpClientSpy.post.calls.count()).toBe(1);
  });

  it('should update local cache', done => {
    service.update(userStub);
    service.getUsers().subscribe(users => {
      expect(users).toContain(userStub);
      done();
    });
  });

  it('should increment invited count', () => {
    expect(service.invitedCount).toBe(0);
    service.incrementInvited();
    expect(service.invitedCount).toBe(1);
  });

  it('should clear cache', done => {
    httpClientSpy.get.and.returnValue(of([]));
    service.update(userStub);
    service.incrementInvited();
    service.clearCache();
    service.getUsers().subscribe(users => {
      expect(users.length).toBe(0);
      done();
    });
    expect(service.invitedCount).toBe(0);
  });
});
