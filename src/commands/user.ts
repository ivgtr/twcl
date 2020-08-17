import prompts from 'prompts'
import colors from './console'

const unSelectDb = async (db: Nedb) => {
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
        throw new Error(
          'database削除時にエラーがあったようです...もう一度ログインを試してみてください'
        )
      }
    )
  })
  await db.loadDatabase()
  return data
}

const setUser = async (db: Nedb, userName: string) => {
  if (await unSelectDb(db)) {
    const completed = await new Promise((resolve) => {
      db.update(
        {
          name: userName
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
          throw new Error(
            'database削除時にエラーがあったようです...もう一度ログインを試してみてください'
          )
        }
      )
    })
    if (completed) {
      await db.loadDatabase()
      console.log(`${colors.green('>')} ${userName} にアカウントを変更しました`)
      return
    }
    throw new Error(
      'database登録時にエラーがあったようです...もう一度ログインを試してみてください'
    )
  }
}

const findUsers = async (
  db: Nedb
): Promise<
  { title: string; value: { type: string; id?: string; name?: string } }[]
> => {
  const selectedUser: {
    title: string
    value: { type: string; id?: string; name?: string }
  }[] = await new Promise((resolve) => {
    db.find({}, (err, result) => {
      if (!err) {
        const selectArray: {
          title: string
          value: { type: string; id?: string; name?: string }
        }[] = []
        for (let i = 0; i < result.length; i += 1) {
          selectArray.push({
            title: result[i].name,
            value: {
              type: 'user',
              id: result[i]._id,
              name: result[i].name
            }
          })
        }
        resolve(selectArray)
        return
      }
      throw new Error(
        'database検索時にエラーがあったようです...もう一度試してみてください'
      )
    })
  })
  return selectedUser
}

const selectedChangeUser = async (
  selected: {
    title: string
    value: { type: string; id?: string; name?: string }
  }[]
): Promise<{ type: string; id?: string; name?: string }> => {
  try {
    const onCancel = () => {
      throw new Error('Error: 選択されませんでした')
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
  } catch (err) {
    throw new Error(err)
  }
}

const selectUser = async (db: Nedb) => {
  const selectedArray = await findUsers(db)
  const { name } = await selectedChangeUser(selectedArray)
  if (name) {
    await setUser(db, name)
  }
}

const checkUserName = async (db: Nedb, userName: string) => {
  const selected: any = await new Promise((resolve) => {
    db.findOne({ name: userName }, (error, result) => {
      if (!error) {
        resolve(result)
        return
      }
      throw new Error('Error: あれ')
    })
  })
  if (selected) {
    await setUser(db, userName)
    return
  }
  selectUser(db)
}

const user = (db: Nedb, name: string): void => {
  try {
    if (name) {
      checkUserName(db, name)
      return
    }
    selectUser(db)
  } catch (err) {
    console.error(err.message)
  }
}

export default user
