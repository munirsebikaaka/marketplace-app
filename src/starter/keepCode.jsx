/*

:root {
  --primary-color: #2c3e50;

  --secondary-color: #3498db;

  --accent-color: #e74c3c;

  --white: #ffffff;
  --light-gray: #f5f5f5;
  --medium-gray: #ecf0f1;
  --dark-gray: #bdc3c7;
  --text-color: #333333;

  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-xxl: 48px;

  --font-size-sm: 0.875rem;

  --font-size-md: 1rem;

  --font-size-lg: 1.25rem;

  --font-size-xl: 1.5rem;

  --font-size-xxl: 2rem;

  --line-height-sm: 1.25;
  --line-height-md: 1.5;

  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;

  --border-width: 1px;
  --border-color: var(--dark-gray);

  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);


  --transition-fast: 0.15s ease;
  --transition-medium: 0.3s ease;
  --transition-slow: 0.5s ease;
}

body {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: var(--line-height-md);
  color: var(--text-color);
  background-color: var(--light-gray);
}

h1,
h2,
h3,
h4,
h5,
h6 {
  line-height: var(--line-height-sm);
  margin-bottom: var(--space-md);
  color: var(--primary-color);
}

h1 {
  font-size: var(--font-size-xxl);
}
h2 {
  font-size: var(--font-size-xl);
}
h3 {
  font-size: var(--font-size-lg);
}
h4 {
  font-size: var(--font-size-md);
}

p {
  margin-bottom: var(--space-md);
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-md);
}

.section {
  padding: var(--space-xl) 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-sm) var(--space-md);
  border: var(--border-width) solid transparent;
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-md);
  font-weight: 500;
  line-height: 1;
  text-decoration: none;
  cursor: pointer;
  transition: var(--transition-fast);
}

.btn--primary {
  background-color: var(--secondary-color);
  color: var(--white);
}

.btn--primary:hover {
  background-color: #2980b9;
}

.btn--secondary {
  background-color: var(--medium-gray);
  color: var(--text-color);
  border-color: var(--border-color);
}

.btn--secondary:hover {
  background-color: var(--dark-gray);
}

.btn--accent {
  background-color: var(--accent-color);
  color: var(--white);
}

.btn--accent:hover {
  background-color: #c0392b;
}

.btn--outline {
  background-color: transparent;
  border-color: var(--secondary-color);
  color: var(--secondary-color);
}

.btn--outline:hover {
  background-color: rgba(52, 152, 219, 0.1);
}

.btn--sm {
  padding: var(--space-xs) var(--space-sm);
  font-size: var(--font-size-sm);
}

.btn--lg {
  padding: var(--space-md) var(--space-lg);
  font-size: var(--font-size-lg);
}

.form-group {
  margin-bottom: var(--space-lg);
}

.form-label {
  display: block;
  margin-bottom: var(--space-sm);
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  border: var(--border-width) solid var(--border-color);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-md);
  transition: var(--transition-fast);
}

.form-control:focus {
  outline: none;
  border-color: var(--secondary-color);
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

textarea.form-control {
  min-height: 100px;
  resize: vertical;
}

.card {
  background-color: var(--white);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: var(--transition-medium);
}

.card:hover {
  box-shadow: var(--shadow-md);
}

.card__header {
  padding: var(--space-md);
  border-bottom: var(--border-width) solid var(--medium-gray);
}

.card__body {
  padding: var(--space-md);
}

.card__footer {
  padding: var(--space-md);
  border-top: var(--border-width) solid var(--medium-gray);
}

.alert {
  padding: var(--space-md);
  border-radius: var(--border-radius-sm);
  margin-bottom: var(--space-lg);
}

.alert--success {
  background-color: rgba(46, 204, 113, 0.1);
  border-left: 4px solid #2ecc71;
  color: #27ae60;
}

.alert--error {
  background-color: rgba(231, 76, 60, 0.1);
  border-left: 4px solid var(--accent-color);
  color: var(--accent-color);
}

.navbar {
  background-color: var(--primary-color);
  color: var(--white);
  padding: var(--space-md) 0;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar__container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar__brand {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--white);
  text-decoration: none;
}

.navbar__links {
  display: flex;
  gap: var(--space-lg);
  align-items: center;
}

.navbar__link {
  color: var(--white);
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition-fast);
  padding: var(--space-xs) 0;
  position: relative;
}

.navbar__link:hover {
  opacity: 0.9;
}

.navbar__link--active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--white);
}

.badge {
  display: inline-block;
  padding: var(--space-xs) var(--space-sm);
  font-size: var(--font-size-sm);
  font-weight: 600;
  line-height: 1;
  border-radius: 20px;
}

.badge--primary {
  background-color: var(--secondary-color);
  color: var(--white);
}

.badge--accent {
  background-color: var(--accent-color);
  color: var(--white);
}

.grid {
  display: grid;
  gap: var(--space-lg);
}

.grid--2 {
  grid-template-columns: repeat(2, 1fr);
}

.grid--3 {
  grid-template-columns: repeat(3, 1fr);
}

.grid--4 {
  grid-template-columns: repeat(4, 1fr);
}

@media (max-width: 768px) {
  .grid--2,
  .grid--3,
  .grid--4 {
    grid-template-columns: 1fr;
  }
}

.text-center {
  text-align: center;
}

.mt-sm {
  margin-top: var(--space-sm);
}
.mt-md {
  margin-top: var(--space-md);
}
.mt-lg {
  margin-top: var(--space-lg);
}
.mt-xl {
  margin-top: var(--space-xl);
}

.mb-sm {
  margin-bottom: var(--space-sm);
}
.mb-md {
  margin-bottom: var(--space-md);
}
.mb-lg {
  margin-bottom: var(--space-lg);
}
.mb-xl {
  margin-bottom: var(--space-xl);
}

.product-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.product-card__image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-card__title {
  font-size: var(--font-size-lg);
  margin-bottom: var(--space-sm);
}

.product-card__price {
  font-size: var(--font-size-md);
  font-weight: 700;
  color: var(--secondary-color);
  margin-bottom: var(--space-md);
}

.product-card__footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: var(--space-md) 0;
  border-bottom: var(--border-width) solid var(--medium-gray);
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item__image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: var(--border-radius-sm);
  margin-right: var(--space-md);
}

.cart-item__details {
  flex: 1;
}

.cart-item__title {
  font-weight: 600;
  margin-bottom: var(--space-xs);
}

.cart-item__price {
  color: var(--secondary-color);
  font-weight: 600;
}

.cart-item__quantity {
  display: flex;
  align-items: center;
  margin: 0 var(--space-md);
}

.cart-item__quantity-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--medium-gray);
  border: none;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  font-size: var(--font-size-md);
}

.cart-item__quantity-value {
  margin: 0 var(--space-sm);
  min-width: 20px;
  text-align: center;
}

.checkout-summary {
  padding: var(--space-lg);
}

.checkout-summary__title {
  margin-bottom: var(--space-lg);
}

.checkout-summary__row {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-md);
  border-bottom: var(--border-width) solid var(--medium-gray);
}

.checkout-summary__total {
  font-weight: 700;
  font-size: var(--font-size-lg);
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .navbar__container {
    flex-direction: column;
    gap: var(--space-md);
  }

  .navbar__links {
    width: 100%;
    justify-content: space-between;
    gap: var(--space-md);
  }

  .section {
    padding: var(--space-lg) 0;
  }
}


*/
