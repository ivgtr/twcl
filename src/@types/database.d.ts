type UserData = {
  user_name: string
  user_id: string
  access_token: string
  access_token_secret: string
  selected: boolean
}

type SelectedUser = {
  type: string
  id: string
  name: string
}

type SelectedUserArray = {
  title: string
  value: SelectedUser
}
