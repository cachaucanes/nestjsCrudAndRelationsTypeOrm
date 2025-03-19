import { CustomerOwnerGuard } from './customer_owner.guard';

describe('CustomerOwnerGuard', () => {
  it('should be defined', () => {
    expect(new CustomerOwnerGuard()).toBeDefined();
  });
});
