export interface IRepository {
  create(entity: any): Promise<any>;

  delete(id: any): Promise<any>;

  get(id: any): Promise<any>;

  query(criteria: any): Promise<any[]>;

  update(entity: any): Promise<any>;
}
