import { database } from '../db'

export const operationUserLogout = async (db: database) => {
  const data = await db.getAllUser()
  console.log(data)
}
