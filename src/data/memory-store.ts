import * as _ from 'lodash';
import * as lodashQuery from 'lodash-query';

import { IRepository } from './repository';

const query = lodashQuery(_, false);

export class MemoryStore<T> implements IRepository {
  protected static items: { [key: string]: any } = {};

  public create(entity: T, idPropertyName: string = 'id'): Promise<T> {
    if (!entity[idPropertyName]) {
      entity[idPropertyName] = this.nextId(idPropertyName);
    }

    const key = entity[idPropertyName].toString();

    if (MemoryStore.items[key]) {
      throw new Error(`Item with key '${key}' already exists.`);
    }

    MemoryStore.items[key] = entity;

    return Promise.resolve(entity);
  }

  public delete(id: any): Promise<any> {
    MemoryStore.items = _.omit(MemoryStore.items, id.toString());

    return Promise.resolve();
  }

  public get(id: any): Promise<T> {
    const item = MemoryStore.items[id.toString()];

    return Promise.resolve(item);
  }

  public initialize(items: T[] = [], idPropertyName: string = 'id') {
    MemoryStore.items = {};
    _.forEach(items, item => this.create(item, idPropertyName));
  }

  public query(criteria: any): Promise<T[]> {
    const items = query(_.values(MemoryStore.items), criteria);

    return Promise.resolve(items);
  }

  public update(entity: any, idPropertyName: string = 'id'): Promise<T> {
    const key = entity[idPropertyName].toString();

    MemoryStore.items[key] = entity;

    return Promise.resolve(entity);
  }

  protected nextId(propertyName: string): number {
    const itemWithMax: any = _.maxBy(_.values(MemoryStore.items), propertyName);
    if (!itemWithMax) {
      return 1;
    }

    return itemWithMax[propertyName] + 1;
  }
}
