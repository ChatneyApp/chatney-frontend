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


const GET_TODOS_QUERY: TypedDocumentNode<ToDo[]> = gql`
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

    return <>Name: {data[0].user.name}</>;
}

export const PermissionsUsersList = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <ToDoEl />
    </Suspense>
);