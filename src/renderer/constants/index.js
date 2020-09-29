const path = require('path')
const {
  remote: { app }
} = require('electron')

export const NORMAL_MINI_APP_TYPE = 1
export const CARD_MINI_APP_TYPE = 2
export const TV_MINI_APP_TYPE = 3
export const CARD_PROJECT_TYPE = 10
export const SINGLE_CARD_TYPE = 20

const homePath = app.getPath('home').replace(/\s+/g, '')
const appDataPath = app.getPath('appData').replace(/\s+/g, '')
export const DEFAULT_PROJECT_PATH = path.join(homePath, 'MiniProjects')
export const APP_DATA_PATH = appDataPath

export const TYPES = [
  NORMAL_MINI_APP_TYPE,
  CARD_MINI_APP_TYPE,
  TV_MINI_APP_TYPE,
  CARD_PROJECT_TYPE,
  SINGLE_CARD_TYPE
]
export const TEMPLATE_GIT = {
  [NORMAL_MINI_APP_TYPE]: '',
  [CARD_MINI_APP_TYPE]: 'https://github.com/shinemofe/mp-template.git',
  [TV_MINI_APP_TYPE]: '',
  [CARD_PROJECT_TYPE]: 'https://github.com/shinemofe/card-template.git',
  [SINGLE_CARD_TYPE]: 'https://github.com/shinemofe/single-card-template.git'
}
