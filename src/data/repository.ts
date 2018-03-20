export interface IRepository<T> {
  create(entity: T): Promise<T>;

  delete(id: any): Promise<any>;

  get(id: any): Promise<T>;

  query(criteria: any): Promise<T[]>;

  update(entity: T): Promise<T>;
}
