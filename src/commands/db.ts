type user = {
  type?: string
  name?: string
  accessToken?: string
  accessTokenSecret?: string
  userid?: string
  selected?: boolean
  _id?: string
}

export const checkUserName = (db: Nedb, name: string): Promise<boolean> => {
  return new Promise((resolve) => {
    db.findOne({ name }, (err, result) => {
      if (!err && result) {
        resolve(true)
      } else {
        resolve(false)
      }
    })
  })
}

export const selectedUser = async (db: Nedb): Promise<user> => {
  const user = await new Promise((resolve) => {
    db.findOne({ selected: true }, (err, result) => {
      if (!err && result) {
        resolve(result)
      } else {
        resolve({})
      }
    })
  })
  return user
}

export const getAllUsers = async (db: Nedb): Promise<user[]> => {
  const user: user[] = await new Promise((resolve) => {
    db.find({}, (err, result: user[]) => {
      if (!err && result) {
        resolve(result)
      } else {
        resolve([])
      }
    })
  })
  return user
}
