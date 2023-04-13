import { useEffect, useState } from "react";

const ItemCard = (props) => {
    const { item, category, addToCart, removeFromCart, cartHasCleared } = props;
    const { docID, data } = item;

    const [count, setCount] = useState(props.quantity);

    useEffect(() => {
        if (cartHasCleared) {
            setCount(0);
        }
    }, [cartHasCleared])

    const incrementCount = () => {
        setCount(count + 1);
    }
    const decrementCount = () => {
        if (count > 0) setCount(count - 1);
    }


    const unselectedTemplate = (
        <div className="item-card">
            <div
                className='item-img'
                style={{ backgroundImage: `url('${data.imgUrl}')` }}
            ></div>
            <div className="item-description">{data.name}</div>
            <span className='item-cost'>$ {data.price}</span>
            <div className="item-counter">
                <i className='decrement material-symbols-outlined' onClick={() => {
                    removeFromCart(category, docID);
                    decrementCount();
                }}>
                    remove
                </i>
                |
                <div className="item-count">{count}</div>
                |
                <i className='increment material-symbols-outlined' onClick={() => {
                    addToCart(category, docID);
                    incrementCount();
                }}>
                    add
                </i>
            </div>
        </div>
    );

    const selectedTemplate = (
        <div className="item-card selected">
            <div
                className='item-img'
                style={{ backgroundImage: `url('${data.imgUrl}')` }}
            ></div>
            <div className="item-description">{data.name}</div>
            <span className='item-cost'>$ {data.price}</span>
            <div className="item-counter">
                <i className='decrement material-symbols-outlined' onClick={() => {
                    removeFromCart(category, docID);
                    decrementCount();
                }}>
                    remove
                </i>
                |
                <div className="item-count">{count}</div>
                |
                <i className='increment material-symbols-outlined' onClick={() => {
                    addToCart(category, docID);
                    incrementCount();
                }}>
                    add
                </i>
            </div>
        </div>
    );

    return (
        (count > 0) ? selectedTemplate : unselectedTemplate
    )
}

export default ItemCard;