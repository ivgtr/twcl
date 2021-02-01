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
    return this.db
      .insert<UserData>({
        user_name,
        user_id,
        access_token,
        access_token_secret,
        selected
      })
      .then(() => {
        this.db.load()
      })
  }

  unSetUser() {
    return this.db
      .update(
        { selected: true },
        {
          $set: {
            selected: false
          }
        },
        {
          multi: true
        }
      )
      .then(() => {
        this.db.load()
      })
  }

  usedUser(user_name: string) {
    return this.db
      .update(
        { user_name },
        {
          $set: {
            selected: true
          }
        },
        {
          multi: false
        }
      )
      .then(() => {
        this.db.load()
      })
  }

  getAllUser() {
    return this.db.find<UserData>({}).then((users) => users)
  }
  deleteUser(user_id: string) {
    return this.db.remove({ user_id }, { multi: false })
  }

  deleteAllUser() {
    return this.db.remove({}, { multi: true })
  }

  searchUser(user_name: string) {
    return this.db
      .findOne<UserData>({ user_name })
      .then((user) => (user ? true : false))
  }
}
