import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';
import TodoItem from './TodoItem';


function TodoList(props) {
    const [items, setItems] = useState(props.items);
    const [history, updateHistory] = useState([props.items]);
    const [filter, setFilter] = useState('all');
    const [hasChanges, setHasChanges] = useState(false);
    const todoListSocket = useRef(new WebSocket('ws://' + window.location.host + '/ws/' + props.user + '/'));

    const onDragEnd = (result) => {
        // If the item was dropped outside of a droppable area, do nothing.
        if (!result.destination) {
            return;
        }
        const { source, destination } = result;
        const newItems = [...items];
        // Remove the dragged item from the array.
        const [removed] = newItems.splice(source.index, 1);
        // Insert the dragged item at the destination index.
        newItems.splice(destination.index, 0, removed);
        setItems(newItems);
        // Update the state with the new items list.
        setHasChanges(true);
    };

    const addItem = () => {
        const newId = uuidv4();
        const newItem = { id: newId, content: " ", status: false };
        const newItems = [...items, newItem];
        setItems(newItems);
        setFilter("all");
        setHasChanges(true);
        updateHistory([...history, newItems]);
    };

    const removeItem = (id) => {
        const newItems = items.filter((item) => item.id !== id);
        setItems(newItems);
        setHasChanges(true);
        updateHistory([...history, newItems]);
    };

    const onItemChange = (itemId, newContent, newStatus) => {
        // This function is called from todoItem.js when the item was changed.
        const updatedItems = items.map((item) => {
            if (item.id === itemId) {
                return {
                    ...item,
                    content: newContent,
                    status: newStatus,
                };
            }
            return item;
        });
        setItems(updatedItems);
        setHasChanges(true);
        updateHistory([...history, updatedItems]);
    };

    const undo = () => {
        // Undo changes step by step.
        if (history.length > 1) {
            const currentItems = history[history.length-2];
            setItems(currentItems);
            if (history.length === 2) {
                setHasChanges(false);
            }
            updateHistory(history.slice(0, -1));
        }
    };

    const handleFilterChange = (event) => {
        // User can chose to show only done items, undone or 
        // all items from the bottom menu.
        setFilter(event.target.value);
    };

    const save = () => {
        todoListSocket.current.send(JSON.stringify({ task: 'save', user: props.user, data: items }));
        updateHistory([items]);
        setHasChanges(false);
    };

    const discard = () => {
        // Reset items list to the last save state.
        todoListSocket.current.send(JSON.stringify({ task: 'load', user: props.user }));
        const initialItemsState = history[0];
        setItems(initialItemsState);
        updateHistory([history[0]]);
        setHasChanges(false);
    };

    useEffect(() => {
        // Save button sends message to the backend and 
        // here comes the confirmation response.
        todoListSocket.current.onmessage = (e) => {
            alert("Saved");
        };
    }, []);

    // Filter the items based on the current filter status.
    const filteredItems = filter === 'all' ? items : items.filter((item) => item.status === (filter === 'done'));

    return (
        <div>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            {filteredItems.map((item, index) => (
                                <TodoItem
                                    key={item.id}
                                    id={item.id}
                                    index={index}
                                    new_content={item.content}
                                    new_status={item.status}
                                    updateItem={onItemChange}
                                    removeItem={removeItem}
                                />
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <div className="list-menu">
                <button id="add-btn" className="menu btn" onClick={addItem}> New </button>
                <button id="save-btn" className="menu btn" onClick={save} disabled={!hasChanges}> Save </button>
                {/*<button id="discard-btn" className="menu btn" onClick={discard} disabled={!hasChanges}> Discard </button>*/}
                <button id="undo-btn" className="menu btn" onClick={undo} disabled={!hasChanges}> Undo </button>
                <select value={filter} onChange={handleFilterChange}>
                    <option value="all">All</option>
                    <option value="done">Done</option>
                    <option value="undone">Undone</option>
                </select>
            </div>
        </div>
    );
}


const user = document.currentScript.getAttribute('user_id');
const items = JSON.parse(document.currentScript.getAttribute('items'));

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<TodoList user={user} items={items}/>)
