import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import Home from "./components/Home";
import Shop from "./components/Shop";
import CheckoutPage from "./components/CheckoutPage";
import { db } from "./firebase";

const signInUser = async () => {
    await signInWithPopup(getAuth(), new GoogleAuthProvider());
}

const signOutUser = () => {
    signOut(getAuth());
    if (window.location.href !== '/') {
        window.location.href = '/';
    }
}

const signInChangesToDOM = (ppurl) => {
    document.querySelector('.signout-btn').style.display = 'inline-block';
    document.querySelector('.navbar a[href="/shop"]').style.display = 'inline-block';
    document.querySelector('.home .main-content a[href="/shop"]').style.display = 'inline-block';
    document.querySelector('.cart-count').style.display = 'block';
    document.querySelector('.home .main-content button').style.display = 'none';

    document.querySelector('.profile-pic i').style.display = 'none';
    document.querySelector('.profile-pic').style.backgroundImage = `url('${ppurl}')`;
}

const singoutChangesToDOM = () => {
    document.querySelector('.signout-btn').style.display = 'none';
    document.querySelector('.navbar a[href="/shop"]').style.display = 'none';
    document.querySelector('.home .main-content a[href="/shop"]').style.display = 'none';
    document.querySelector('.cart-count').style.display = 'none';
    document.querySelector('.home .main-content button').style.display = 'inline-block';

    document.querySelector('.profile-pic i').style.display = 'block';
}

const RouteSwitcher = () => {
    const [cart, setCart] = useState({});
    const [cartHasCleared, setCartHasCleared] = useState(false);
    const [cartCount, setCartCount] = useState(null);

    const initFirebaseAuth = () => {
        // Listen to auth state changes.
        onAuthStateChanged(getAuth(), async (user) => {
            if (user) {
                console.log('User is signed IN');
                try {
                    signInChangesToDOM(user.photoURL);
                } catch (error) {
                    alert(`You're signed in`);
                }
                await updateLocalCart();
            } else {
                // User is signed out
                console.log('User is signed Out');
                try {
                    singoutChangesToDOM();
                } catch (error) {
                    console.log(`You're signed out`);
                }
            }
        })
    }

    const addToCart = (category, docID) => {
        if (!cart[docID]) {
            setCart({ ...cart, [docID]: { category, quantity: 1 } })
        } else {
            setCart({ ...cart, [docID]: { category, quantity: (cart[docID].quantity + 1) } })
        }
    }

    const removeFromCart = (category, docID) => {
        if (cart[docID]) {
            if (cart[docID].quantity === 1) {
                const { [docID]: _, ...rest } = cart;
                setCart(rest);
            } else {
                setCart({ ...cart, [docID]: { category, quantity: (cart[docID].quantity - 1) } })
            }
        }
    }

    const clearCart = () => {
        setCart({});
        setCartHasCleared(true);
    }

    const updateCartCount = () => {
        let res = 0;
        for (const docID in cart) {
            res += cart[docID].quantity;
        }
        if (cartCount === null && res === 1) {
            setCartHasCleared(false);
        }
        if (res === 0) {
            setCartCount(null);
        } else {
            setCartCount(res);
        }
    }

    const updateOnlineCart = async () => {
        if (getAuth().currentUser) {
            const docRef = doc(db, "carts", getAuth().currentUser.uid);
            await setDoc(docRef, {
                cart: cart,
                timestamp: serverTimestamp()
            })
        }
    }

    const updateLocalCart = async () => {
        if (getAuth().currentUser) {
            const docRef = doc(db, "carts", getAuth().currentUser.uid);
            const docSnap = await getDoc(docRef);
            const { timestamp, ...rest } = docSnap.data();
            setCart(rest.cart);
        }
    }

    useEffect(() => {//On Mount
        initFirebaseAuth();
    }, [])

    useEffect(() => {
        updateOnlineCart();
        updateCartCount();
    }, [cart])

    return (
        <div>
            <BrowserRouter>
                <div className="navbar">
                    <Link to={"/"}>
                        <i className="material-symbols-outlined">nutrition</i>
                        &nbsp;Grocery Store
                    </Link>
                    <ul>
                        <li>
                            <div
                                className="signout-btn"
                                onClick={signOutUser}
                            >Sign Out</div>
                        </li>
                        <li>
                            <div className="profile-pic">
                                <i
                                    className="material-symbols-outlined"
                                    onClick={signInUser}
                                >account_circle</i>
                            </div>
                        </li>
                        <li>
                            <Link to={"/shop"}>Shop</Link>
                        </li>
                        <li>
                            <Link to={"/checkout"}>
                                <i className="material-symbols-outlined">shopping_cart</i>
                                <div className="cart-count">{cartCount}</div>
                            </Link>
                        </li>
                    </ul>
                </div>
                <Routes>
                    <Route path="/" element={
                        <Home
                            signInUser={signInUser}
                        />
                    } />
                    <Route path="/shop" element={
                        <Shop
                            category={"fruits"}
                            addToCart={addToCart}
                            removeFromCart={removeFromCart}
                            clearCart={clearCart}
                            cart={cart}
                            cartHasCleared={cartHasCleared}
                        />
                    } />
                    <Route path="/shop/vegetables" element={
                        <Shop
                            category={"vegetables"}
                            addToCart={addToCart}
                            removeFromCart={removeFromCart}
                            clearCart={clearCart}
                            cart={cart}
                            cartHasCleared={cartHasCleared}
                        />
                    } />
                    <Route path="/shop/dairy" element={
                        <Shop
                            category={"dairy"}
                            addToCart={addToCart}
                            removeFromCart={removeFromCart}
                            clearCart={clearCart}
                            cart={cart}
                            cartHasCleared={cartHasCleared}
                        />
                    } />
                    <Route path="/checkout" element={
                        <CheckoutPage
                            cart={cart}
                            addToCart={addToCart}
                            removeFromCart={removeFromCart}
                        />
                    } />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default RouteSwitcher;