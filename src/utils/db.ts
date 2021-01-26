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

  setUser() {
    return this.db.insert<UserData>({
      userName: 'test',
      userId: 'abc',
      token: 'adafkaw',
      selected: true
    })
  }

  getAllUser() {
    return this.db.find<UserData[]>({}).then((users) => users)
  }
}
