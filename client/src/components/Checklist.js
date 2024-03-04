import {useState, useRef, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import '../App.css';
import ChecklistItem from './Checklist-Item';
import {setTodo, addTodo, deleteTodo, selectTodo, editTodo} from '../store/checklist-store';
import {findIndex, handleEnterClick, TODO_ENDPOINTS, updateDatabase} from '../utils/Checklist-utils';

/* Using Redux Store */
function Checklist() {

    const [isLoading, setIsLoading] = useState(false);
    const items = useSelector((state) => state.checklist.items);
    const id = useSelector((state) => state.user.activeUser.userId);
    const dispatch = useDispatch();
    const newTodo = useRef('');

    useEffect(() => {
        setIsLoading(true);
        fetch('/getTodos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id})
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setIsLoading(false);
            dispatch(setTodo(data));
        }).catch((err) => {
            console.error(err);
            setIsLoading(false);
            dispatch(selectTodo([]));
        });
    }, []);

    function addNewTodo() {
        const newItem = newTodo.current.value;
        const todoLists = items.map((todo) => todo.name.toLowerCase());
        if (todoLists.includes(newItem.toLowerCase())) {
            alert('Item already exists');
            return;
        }
        if (newItem !== '') {
            const newTodo = {name: newItem, checked: false};
            dispatch(addTodo(newTodo));
            updateDatabase(TODO_ENDPOINTS.ADD, {...newTodo, id});
        }
        newTodo.current.value = '';
    }

    function onDeleteTodo(name) {
        const index = findIndex(items, name);
        dispatch(deleteTodo(index));
        updateDatabase(TODO_ENDPOINTS.DELETE, {name});
    }

    function onSelectTodo(name, isSelected) {
        const index = findIndex(items, name);
        dispatch(selectTodo({index, isSelected}))
        updateDatabase(TODO_ENDPOINTS.SELECT, {name, isSelected});
    }

    function onEditTodo(name, updatedName) {
        const index = findIndex(items, name);
        dispatch(editTodo({index, updatedName}));
        updateDatabase(TODO_ENDPOINTS.EDIT, {name, updatedName});
    }

    function handleClick(event) {
        handleEnterClick(event, addNewTodo);
    }

    const itemComponents = items.map((todo) => {
        return <ChecklistItem 
            key={todo.name}
            name={todo.name}
            checked={todo.checked}
            onDelete={onDeleteTodo}
            onChecked={onSelectTodo}
            onEdit={onEditTodo}
        />
    });

    return (
        <div className='checklist-container'>
            <div className='checklist-adder'>
                <input className='checklist-input' type='text' placeholder='Add todo' onKeyPress={handleClick} ref={newTodo}></input>
                <button className='checklist-add' onClick={addNewTodo}>Add</button>
            </div>
            { isLoading ? <p><i>Loading...</i></p> : null}
            { items.length ? <div className='checklist-items'>{itemComponents}</div> : !isLoading ? <p><i>List is empty</i></p> : null}
        </div>
    );
}

export default Checklist;