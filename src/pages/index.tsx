import type { NextPage } from 'next'
import Head from 'next/head'
import { SetStateAction, useCallback, useState } from 'react'
import { trpc } from '@/utils/trpc'

import {
  Card,
  CardContent,
  CardForm,
  CardHeader,
  List,
  ListItem,
} from '../components/index';
import { GroceryList } from '@prisma/client';

const Home: NextPage = () => {
  const [itemName, setItemName] = useState<string>('');

  const { data: list, refetch } = trpc.useQuery(['findAll'])
  const insertMutation = trpc.useMutation(['insertOne'], {
    onSuccess: () => refetch(),
  })
  const deleteOneMutation = trpc.useMutation(['deleteOne'], {
    onSuccess: () => refetch(),
  })
  const deleteAllMutation = trpc.useMutation(['deleteAll'], {
    onSuccess: () => refetch(),
  })
  const updateOneMutation = trpc.useMutation(['updateOne'], {
    onSuccess: () => refetch(),
  })

  const insertOne = useCallback(() => {
    if (itemName === '') return;

    insertMutation.mutate({
      title: itemName
    })

    setItemName('')
  }, [itemName, insertMutation])

  const deleteOne = useCallback((item: GroceryList) => {
    deleteOneMutation.mutate({
      id: item.id
    })
  }, [deleteOneMutation])

  const clearAll = useCallback(() => {
    if (list?.length) {
      deleteAllMutation.mutate({
        ids: list.map((item: { id: any; }) => item.id)
      })
    }
  }, [list, deleteAllMutation])

  const updateOne = useCallback(
    (item: GroceryList) => {
      updateOneMutation.mutate({
        ...item,
        checked: !item.checked
      })
    }, 
    [updateOneMutation]
  )

  const handlePropsectiveItem = (e: { target: { value: SetStateAction<string>; }; }) => {
    setItemName(e.target.value)
  }

  return (
    <>
      <Head>
        <title>Grocery List</title>
        <meta name='description' content='Visit. www.mosano.eu' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <Card>
          <CardContent>
            <CardHeader
              title='Grocery List'
              listLength={list?.length ?? 0}
              clearAllFn={clearAll}
            />
            <List>
              {list?.map((item) => (
                <ListItem
                  key={item.id}
                  item={item}
                  onUpdate={updateOne}
                  onDelete={deleteOne}
                />
              ))}
            </List>
          </CardContent>
          <CardForm
            value={itemName}
            onChange={handlePropsectiveItem}
            submit={insertOne}
          />
        </Card>
      </main>
    </>
  )
};

export default Home