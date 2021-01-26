import { database } from '../db'

export const operationUserLogin = async (db: database) => {
  await db.setUser()
}
