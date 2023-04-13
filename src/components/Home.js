import '../styles/home.css';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const Home = (props) => {
  useEffect(() => {
    document.querySelector('.navbar a[href="/"]').style.color = "#0ea5e9";
    return () => {
      document.querySelector('.navbar a[href="/"]').style.color = "white";
    }
  }, [])
  return (
    <div className="home">
      <div className="main-content">
        <div>This is a mock online grocery store</div>
        <article>A community marketplace and auction house for those legendary home grown veggies will be coming shortly.</article>
        <Link to={"/shop"}>Shop &#x21E8;</Link>
        <button onClick={props.signInUser}>Sign In</button>
      </div>
      <div className="review-section">
        Our customers have great things to say about us!
        <div>
          <div className="review-card">
            <div className='content'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin congue pulvinar molestie. Nunc sodales nibh quam, ultricies luctus odio mollis cursus. Quisque iaculis non velit sagittis egestas.</div>
            <div className='author'>- Nella</div>
          </div>
          <div className="review-card">
            <div className='content'>Phasellus vulputate mattis dolor vel iaculis. Integer gravida elementum purus imperdiet laoreet. Suspendisse luctus massa euismod leo suscipit maximus. Vestibulum non justo at dolor feugiat mollis. Morbi eget diam iaculis, imperdiet tellus sit amet, ornare metus.</div>
            <div className='author'>- Dorus</div>
          </div>
          <div className="review-card">
            <div className='content'>Vestibulum finibus blandit elit, non dapibus eros sodales sed. Suspendisse molestie porttitor velit, ut posuere ligula molestie ut. Suspendisse ullamcorper sem in ante dictum, ut mattis massa cursus. In luctus sapien a cursus aliquet. Proin ac justo ipsum.</div>
            <div className='author'>- Mauris</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;