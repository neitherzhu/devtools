import path from 'path'
import DateBase from 'nedb'

/* eslint-disable no-new */
export const projectDB = new DateBase({
  filename: path.join(__dirname, 'datebase/projects.db'),
  autoload: true
})

export const cardDB = new DateBase({
  filename: path.join(__dirname, 'datebase/cards.db'),
  autoload: true
})
