import { Suspense } from 'react';
import {
    gql,
    type TypedDocumentNode,
    useSuspenseQuery
} from '@apollo/client';

type ToDo = {
    id: string;
    text: string;
    done: boolean;
    user: {
        id: string;
        name: string;
    }
}

type Data = {
    todos: ToDo[];
}


const GET_TODOS_QUERY: TypedDocumentNode<Data> = gql`
    {
  todos {
    id
    text
    done
    user {
      id
      name
    }
  }
}
  `;

const ToDoEl = () => {
    const { data } = useSuspenseQuery(GET_TODOS_QUERY);

    console.log('loaded data', data);

    return <>Name: {data.todos[0].user.name}</>;
}

export const PermissionsUsersList = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <ToDoEl />
    </Suspense>
);