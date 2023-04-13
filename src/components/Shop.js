import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

import { db } from '../firebase';

import ItemCard from './ItemCard';
import '../styles/shop.css';

const getImageUrl = async (directory, filename) => {
  let imgUrl;
  try {
    imgUrl = await getDownloadURL(ref(getStorage(), `${directory}/${filename}.jpg`));
  } catch (error) {
    imgUrl = await getDownloadURL(ref(getStorage(), `${directory}/${filename}.png`));
  }
  return imgUrl;
}

const getAllImageUrls = async (category,fetchedInventory) => {
  for (const item of fetchedInventory) {
    item.data.imgUrl = await getImageUrl(category, item.data.name)
  }
  return fetchedInventory;
}

const fetchInventory = async (category) => {
  const querySnapShot = await getDocs(collection(db, category));
  let fetchedInventory = []
  querySnapShot.forEach((doc) => {
    fetchedInventory.push({ docID: doc.id, data: { ...doc.data() } })
  })
  fetchedInventory = await getAllImageUrls(category,fetchedInventory);
  return { fetchedInventory, fetchedCategory: category };
}

const Shop = (props) => {
  const { addToCart, removeFromCart, clearCart, cartHasCleared } = props;

  const [state, setState] = useState({ isFetching: true, category: null, inventory: [] });

  const highlightCategoryOnSidebar = () => {
    console.log("state - category: ", state.category);
    setState({ ...state, isFetching: true });
    document.querySelectorAll('.shop .sidebar li').forEach((elem) => {
      elem.classList.remove('highlight');
    })
    document.querySelector(`li.${props.category}`).classList.add('highlight');
  }

  useEffect(() => {
    document.querySelector('.navbar a[href="/shop"]').style.color = "#0ea5e9";
    return () => {
      document.querySelector('.navbar a[href="/shop"]').style.color = "white";
    }
  }, [])

  useEffect(() => {
    highlightCategoryOnSidebar();
    (async () => {
      const { fetchedInventory, fetchedCategory } = await fetchInventory(props.category);
      if (fetchedCategory === props.category) {
        setState({ isFetching: false, category: props.category, inventory: fetchedInventory });
      }
    })();
  }, [props.category])

  return (
    <div className="shop">
      <div className="sidebar">
        <ul>
          <li className="fruits">
            <Link to={"/shop"}>Fruits</Link>
          </li>
          <li className="vegetables">
            <Link to={"/shop/vegetables"}>Vegetables</Link>
          </li>
          <li className="dairy">
            <Link to={"/shop/dairy"}>Dairy</Link>
          </li>
        </ul>
        <button className='clear-cart' onClick={clearCart}>
          Clear Cart
        </button>
      </div>
      <div className="main-content">
        {state.isFetching ?
          "Fetching inventory..."
          :
          state.inventory.map((item) => {
            return (
              <ItemCard
                item={item}
                category={props.category}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                quantity={props.cart[item.docID] ? props.cart[item.docID].quantity : 0}
                cartHasCleared={cartHasCleared}
                key={item.docID}
              />
            )
          })
        }
      </div>
    </div>
  )
}

export default Shop;