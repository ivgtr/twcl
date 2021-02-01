import prompts from 'prompts'
import chalk from 'chalk'

import { database } from '../db'

const selectedDeleteUser = (selectedArray: SelectedUserArray[]) => {
  const onCancel = () => {
    throw new Error('Could not confirm your input, Try again.')
  }
  return prompts(
    [
      {
        type: 'select',
        name: 'user',
        message: 'Select the account you want to delete.',
        choices: selectedArray
      }
    ],
    { onCancel }
  ).then<{ user: SelectedUser }>((input) => input)
}

const createSelectedArray = (users: UserData[]): SelectedUserArray[] => {
  const selectArray: SelectedUserArray[] = [
    {
      title: 'all',
      value: { type: 'all', id: 'all', name: 'all' }
    }
  ]
  for (let i = 0; i < users.length; i += 1) {
    selectArray.push({
      title: users[i].user_name,
      value: {
        type: 'user',
        id: users[i].user_id,
        name: users[i].user_name
      }
    })
  }

  return selectArray
}

export const operationUserLogout = async (db: database) => {
  const users = await db.getAllUser()
  const selectedArray = await createSelectedArray(users)
  const { user } = await selectedDeleteUser(selectedArray)
  if (user.type === 'all') {
    db.deleteAllUser().then((result) => {
      console.log(`${chalk.green('✔')} All accounts(${result}) deleted.`)
    })
  } else {
    db.deleteUser(user.id).then(() => {
      console.log(`${chalk.green('✔')} Logged out of ${user.name}`)
    })
  }
}
