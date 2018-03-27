import * as _ from 'lodash';
import * as lodashQuery from 'lodash-query';

import { IRepository } from '../../data/repository';

const query = lodashQuery(_, false);

export class InMemoryRepository<T> implements IRepository<T> {
  protected items: { [key: string]: T } = {};

  public create(entity: T, idPropertyName: string = 'id'): Promise<T> {
    if (!entity[idPropertyName]) {
      entity[idPropertyName] = this.nextId(idPropertyName);
    }

    const key = entity[idPropertyName].toString();

    if (this.items[key]) {
      throw new Error(`Item with key '${key}' already exists.`);
    }

    this.items[key] = entity;

    return Promise.resolve(entity);
  }

  public delete(id: any): Promise<any> {
    this.items = _.omit(this.items, id.toString());

    return Promise.resolve();
  }

  public get(id: any): Promise<T> {
    const item = this.items[id.toString()];

    return Promise.resolve(item);
  }

  public initialize(items: T[] = [], idPropertyName: string = 'id') {
    this.items = {};
    _.forEach(items, item => this.create(item, idPropertyName));
  }

  public query(criteria: any): Promise<T[]> {
    const items = query(_.values(this.items), criteria);

    return Promise.resolve(items);
  }

  public update(entity: T, idPropertyName: string = 'id'): Promise<T> {
    const key = entity[idPropertyName].toString();

    this.items[key] = entity;

    return Promise.resolve(entity);
  }

  protected nextId(propertyName: string): number {
    const itemWithMax: any = _.maxBy(_.values(this.items), propertyName);
    if (!itemWithMax) {
      return 1;
    }

    return itemWithMax[propertyName] + 1;
  }
}
