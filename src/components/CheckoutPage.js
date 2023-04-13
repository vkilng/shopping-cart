import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

import { db } from "../firebase";

import CartItemCard from "./CartItemCard";
import "../styles/checkout.css";

const fetchDocData = async (category, docID) => {
    const docRef = doc(db, category, docID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        alert('cart item does not exist in inventory, please try again later');
    }
}

const getImageUrl = async (directory, filename) => {
    let imgUrl;
    try {
        imgUrl = await getDownloadURL(ref(getStorage(), `${directory}/${filename}.jpg`));
    } catch (error) {
        imgUrl = await getDownloadURL(ref(getStorage(), `${directory}/${filename}.png`));
    }
    return imgUrl;
}

const getAllImageUrls = async (cartList) => {
    for (const cartItem of cartList) {
        cartItem.imgUrl = await getImageUrl(cartItem.category, cartItem.name);
    }
    return cartList;
}

const CheckoutPage = (props) => {
    const { cart, addToCart, removeFromCart } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [cartItemsList, setCartItemsList] = useState([]);
    const [accounts, setAccounts] = useState({ subTotal: null, taxes: null, deliveryFee: null, grandTotal: null });


    const convertCartToList = async () => {
        setIsLoading(true);
        let dummyCartItemsList = [];
        for (const docID in cart) {
            dummyCartItemsList.push({ docID, ...cart[docID] });
        }
        let anotherDummyCartItemsList = [];
        for (let cartItem of dummyCartItemsList) {
            const docData = await fetchDocData(cartItem.category, cartItem.docID);
            anotherDummyCartItemsList.push({ ...cartItem, ...docData });
        }
        anotherDummyCartItemsList = await getAllImageUrls(anotherDummyCartItemsList);
        setCartItemsList(anotherDummyCartItemsList);
        setIsLoading(false);
    }

    const condenseAccounts = () => {
        let dummySubTotal = 0;
        cartItemsList.forEach((cartItem) => {
            dummySubTotal += cartItem.quantity * cartItem.price;
        })
        if (dummySubTotal === 0) {
            setAccounts({
                subTotal: null,
                taxes: null,
                deliveryFee: null,
                grandTotal: null
            })
        } else {
            let dummyTaxes = dummySubTotal * 0.08;
            let dummyGrandTotal = dummySubTotal + dummyTaxes;
            setAccounts({
                subTotal: dummySubTotal,
                taxes: dummyTaxes,
                deliveryFee: 3,
                grandTotal: dummyGrandTotal
            })
        }
    }

    useEffect(() => {
        document.querySelector('.navbar a[href="/checkout"]').style.color = "#0ea5e9";
        return () => {
            document.querySelector('.navbar a[href="/checkout"]').style.color = "white";
        }
    }, [])

    useEffect(() => {
        (async () => { await convertCartToList() })();
    }, [cart])

    useEffect(() => {
        condenseAccounts();
    }, [cartItemsList])

    return (
        <div className="checkout-page">
            <div className="main-content">
                <div className="header">Your Cart</div>
                {isLoading ? 'Refreshing Cart ...'
                    :
                    cartItemsList.map((cartItem) => {
                        return (
                            <CartItemCard
                                data={cartItem}
                                addToCart={addToCart}
                                removeFromCart={removeFromCart}
                                key={cartItem.docID}
                            />
                        )
                    })
                }
            </div>
            <div className="checkout">
                <div className="subtotal">
                    <div>Sub-Total</div>
                    $ {(Math.round(accounts.subTotal*100)/100).toFixed(2)}
                </div>
                <div className="taxes">
                    <div>Taxes</div>
                    $ {(Math.round(accounts.taxes*100)/100).toFixed(2)}
                </div>
                <div className="delivery-fee">
                    <div>Delivery Fee</div>
                    $ {accounts.deliveryFee}
                </div>
                <div className="grandtotal">
                    <div>Grand-Total</div>
                    $ {(Math.round(accounts.grandTotal*100)/100).toFixed(2)}
                </div>
                <button>CHECK OUT</button>
            </div>
        </div>
    )
}

export default CheckoutPage;