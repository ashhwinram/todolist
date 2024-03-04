import {useState, useRef} from 'react';
import {useSelector} from 'react-redux'
import '../App.css';
import ChecklistItem from './Checklist-Item';

/* using local state */
function Checklist() {

    const items = useSelector((state) => state.checklist.items);
    const [todoList, setTodoList] = useState(items);
    const newTodo = useRef('');

    function addNewTodo() {
        const newItem = newTodo.current.value;
        const todoLists = todoList.map((todo) => todo.name.toLowerCase());
        if (todoLists.includes(newItem.toLowerCase())) {
            alert('Item already exists');
            return;
        }
        if (newItem !== '') {
            setTodoList([...todoList, {name: newItem, checked: false}]);
        }
        newTodo.current.value = '';
    }

    function onDeleteTodo(value) {
        const newList = todoList.filter((todo) => todo.name !== value);
        setTodoList(newList);
    }

    function onSelectTodo(name, value) {
        let newList = todoList.slice();
        setTodoList(newList.map((todo) => {
            if (todo.name === name) {
                return {
                    ...todo,
                    checked: value,
                }
            }
            else {
                return todo;
            }
        }));
    }

    function onEditTodo(name, updatedName) {
        let newList = todoList.slice();
        setTodoList(newList.map((todo) => {
            if (todo.name === name) {
                return {
                    ...todo,
                    name: updatedName
                }
            }
            else {
                return todo;
            }
        }));
    }

    function handleEnterClick(event) {
        if (event.key === 'Enter') {
            addNewTodo();
        }
    }

    const itemComponents = todoList.map((todo) => {
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
                <input className='checklist-input' type='text' placeholder='Add todo' onKeyPress={handleEnterClick} ref={newTodo}></input>
                <button className='checklist-add' onClick={addNewTodo}>Add</button>
            </div>
            <div className='checklist-items'>{itemComponents}</div>
        </div>
    );
}

export default Checklist;