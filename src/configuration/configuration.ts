import * as _ from 'lodash';

import { Settings } from './settings';

let settingsObj: Settings = null;

export function getSettings(): Settings {
  return settingsObj;
}

export function mergeSettings(value?: any) {
  settingsObj = _.mergeWith(settingsObj, value);
}
