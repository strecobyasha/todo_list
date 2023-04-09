import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';


const style={
    userSelect: 'none',
    padding: 16,
    margin: '0 0 8px 0',
    minHeight: '50px',
    color: 'white',
}


function TodoItem({ id, index, new_content, new_status, updateItem, removeItem }) {
    const [content, setContent] = useState(new_content);
    const [status, setStatus] = useState(new_status);
    const [isEditing, setIsEditing] = useState(false);

    const handleReset = () => {
        // When user taps outside the content div, 
        // it becomes possible to drag TODO item by grabbing onto this div.
        setIsEditing(false);
    };

    const handleDoubleClick = () => {
        // Convert content div to textarea. 
        // BTW, we need to use div, not textarea, to be able to drag TODO item
        // by grabbing onto this div.
        setIsEditing(true);
    };

    const handleContentBlur = (event) => {
        // Update TODO item content after user ended editing.
        setIsEditing(false);
        const new_content = event.target.innerHTML;
        setContent(new_content);
        updateItem(id, new_content, new_status);
    };

    const handleStatusChange = () => {
        // Change the TODO item status (done, undone).
        let new_status = true ? status === false : false;
        setStatus(new_status);
        updateItem(id, content, new_status);
    };

    return (
        <Draggable
            draggableId={id}
            index={index}
        >
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                        ...style,
                        ...provided.draggableProps.style
                    }}
                    className="todo-item"
                >
                    <div // TODO item content is stored in this div.
                        contentEditable={isEditing}
                        onBlur={handleContentBlur}
                        onClick={handleDoubleClick}
                        className="content"
                        dangerouslySetInnerHTML={{ __html: new_content }}
                    ></div>
                    <div
                        onClick={handleReset}
                        className="item-menu"
                    >
                        <label className="switch">
                            <input // TODO item status.
                                type="checkbox" 
                                onChange={handleStatusChange} 
                                checked={new_status}
                            ></input>
                            <span className="slider round"></span>
                        </label>
                        <button onClick={() => removeItem(id)}>X</button>
                    </div>
                </div>
            )}
        </Draggable>
    );
}

export default TodoItem;
