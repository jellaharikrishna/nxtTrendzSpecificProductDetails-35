import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'

import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productItemDetails: {},
    similarProductsList: [],
    apiStatus: apiStatusConstants.initial,
    quanity: 1,
    errorMsg: '',
  }

  componentDidMount() {
    this.getProductItem()
  }

  getProductItem = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = {
        imageUrl: data.image_url,
        title: data.title,
        price: data.price,
        rating: data.rating,
        totalReviews: data.total_reviews,
        description: data.description,
        availability: data.availability,
        brand: data.brand,
      }
      const updatedSimilarProducts = data.similar_products.map(eachItem => ({
        id: eachItem.id,
        imageUrl: eachItem.image_url,
        title: eachItem.title,
        brand: eachItem.brand,
        price: eachItem.price,
        rating: eachItem.rating,
      }))
      this.setState({
        productItemDetails: updatedData,
        similarProductsList: updatedSimilarProducts,
        apiStatus: apiStatusConstants.success,
      })
    } else if (response.status === 404) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
        errorMsg: 'Product Not Found',
      })
    }
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="product-item-details-loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  onClickMinusBtn = () => {
    const {quanity} = this.state
    if (quanity > 1) {
      this.setState(prevState => ({
        quanity: prevState.quanity - 1,
      }))
    }
  }

  onClickPlusBtn = () => {
    this.setState(prevState => ({
      quanity: prevState.quanity + 1,
    }))
  }

  renderProductItemDetails = () => {
    const {productItemDetails, quanity, similarProductsList} = this.state
    const {
      imageUrl,
      title,
      price,
      rating,
      totalReviews,
      description,
      availability,
      brand,
    } = productItemDetails

    return (
      <>
        <div className="product-item-details-container">
          <img
            className="product-item-details-image"
            src={imageUrl}
            alt="product"
          />
          <div className="product-item-details-contant">
            <h1 className="product-item-details-title">{title}</h1>
            <p className="product-item-details-price">Rs {price}/-</p>

            <div className="product-item-details-rating-container">
              <div className="product-item-details-rating-card">
                <p className="product-item-details-rating">{rating}</p>
                <img
                  className="product-item-details-rating-star-icon"
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                />
              </div>

              <p className="product-item-details-totalreviews">
                {totalReviews} Reviews
              </p>
            </div>

            <p className="product-item-details-description">{description}</p>
            <p className="product-item-details-available">
              <span className="product-item-details-available-span">
                Available:
              </span>
              {availability}
            </p>
            <p className="product-item-details-brand">
              <span className="product-item-details-brand-span">Brand:</span>
              {brand}
            </p>
            <hr className="product-item-details-hr-line" />
            <div className="product-item-details-minus-plus-container">
              <button
                className="product-item-details-minus-plus-btn"
                type="button"
                data-testid="minus"
                onClick={this.onClickMinusBtn}
              >
                <BsDashSquare className="product-item-details-minus-plus-icon" />
                <p className="display-none">1</p>
              </button>
              <p className="product-item-details-quanity">{quanity}</p>
              <button
                className="product-item-details-minus-plus-btn"
                type="button"
                data-testid="plus"
                onClick={this.onClickPlusBtn}
              >
                <BsPlusSquare className="product-item-details-minus-plus-icon" />
                <p className="display-none">1</p>
              </button>
            </div>

            <button
              className="product-item-details-add-to-cart-btn"
              type="button"
            >
              ADD TO CART
            </button>
          </div>
        </div>

        <div className="similar-products-container">
          <h1 className="similar-products-heading">Similar Products</h1>
          <ul className="similar-products-list-container">
            {similarProductsList.map(eachItem => (
              <SimilarProductItem
                key={eachItem.id}
                similarProductsDetails={eachItem}
              />
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderProductItemFailureView = () => {
    const {errorMsg} = this.state
    return (
      <div className="product-item-failure-view-container">
        <img
          className="product-item-failure-view-image"
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="failure view"
        />
        <h1 className="product-item-failure-view-heading">{errorMsg}</h1>
        <Link to="/products">
          <button
            type="button"
            className="product-item-failure-view-continue-shopping-btn"
          >
            Continue Shopping
          </button>
        </Link>
      </div>
    )
  }

  renderSwitchStatement = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderProductItemDetails()
      case apiStatusConstants.failure:
        return this.renderProductItemFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-item-details-app-container">
          {this.renderSwitchStatement()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails
