import * as _ from 'lodash';

export function isIn(strings: string[], value?: string): boolean {
  return _.some(
    strings,
    s => (s || '').toLocaleLowerCase() === (value || '').toLocaleLowerCase()
  );
}
