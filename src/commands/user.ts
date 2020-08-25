import prompts from 'prompts'
import colors from './console'

import { checkUserName, setSelectedUser, unSetSelecte, getAllUser } from './db'

type user = {
  type?: string
  name?: string
  accessToken?: string
  accessTokenSecret?: string
  userid?: string
  selected?: boolean
  _id?: string
}

type selectedArray = {
  title: string
  value: selectedUser
}

type selectedUser = {
  type: string
  id?: string
  name?: string
}

const setUser = async (db: Nedb, name: string) => {
  if (await unSetSelecte(db)) {
    const completed = await setSelectedUser(db, name)
    if (completed) {
      console.log(`${colors.green('✔')} ${name} にアカウントを変更しました`)
      return
    }
    throw new Error(
      'database登録時にエラーがあったようです...もう一度ログインを試してみてください'
    )
  }
}

const createSelectedArray = (users: user[]): selectedArray[] => {
  const selectArray: selectedArray[] = []
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

const selectedChangeUser = async (
  selected: selectedArray[]
): Promise<{ type: string; id?: string; name?: string }> => {
  const onCancel = () => {
    throw new Error(`${colors.red('✖')} 選択されませんでした`)
  }
  const { user } = await prompts(
    [
      {
        type: 'select',
        name: 'user',
        message: '変更したいアカウントを選択してください',
        choices: selected
      }
    ],
    { onCancel }
  )
  return user
}

const selectUser = async (db: Nedb): Promise<void> => {
  try {
    const users = await getAllUser(db)
    const selectedArray = await createSelectedArray(users)
    const { name } = await selectedChangeUser(selectedArray)
    if (name) {
      await setUser(db, name)
    }
  } catch (err) {
    console.error(err.message)
  }
}

const user = async (db: Nedb, name: string): Promise<void> => {
  try {
    if (name) {
      if (await checkUserName(db, name)) {
        await setUser(db, name)
        return
      }
      console.log(`${colors.red('✖')} 入力した名前は見つかりませんでした`)
    }
    selectUser(db)
  } catch (err) {
    console.error(err.message)
  }
}

export default user
