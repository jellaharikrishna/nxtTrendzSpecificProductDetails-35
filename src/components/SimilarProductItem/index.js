import './index.css'

const SimilarProductItem = props => {
  const {similarProductsDetails} = props
  const {title, brand, imageUrl, rating, price} = similarProductsDetails

  return (
    <li className="similar-product-item-container">
      <img
        src={imageUrl}
        alt="similar product"
        className="similar-product-item-image"
      />
      <h1 className="similar-product-item-title">{title}</h1>
      <p className="similar-product-item-brand">by {brand}</p>
      <div className="similar-product-item-price-rating-details">
        <p className="similar-product-item-price">Rs {price}/-</p>
        <div className="similar-product-item-rating-container">
          <p className="similar-product-item-rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="similar-product-item-star"
          />
        </div>
      </div>
    </li>
  )
}
export default SimilarProductItem
