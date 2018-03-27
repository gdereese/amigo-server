import { IDatastore } from '../../src/data/datastore';
import { IRepository } from '../../src/data/repository';
import { Friend } from '../../src/models/friend';
import { FriendRequest } from '../../src/models/friend-request';

export class MockDatastore implements IDatastore {
  public friends: IRepository<Friend> = {} as IRepository<Friend>;
  public friendRequests: IRepository<FriendRequest> = {} as IRepository<
    FriendRequest
  >;
}

export default MockDatastore;
