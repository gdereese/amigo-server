import { IDatastore } from '../../src/data/datastore';
import { IRepository } from '../../src/data/repository';
import { Friend } from '../../src/models/friend';
import { FriendRequest } from '../../src/models/friend-request';

export class MockTsDatastore implements IDatastore {
  public friends: IRepository<Friend>;
  public friendRequests: IRepository<FriendRequest>;
}

export default MockTsDatastore;
