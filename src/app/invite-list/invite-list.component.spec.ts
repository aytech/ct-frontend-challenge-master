import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteListComponent } from './invite-list.component';
import { InviteService } from '../service/invite.service';
import { HttpClientModule } from '@angular/common/http';

describe('InviteListComponent', () => {
  let component: InviteListComponent;
  let fixture: ComponentFixture<InviteListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InviteListComponent],
      imports: [HttpClientModule],
      providers: [InviteService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get total invited', function () {
    expect(component.getTotal()).toBe(0);
    fixture.debugElement.injector.get(InviteService).incrementInvited();
    expect(component.getTotal()).toBe(1);
  });
});
