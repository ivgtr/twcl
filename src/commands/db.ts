type user = {
  type?: string
  name?: string
  accessToken?: string
  accessTokenSecret?: string
  userid?: string
  selected?: boolean
  _id?: string
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

export const allUsers = async (db: Nedb) => {}
