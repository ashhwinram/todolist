export const TODO_ENDPOINTS = {
    ADD: '/addTodo',
    DELETE: '/deleteTodo',
    SELECT: '/selectTodo',
    EDIT: '/editTodo'
}

export function findIndex(items, name) {
    const itemToFind = items.find((todo) => todo.name === name);
    return items.indexOf(itemToFind);
}

export function handleEnterClick(event, callback) {
    if (event.key === 'Enter') {
        callback();
    }
}

export async function updateDatabase(endpoint, data) {
    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).catch((err) => {
        console.error(err);
    })
}