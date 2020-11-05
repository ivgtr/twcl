type userData = {
  type?: string
  name?: string
  accessToken?: string
  accessTokenSecret?: string
  userid?: string
  selected?: boolean
  _id?: string
}

type listData = { id: string; name: string; description: string }

type selectedUser = {
  type: string
  id?: string
  name?: string
}

type selectedArray = {
  title: string
  value: selectedUser
}
