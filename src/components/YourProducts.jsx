function YourProducts({ products = [], onEdit, onDelete }) {
  return (
    <section className="seller-products">
      <h3>Your Products</h3>
      <div className="products-grid">
        {Array.isArray(products) && products.length > 0 ? (
          products.map((p) => (
            <div key={p.id} className="product-card">
              <img
                src={p.image || "def.jpg"} // fallback image if none provided
                alt={p.name || "Product Image"}
                className="product-image"
              />
              <div className="seller-product-card">
                <h4 className="product-title">{p.name}</h4>
                <p className="product-description">{p.description}</p>
                <p className="product-price">
                  Price ${parseFloat(p.price).toFixed(2)}
                </p>

                <div className="product-actions">
                  <button
                    className="btn-action btn-edit"
                    onClick={() => onEdit(p)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-action btn-delete"
                    onClick={() => onDelete(p.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </section>
  );
}

export default YourProducts;
