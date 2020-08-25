type user = {
  type?: string
  name?: string
  accessToken?: string
  accessTokenSecret?: string
  userid?: string
  selected?: boolean
  _id?: string
}

export const setUser = async (
  db: Nedb,
  accessToken: string,
  accessTokenSecret: string,
  userName: string,
  id: number
): Promise<boolean> => {
  const data = {
    type: 'user',
    name: userName,
    accessToken,
    accessTokenSecret,
    userid: id.toString(),
    selected: true
  }
  const result: boolean = await new Promise((resolve) => {
    db.insert(data, (err) => {
      if (!err) {
        resolve(true)
        return
      }
      resolve(false)
    })
  })
  await db.loadDatabase()
  return result
}
export const deleteUser = async (db: Nedb, id: string): Promise<boolean> => {
  const result: boolean = await new Promise((resolve) => {
    db.remove({ _id: id }, { multi: false }, (err) => {
      if (!err) {
        resolve(true)
        return
      }
      resolve(false)
    })
  })
  await db.loadDatabase()
  return result
}

export const setSelectedUser = async (
  db: Nedb,
  name: string
): Promise<boolean> => {
  const data: boolean = await new Promise((resolve) => {
    db.update(
      {
        name
      },
      {
        $set: {
          selected: true
        }
      },
      {},
      (error) => {
        if (!error) {
          resolve(true)
          return
        }
        resolve(false)
      }
    )
  })
  await db.loadDatabase()
  return data
}

export const unSetSelecte = async (db: Nedb): Promise<boolean> => {
  const data: boolean = await new Promise((resolve) => {
    db.update(
      {
        selected: true
      },
      {
        $set: {
          selected: false
        }
      },
      {
        multi: true
      },
      (error) => {
        if (!error) {
          resolve(true)
          return
        }
        resolve(false)
      }
    )
  })
  await db.loadDatabase()
  return data
}

export const getAllUser = (db: Nedb): Promise<user[]> => {
  return new Promise((resolve) => {
    db.find({}, (err, result) => {
      if (!err && result) {
        resolve(result)
      } else {
        resolve([])
      }
    })
  })
}

export const getRandomUser = (db: Nedb): Promise<user> => {
  return new Promise((resolve) => {
    db.findOne({}, (err, result) => {
      if (!err && result) {
        resolve(result)
      } else {
        resolve({})
      }
    })
  })
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
  db.loadDatabase()
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
  db.loadDatabase()
  return user
}
