import { useState } from "react";

const CartItemCard = (props) => {
    const { data, addToCart, removeFromCart } = props;

    const [count, setCount] = useState(data.quantity);

    const incrementCount = () => {
        setCount(count + 1);
    }
    const decrementCount = () => {
        if (count > 0) setCount(count - 1);
    }
    return (
        <div className="cart-item-card">
            <div className="left-end">
                <div
                    className='item-img'
                    style={{ backgroundImage: `url('${data.imgUrl}')` }}
                ></div>
                <div className="description">
                    <div className="item-description">{data.name}</div>
                    <span className='item-cost'>$ {data.price}</span>
                </div>
            </div>
            <div className="right-end">
                <div className="item-counter">
                    <i className='decrement material-symbols-outlined' onClick={() => {
                        removeFromCart(data.category, data.docID);
                        decrementCount();
                    }}>
                        remove
                    </i>
                    |
                    <div className="item-count">{count}</div>
                    |
                    <i className='increment material-symbols-outlined' onClick={() => {
                        addToCart(data.category, data.docID);
                        incrementCount();
                    }}>
                        add
                    </i>
                </div>
                <div className="items-cost">$ {count * data.price}</div>
            </div>
        </div>
    )
}

export default CartItemCard;