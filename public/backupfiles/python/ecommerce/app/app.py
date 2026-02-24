from flask import Flask, render_template, redirect, url_for, request, session, flash
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
import json
import os

app = Flask(__name__)
app.secret_key = 'supersecretkey'
login_manager = LoginManager()
login_manager.init_app(app)

# Dummy user store
users = {'user@example.com': {'password': 'password', 'dark_mode': False}}

class User(UserMixin):
    def __init__(self, email):
        self.id = email
        self.email = email
        self.dark_mode = users[email].get('dark_mode', False)

@login_manager.user_loader
def load_user(user_id):
    if user_id in users:
        return User(user_id)
    return None

# Helper to get cart products
def get_cart_products():
    cart = session.get('cart', [])
    return [p for p in products if p['id'] in cart]

@app.route('/add_to_cart/<int:product_id>', methods=['POST'])
def add_to_cart(product_id):
    cart = session.get('cart', [])
    if product_id not in cart:
        cart.append(product_id)
    session['cart'] = cart
    return redirect(url_for('cart'))

@app.route('/cart')
def cart():
    cart_products = get_cart_products()
    return render_template('cart.html', cart_products=cart_products)

@app.route('/add_product', methods=['GET', 'POST'])
@login_required
def add_product():
    if request.method == 'POST':
        name = request.form.get('name')
        price = float(request.form.get('price'))
        description = request.form.get('description')
        image = request.form.get('image')
        new_id = max([p['id'] for p in products]) + 1 if products else 0
        products.append({
            'id': new_id,
            'name': name,
            'price': price,
            'description': description,
            'image': image
        })
        flash('Product added!')
        return redirect(url_for('home'))
    return render_template('add_product.html')

@app.route('/checkout', methods=['GET', 'POST'])
@login_required
def checkout():
    if request.method == 'POST':
        address = request.form.get('address')
        # For demo, just flash a message
        flash(f'Order placed! Shipping to: {address}')
        return redirect(url_for('checkout'))
    return render_template('checkout.html')

# Product data
def load_products():
    json_path = os.path.join(os.path.dirname(__file__), 'product.json')
    with open(json_path, 'r', encoding='utf-8') as f:
        return json.load(f)

products = load_products()

@app.route('/')
def home():
    return render_template('home.html', products=products)

@app.route('/product/<int:product_id>')
def product_detail(product_id):
    product = next((p for p in products if p['id'] == product_id), None)
    if not product:
        return "Product not found", 404
    return render_template('product_detail.html', product=product)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        if email in users and users[email]['password'] == password:
            user = User(email)
            login_user(user)
            return redirect(url_for('home'))
        return render_template('login.html', error='Invalid credentials')
    return render_template('login.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        if email in users:
            return render_template('signup.html', error='User already exists')
        users[email] = {'password': password, 'dark_mode': False}
        user = User(email)
        login_user(user)
        return redirect(url_for('home'))
    return render_template('signup.html')

@app.route('/profile', methods=['GET', 'POST'])
@login_required
def profile():
    if request.method == 'POST':
        # Toggle dark mode
        users[current_user.email]['dark_mode'] = not users[current_user.email]['dark_mode']
        current_user.dark_mode = users[current_user.email]['dark_mode']
    return render_template('profile.html', dark_mode=current_user.dark_mode)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        email = request.form.get('email')
        message = request.form.get('message')
        # For demo, just flash a message
        flash(f'Thank you for contacting us, {email}!')
        return redirect(url_for('contact'))
    return render_template('contact.html')

@app.route('/buy_now/<int:product_id>', methods=['GET', 'POST'])
def buy_now(product_id):
    product = next((p for p in products if p['id'] == product_id), None)
    if not product:
        return "Product not found", 404
    if request.method == 'POST':
        # For demo, just show the same page again
        address = request.form.get('address')
        payment = request.form.get('payment')
        flash(f'Order placed for {product["name"]}!')
        return redirect(url_for('buy_now', product_id=product_id))
    return render_template('buy_now.html', product=product)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
