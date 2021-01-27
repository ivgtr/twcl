import path from 'path'
import Datastore from 'nedb-promises'

const rootDir = path.join(
  process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME'] as string,
  '.twcl/config.db'
)

export class database {
  rootDir: string
  db: Datastore
  constructor() {
    this.rootDir = rootDir
    this.db = Datastore.create(rootDir)
  }

  init() {
    return this.db
      .findOne<UserData>({ selected: true })
      .then((user) => user)
  }

  setUser({ user_name, user_id, access_token, access_token_secret, selected }: UserData) {
    return this.db.insert<UserData>({
      user_name,
      user_id,
      access_token,
      access_token_secret,
      selected
    })
  }

  getAllUser() {
    return this.db.find<UserData[]>({}).then((users) => users)
  }

  searchUser(user_name: string) {
    return this.db
      .findOne<UserData>({ user_name })
      .then((user) => (user ? true : false))
  }
}
