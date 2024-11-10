import './PP.css'

const PaperItem = ({ item }) => (
    <div className="item">
        <a href={item.link}>
            <h2>{item.heading}</h2>
            <p>{item.para}</p>
        </a>
        <div className={`badge ${item.badge}`}>
            {item.badge.charAt(0).toUpperCase() + item.badge.slice(1)}
        </div>
        <div className="papers-icon-container">
            <a className="link-button" href={item.link}>
                <i className="fas fa-file-alt"></i>
                <span className="hover-text">Access Papers</span>
            </a>
        </div>
        <div className="rating">
            <a className="rating-button" href={item.ratingLink}>
                <img className="rating-image" src="../assets/images/playbutton.webp" alt="YouTube Play Button" />
                <span className="rating-text">Playlist</span>
            </a>
        </div>
    </div>
);

export default PaperItem;