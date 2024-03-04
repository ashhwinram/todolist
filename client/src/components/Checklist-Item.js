import {Edit, Delete, Check} from '@mui/icons-material';
import {useState, useRef} from 'react';
import {handleEnterClick} from '../utils/Checklist-utils';

export default function ChecklistItem({name, checked, onDelete, onChecked, onEdit}) {
    
    const [edit, setEdit] = useState(false);
    const editValue = useRef(name);

    function switchEdit() {
        const newName = editValue.current?.value;
        if (edit && newName && newName !== name) {
            onEdit(name, newName);
        }
        setEdit(!edit);
    }

    function handleClick(event) {
        handleEnterClick(event, switchEdit);
   }
    
    return (
        <div className='checklist-item'>
            <input type='checkbox' checked={checked} onChange={(e) => onChecked(name, e.target.checked)}></input>
            {edit
                ? <input type='text' defaultValue={name} onKeyPress={handleClick} ref={editValue}></input>
                : <p id='todo-name'>{checked ? <s>{name}</s> : name}</p>
            }
            <button onClick={switchEdit}>{edit ? <Check sx={{ fontSize: 20 }}/> : <Edit sx={{ fontSize: 20 }}/>}</button>
            <button onClick={() => onDelete(name)}><Delete sx={{ fontSize: 20 }}/></button>
        </div>
    );
}