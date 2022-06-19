import React, { useState } from 'react'
import { client, urlFor } from '../../lib/client'
import { AiOutlineMinus, AiOutlinePlus, AiOutlineStar, AiFillStar } from 'react-icons/ai'
import { Product } from '../../components'
import { useStateContext } from '../../context/StateContext'

const ProductDetails = ({ product, products }) => {

  // para di na paulit-ulit na product.image, product.name etc
  const { image, name, details, price } = product
  const [index, setIndex] = useState(0)
  const { decQty, incQty, qty, onAdd, setShowCart } = useStateContext() // bale galing to sa context/StateContext.js

  const handleBuyNow = () => {
    onAdd(product, qty)

    setShowCart(true)
  }

  return (
    <div>
        <div className="product-detail-container">
            <div>
                <div className="image-container">
                    <img src={urlFor(image && image[index])} className="product-detail-image" />
                </div>
                <div className="small-images-container">
                    {image?.map((item, i) => (
                        <img 
                            key={i}
                            src={urlFor(item)}
                            className={i === index ? 'small-image selected-image' : 'small-image'}
                            onMouseEnter={() => setIndex(i)}
                        />
                    ))}
                </div>
            </div>
            
            <div className="product-detail-desc">
                <h1>{name}</h1>
                <div className="reviews">
                    <div>
                        <AiFillStar />
                        <AiFillStar />
                        <AiFillStar />
                        <AiFillStar />
                        <AiFillStar />
                        <AiOutlineStar />
                    </div>
                    <p>(20)</p>
                </div>
                <h4>Details: </h4>
                <p>{details}</p>
                <p className="price">${price}</p>
                <div className='quantity'>
                    <h3>Quantity</h3>
                    <p className='quantity-desc'>
                        <span className='minus' onClick={decQty}><AiOutlineMinus /></span>
                        <span className='num'>{qty}</span>
                        <span className='plus' onClick={incQty}><AiOutlinePlus /></span>
                    </p>
                </div>
                <div className='buttons'>
                    <button type="button" className='add-to-cart' onClick={() => onAdd(product, qty)}>Add to Cart</button>
                    <button type="button" className='buy-now' onClick={handleBuyNow}>Buy Now</button>
                </div>
            </div>
        </div>

        <div className="maylike-products-wrapper">
            <h2>You may also like</h2>
            <div className='marquee'>
                <div className="maylike-products-container track">
                    {products.map((item) => (
                        <Product key={item._id} product={item} />
                    ))}
                </div>
            </div>
        </div>
    </div>
  )
}

// para san naman ang getStaticPaths?
// ginagamit to pag gumamit ka ng getStaticProps(), bale si nextJS need nya malaman ahead of time
// ano-ano ba yung mga paths na pwede mavisit ng user, o ano-ano ba yung mga path na navivisit
// sa pag gawa ng getStaticPaths sinasabi na neto sa nextJS yung mga path na pwede mavisit
// which is puro slug

export const getStaticPaths = async () => {
    // give me all the product but dont return all of the data 
    // from all of the product, just return the slug property
    const query = `*[_type == "products"] {
        slug {
            current 
        }
    }`

    // get slug data from the products
    const products = await client.fetch(query)
    
    // we just need to return an object slug
    const paths = products.map((product) => ({
        params: {
            slug: product.slug.current
        }
    }))

    return {
        paths,
        fallback: 'blocking'
    }
}

// ano pinagkaiba ng getServerSideProps sa getStaticProps
// getServerSideProps ito yung nagbibigay na agad ng data in built time
// getStaticProps ito yung nagbibigay ng data once na nirequest ni user

// bale bilang need nga natin ma access yung request ni user once na nagclick sya, diba nagreredirect sa ibang page? 
// need natin makuha yung path na yun, dito nagiging useful yung slug diba dynamic nga sya
// bale kung ano clinick ni user, yun yung slug natin localhost:3000/products/this_is_slug
// maa-access natin sya sa pamamagitan ng parameter

export const getStaticProps = async ({ params: { slug } }) => {
    const query = `*[_type == "product" && slug.current == '${slug}'][0]` // this is the individual product
    const productQuery = '*[_type == "product"]' // whole product
    
    const product = await client.fetch(query)
    const products = await client.fetch(productQuery)

    return {
        props: { product, products }
    }
}

export default ProductDetails