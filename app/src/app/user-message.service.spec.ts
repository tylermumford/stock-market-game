import { TestBed } from '@angular/core/testing';

import { UserMessageService } from './user-message.service';

describe('UserMessageService', () => {
  let service: UserMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should accept a message', () => {
    debugger;
    expect(() => service.alert('Test message')).not.toThrow();
  });
});
