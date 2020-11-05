import prompts from 'prompts'
import fs from 'fs'
import colors from './console'

import {
  getAllUser,
  deleteUser,
  selectedUser,
  getRandomUser,
  setSelectedUser
} from './db'

const deleteSelectedUser = async (
  db: Nedb,
  id: string,
  userName: string
): Promise<boolean> => {
  const result = await deleteUser(db, id)
  if (result) {
    console.log(`${colors.green('✔')} ${userName}からログアウトしました`)
    const checkUser = await selectedUser(db)
    if (!Object.keys(checkUser).length) {
      const { name } = await getRandomUser(db)
      if (await setSelectedUser(db, name)) {
        console.log(`${colors.green('✔')} 現在のユーザーは${name}です`)
        return true
      }
      throw new Error(
        'database設定時にエラーがあったようです...もう一度ログインを試してみてください'
      )
    }
    return true
  }
  throw new Error(
    'database削除時にエラーがあったようです...もう一度ログインを試してみてください'
  )
}

const selectedDeleteUser = async (
  selected: selectedArray[]
): Promise<selectedUser> => {
  const onCancel = () => {
    throw new Error('選択されませんでした')
  }
  const { user } = await prompts(
    [
      {
        type: 'select',
        name: 'user',
        message: '削除したいアカウントを選択してください',
        choices: selected
      }
    ],
    { onCancel }
  )
  return user
}

const createSelectedArray = (users: userData[]): selectedArray[] => {
  const selectArray: selectedArray[] = [
    {
      title: 'all',
      value: { type: 'all' }
    }
  ]
  for (let i = 0; i < users.length; i += 1) {
    selectArray.push({
      title: users[i].name,
      value: {
        type: 'user',
        id: users[i]._id,
        name: users[i].name
      }
    })
  }

  return selectArray
}

const Logout = async (db: Nedb, path: string): Promise<void> => {
  try {
    const users = await getAllUser(db)
    const selectedArray = await createSelectedArray(users)
    const { type, id, name } = await selectedDeleteUser(selectedArray)
    if (type === 'all') {
      fs.unlinkSync(path)
      console.log(`${colors.green('✔')} 全てのアカウントを削除しました`)
      return
    }
    if (type) {
      await deleteSelectedUser(db, id, name)
    }
    return
  } catch (err) {
    console.error(`${colors.red('✖')} ${err.message}`)
  }
}

export default Logout
