import React, {useState} from "react";
import { arrayMove, SortableContainer, SortableElement } from 'react-sortable-hoc';

const SortableItem = SortableElement(({value}: {value:string}) =>
    <li style={{listStyleType: "none", width: 85, cursor: "default"}} >{value}</li>
);

const SortableList = SortableContainer(({items}: {items: string[]}) => {
    return (
        <ul style={{listStyleType: "none", paddingInlineStart: 0}}>
            {items.map((value, index) => (
                <SortableItem value={value} index={index} key={`item-${index}`}/>
            ))}
        </ul>
    )
})

export const TestSortableList = () => {
    const [items, setItems] = useState({items: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6']});

    const onSortEnd = ({oldIndex, newIndex}: {oldIndex: number, newIndex: number}) => {
        setItems({
            items: arrayMove(items.items, oldIndex, newIndex)
        })
    }

    return (
        <div style={{padding: 20, background: "blue", color: "white", width: 85}}>
            <SortableList items={items.items} onSortEnd={onSortEnd} />
        </div>
    )
}