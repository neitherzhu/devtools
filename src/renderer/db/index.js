import path from 'path'
import DateBase from 'nedb'
import { APP_DATA_PATH } from '@/constants'

/* eslint-disable no-new */
export const projectDB = new DateBase({
  filename: path.join(APP_DATA_PATH, 'datebase/projects.db'),
  autoload: true
})

export const cardDB = new DateBase({
  filename: path.join(APP_DATA_PATH, 'datebase/cards.db'),
  autoload: true
})
