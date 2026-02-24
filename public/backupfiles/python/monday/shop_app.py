#!/usr/bin/env python3
"""
Online Shop Application with Authentication
A Flask-based e-commerce system with user login and product purchasing
"""

from flask import Flask, render_template, request, redirect, url_for, session, flash
from datetime import datetime, timedelta
import json
import os
from threading import Lock
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key = 'shop-secret-key-change-in-production'  # Change this in production!

# File upload configuration
UPLOAD_FOLDER = 'static/images/products'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# File lock for thread-safe JSON operations
data_lock = Lock()
DATA_FILE = 'data.json'

def load_data():
    """Load data from JSON file"""
    if not os.path.exists(DATA_FILE):
        # Create default data if file doesn't exist
        default_data = {
            "users": {
                "john": {"password": "1234", "balance": 100, "locked": False, "locked_time": None},
                "admin": {"password": "admin123", "balance": 1000, "locked": False, "locked_time": None, "is_admin": True}
            },
            "products": {
                "1": {"name": "Book", "price": 20, "stock": 50, "category": "Education", "description": "Programming fundamentals book", "image": "default-product.svg"},
                "2": {"name": "Headphones", "price": 50, "stock": 25, "category": "Electronics", "description": "Wireless Bluetooth headphones", "image": "default-product.svg"},
                "3": {"name": "Laptop", "price": 2000, "stock": 5, "category": "Electronics", "description": "High-performance laptop", "image": "default-product.svg"},
                "4": {"name": "Phone", "price": 1200, "stock": 10, "category": "Electronics", "description": "Latest smartphone", "image": "default-product.svg"},
                "5": {"name": "Smart TV", "price": 1500, "stock": 8, "category": "Electronics", "description": "4K Smart TV with streaming", "image": "default-product.svg"},
                "6": {"name": "Microwave", "price": 500, "stock": 15, "category": "Appliances", "description": "Digital microwave oven", "image": "default-product.svg"}
            }
        }
        save_data(default_data)
        return default_data
    
    try:
        with open(DATA_FILE, 'r') as f:
            data = json.load(f)
            # Convert product keys to integers for compatibility
            if 'products' in data:
                products = {}
                for k, v in data['products'].items():
                    # Ensure backward compatibility - add image field if missing
                    if 'image' not in v:
                        v['image'] = 'default-product.svg'
                    products[int(k)] = v
                data['products'] = products
            return data
    except (json.JSONDecodeError, FileNotFoundError):
        # Return default data if file is corrupted
        return load_data()

def save_data(data):
    """Save data to JSON file"""
    with data_lock:
        try:
            # Convert product keys to strings for JSON serialization
            data_to_save = data.copy()
            if 'products' in data_to_save:
                data_to_save['products'] = {str(k): v for k, v in data_to_save['products'].items()}
            
            with open(DATA_FILE, 'w') as f:
                json.dump(data_to_save, f, indent=2)
        except Exception as e:
            print(f"Error saving data: {e}")

def get_users():
    """Get users from data file"""
    data = load_data()
    return data.get('users', {})

def get_products():
    """Get products from data file"""
    data = load_data()
    return data.get('products', {})

def update_user(username, user_data):
    """Update a user in the data file"""
    data = load_data()
    if 'users' not in data:
        data['users'] = {}
    data['users'][username] = user_data
    save_data(data)

def update_product(product_id, product_data):
    """Update a product in the data file"""
    data = load_data()
    if 'products' not in data:
        data['products'] = {}
    data['products'][int(product_id)] = product_data
    save_data(data)

def delete_product(product_id):
    """Delete a product from the data file"""
    data = load_data()
    if 'products' in data and int(product_id) in data['products']:
        del data['products'][int(product_id)]
        save_data(data)

def add_new_product(product_data):
    """Add a new product to the data file"""
    data = load_data()
    if 'products' not in data:
        data['products'] = {}
    
    # Find next available product ID
    max_id = max([int(k) for k in data['products'].keys()]) if data['products'] else 0
    new_id = max_id + 1
    
    data['products'][new_id] = product_data
    save_data(data)
    return new_id

def is_account_auto_unlockable(user):
    """Check if account can be auto-unlocked after 30 seconds"""
    if not user.get("locked") or not user.get("locked_time"):
        return False
    
    locked_time = datetime.fromisoformat(user["locked_time"])
    unlock_time = locked_time + timedelta(seconds=30)  # Auto unlock after 30 seconds
    return datetime.now() >= unlock_time

def auto_unlock_account(username):
    """Auto unlock account if enough time has passed"""
    users = get_users()
    user = users.get(username)
    if user and is_account_auto_unlockable(user):
        user["locked"] = False
        user["locked_time"] = None
        update_user(username, user)
        return True
    return False

def is_admin(username):
    """Check if user is an admin"""
    users = get_users()
    user = users.get(username)
    return user and user.get("is_admin", False)

def require_shop_login(f):
    """Decorator to require login for protected shop routes."""
    def decorated_function(*args, **kwargs):
        if 'shop_username' not in session:
            return redirect(url_for('shop_login'))
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

@app.route('/shop')
def shop_index():
    """Redirect to shop login or shop page based on session."""
    if 'shop_username' in session:
        return redirect(url_for('shop_main'))
    return redirect(url_for('shop_login'))

@app.route('/shop_login', methods=['GET', 'POST'])
def shop_login():
    """Handle shop user login."""
    if request.method == 'POST':
        username = request.form['username'].strip()
        password = request.form['password']
        
        if not username or not password:
            return render_template('shop_login.html', error='Please enter both username and password.')
        
        users = get_users()
        user = users.get(username)
        if not user:
            return render_template('shop_login.html', error='User not found.')
        
        # Check for auto-unlock
        if user["locked"] and auto_unlock_account(username):
            flash('Your account has been automatically unlocked!', 'success')
            users = get_users()  # Refresh users data
            user = users.get(username)
        
        if user["locked"]:
            locked_time = user.get("locked_time")
            if locked_time:
                locked_datetime = datetime.fromisoformat(locked_time)
                unlock_time = locked_datetime + timedelta(seconds=30)
                remaining_time = unlock_time - datetime.now()
                if remaining_time.total_seconds() > 0:
                    seconds = int(remaining_time.total_seconds())
                    error_msg = f'Account locked. Auto-unlock in {seconds} seconds.'
                else:
                    error_msg = 'Account locked. Please try again.'
            else:
                error_msg = 'Account locked due to incorrect password attempts.'
            
            return render_template('shop_login.html', 
                                 error=error_msg,
                                 locked=True,
                                 username=username)
        
        if user["password"] != password:
            user["locked"] = True
            user["locked_time"] = datetime.now().isoformat()
            update_user(username, user)
            return render_template('shop_login.html', 
                                 error='Incorrect password. Account has been locked for 30 seconds.',
                                 locked=True,
                                 username=username)
        
        # Successful login
        session['shop_username'] = username
        session['shop_login_time'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        return redirect(url_for('shop_main'))
    
    return render_template('shop_login.html')

@app.route('/shop_logout')
def shop_logout():
    """Handle shop user logout."""
    session.pop('shop_username', None)
    session.pop('shop_login_time', None)
    return redirect(url_for('shop_login'))

@app.route('/shop_main')
@require_shop_login
def shop_main():
    """Main shop page displaying products."""
    username = session['shop_username']
    users = get_users()
    products = get_products()
    user = users[username]
    
    return render_template('shop.html',
                         username=username,
                         balance=user['balance'],
                         products=products)

@app.route('/buy_product', methods=['POST'])
@require_shop_login
def buy_product():
    """Handle product purchase with stock management."""
    username = session['shop_username']
    users = get_users()
    products = get_products()
    user = users[username]
    
    try:
        product_id = int(request.form['product_id'])
    except (ValueError, KeyError):
        return render_template('shop.html',
                             username=username,
                             balance=user['balance'],
                             products=products,
                             error='Invalid product ID.')
    
    product = products.get(product_id)
    if not product:
        return render_template('shop.html',
                             username=username,
                             balance=user['balance'],
                             products=products,
                             error='Product not found.')
    
    # Check if product is in stock
    if product['stock'] <= 0:
        return render_template('shop.html',
                             username=username,
                             balance=user['balance'],
                             products=products,
                             error=f'Sorry, "{product["name"]}" is currently out of stock.')
    
    if user['balance'] < product['price']:
        return render_template('shop.html',
                             username=username,
                             balance=user['balance'],
                             products=products,
                             error=f'Not enough money to buy {product["name"]}. You need ${product["price"]} but only have ${user["balance"]}.',
                             show_add_money=True)
    
    # Process purchase and reduce stock
    user['balance'] -= product['price']
    product['stock'] -= 1
    
    # Save changes to data file
    update_user(username, user)
    update_product(product_id, product)
    
    # Refresh data for template
    users = get_users()
    products = get_products()
    
    return render_template('shop.html',
                         username=username,
                         balance=users[username]['balance'],
                         products=products,
                         success=f'Successfully purchased {product["name"]} for ${product["price"]}! New balance: ${users[username]["balance"]}. Items left: {products[product_id]["stock"]}')

@app.route('/add_money', methods=['GET', 'POST'])
@require_shop_login
def add_money():
    """Handle adding money to user balance."""
    username = session['shop_username']
    users = get_users()
    user = users[username]
    
    if request.method == 'GET':
        return render_template('add_money.html',
                             username=username,
                             balance=user['balance'])
    
    try:
        amount = float(request.form['amount'])
        if amount <= 0:
            raise ValueError("Amount must be positive")
        if amount > 10000:  # Maximum deposit limit
            raise ValueError("Amount exceeds maximum deposit limit of $10,000")
    except (ValueError, KeyError) as e:
        error_msg = str(e) if "Amount" in str(e) else "Please enter a valid positive amount."
        return render_template('add_money.html',
                             username=username,
                             balance=user['balance'],
                             error=error_msg)
    
    user['balance'] += amount
    
    # Save changes to data file
    update_user(username, user)
    
    # Refresh data for template
    users = get_users()
    products = get_products()
    
    # If coming from shop page with insufficient funds, redirect back to shop
    if request.form.get('redirect_to_shop'):
        return render_template('shop.html',
                             username=username,
                             balance=users[username]['balance'],
                             products=products,
                             success=f'Successfully added ${amount:.2f} to your account! New balance: ${users[username]["balance"]:.2f}')
    
    return render_template('add_money.html',
                         username=username,
                         balance=users[username]['balance'],
                         success=f'Successfully added ${amount:.2f} to your account! New balance: ${users[username]["balance"]:.2f}')

@app.route('/admin')
@require_shop_login
def admin_panel():
    """Admin panel for managing users and products."""
    username = session['shop_username']
    if not is_admin(username):
        users = get_users()
        products = get_products()
        return render_template('shop.html',
                             username=username,
                             balance=users[username]['balance'],
                             products=products,
                             error='Access denied. Admin privileges required.')
    
    users = get_users()
    products = get_products()
    return render_template('admin_panel.html',
                         username=username,
                         users=users,
                         products=products)

@app.route('/product_management')
@require_shop_login
def product_management():
    """Product management page for admin users."""
    username = session['shop_username']
    if not is_admin(username):
        users = get_users()
        products = get_products()
        return render_template('shop.html',
                             username=username,
                             balance=users[username]['balance'],
                             products=products,
                             error='Access denied. Admin privileges required.')
    
    products = get_products()
    return render_template('product_management.html',
                         username=username,
                         products=products)

@app.route('/add_product', methods=['POST'])
@require_shop_login
def add_product():
    """Add a new product with image upload."""
    username = session['shop_username']
    if not is_admin(username):
        return redirect(url_for('shop_main'))
    
    try:
        name = request.form['name'].strip()
        price = float(request.form['price'])
        stock = int(request.form['stock'])
        category = request.form['category'].strip()
        description = request.form['description'].strip()
        
        if not name or price <= 0 or stock < 0:
            raise ValueError("Invalid input")
        
        # Handle image upload
        image_filename = 'default-product.svg'  # Default image
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename != '' and allowed_file(file.filename):
                # Create unique filename
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                filename = secure_filename(file.filename)
                name_part = secure_filename(name.lower().replace(' ', '_'))
                unique_filename = f"{name_part}_{timestamp}_{filename}"
                
                # Ensure upload directory exists
                os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
                
                # Save file
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
                file.save(filepath)
                image_filename = unique_filename
                flash(f'Image uploaded successfully!', 'success')
        
        # Add new product using the helper function
        new_product = {
            "name": name,
            "price": price,
            "stock": stock,
            "category": category,
            "description": description,
            "image": image_filename
        }
        
        new_id = add_new_product(new_product)
        flash(f'Product "{name}" added successfully with ID {new_id}!', 'success')
        
    except (ValueError, KeyError) as e:
        flash('Error adding product. Please check all fields.', 'error')
    except Exception as e:
        flash(f'Error uploading image: {str(e)}', 'error')
    
    return redirect(url_for('product_management'))

@app.route('/edit_product/<int:product_id>', methods=['POST'])
@require_shop_login
def edit_product(product_id):
    """Edit an existing product with image upload."""
    username = session['shop_username']
    if not is_admin(username):
        return redirect(url_for('shop_main'))
    
    products = get_products()
    if product_id not in products:
        flash('Product not found.', 'error')
        return redirect(url_for('product_management'))
    
    try:
        name = request.form['name'].strip()
        price = float(request.form['price'])
        stock = int(request.form['stock'])
        category = request.form['category'].strip()
        description = request.form['description'].strip()
        
        if not name or price <= 0 or stock < 0:
            raise ValueError("Invalid input")
        
        # Keep existing image by default
        current_product = products[product_id]
        image_filename = current_product.get('image', 'default-product.svg')
        
        # Handle image upload if new image provided
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename != '' and allowed_file(file.filename):
                # Delete old image if not default
                old_image = current_product.get('image')
                if old_image and old_image != 'default-product.svg':
                    old_filepath = os.path.join(app.config['UPLOAD_FOLDER'], old_image)
                    if os.path.exists(old_filepath):
                        os.remove(old_filepath)
                
                # Create unique filename for new image
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                filename = secure_filename(file.filename)
                name_part = secure_filename(name.lower().replace(' ', '_'))
                unique_filename = f"{name_part}_{timestamp}_{filename}"
                
                # Ensure upload directory exists
                os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
                
                # Save new file
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
                file.save(filepath)
                image_filename = unique_filename
                flash(f'Image updated successfully!', 'success')
        
        updated_product = {
            "name": name,
            "price": price,
            "stock": stock,
            "category": category,
            "description": description,
            "image": image_filename
        }
        
        update_product(product_id, updated_product)
        flash(f'Product "{name}" updated successfully!', 'success')
        
    except (ValueError, KeyError) as e:
        flash('Error updating product. Please check all fields.', 'error')
    
    return redirect(url_for('product_management'))

@app.route('/delete_product/<int:product_id>', methods=['POST'])
@require_shop_login
def delete_product_route(product_id):
    """Delete a product."""
    username = session['shop_username']
    if not is_admin(username):
        return redirect(url_for('shop_main'))
    
    products = get_products()
    if product_id in products:
        product_name = products[product_id]['name']
        delete_product(product_id)
        flash(f'Product "{product_name}" deleted successfully!', 'success')
    else:
        flash('Product not found.', 'error')
    
    return redirect(url_for('product_management'))

@app.route('/toggle_stock/<int:product_id>', methods=['POST'])
@require_shop_login
def toggle_stock(product_id):
    """Toggle product stock between 0 (out of stock) and previous stock level."""
    username = session['shop_username']
    if not is_admin(username):
        return redirect(url_for('shop_main'))
    
    products = get_products()
    if product_id in products:
        product = products[product_id]
        if product['stock'] > 0:
            # Save current stock and set to 0
            product['previous_stock'] = product['stock']
            product['stock'] = 0
            flash(f'Product "{product["name"]}" marked as out of stock.', 'success')
        else:
            # Restore previous stock or set to 1 if no previous stock saved
            previous_stock = product.get('previous_stock', 1)
            product['stock'] = previous_stock
            if 'previous_stock' in product:
                del product['previous_stock']
            flash(f'Product "{product["name"]}" is back in stock.', 'success')
        
        # Save changes to data file
        update_product(product_id, product)
    else:
        flash('Product not found.', 'error')
    
    return redirect(url_for('product_management'))

@app.route('/unlock_user', methods=['POST'])
@require_shop_login
def unlock_user():
    """Admin function to unlock a user account."""
    admin_username = session['shop_username']
    if not is_admin(admin_username):
        return redirect(url_for('shop_main'))
    
    target_username = request.form.get('target_username')
    users = get_users()
    if target_username and target_username in users:
        user = users[target_username]
        user["locked"] = False
        user["locked_time"] = None
        update_user(target_username, user)
        flash(f'Account {target_username} has been unlocked!', 'success')
    else:
        flash('User not found!', 'error')
    
    return redirect(url_for('admin_panel'))

@app.route('/reset_password', methods=['GET', 'POST'])
def reset_password():
    """Allow users to reset their password if they know their username."""
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        new_password = request.form.get('new_password', '').strip()
        confirm_password = request.form.get('confirm_password', '').strip()
        
        if not username or not new_password or not confirm_password:
            return render_template('reset_password.html', 
                                 error='All fields are required.')
        
        if new_password != confirm_password:
            return render_template('reset_password.html',
                                 error='Passwords do not match.',
                                 username=username)
        
        if len(new_password) < 4:
            return render_template('reset_password.html',
                                 error='Password must be at least 4 characters long.',
                                 username=username)
        
        users = get_users()
        user = users.get(username)
        if not user:
            return render_template('reset_password.html',
                                 error='User not found.',
                                 username=username)
        
        # Reset password and unlock account
        user["password"] = new_password
        user["locked"] = False
        user["locked_time"] = None
        update_user(username, user)
        
        flash('Password reset successful! You can now login with your new password.', 'success')
        return redirect(url_for('shop_login'))
    
    return render_template('reset_password.html')

if __name__ == '__main__':
    print("=== Online Shop Application ===")
    print("Demo Credentials:")
    print("Customer: john / 1234 (Balance: $100)")
    print("Admin: admin / admin123 (Balance: $1000)")
    print("===============================")
    print("Features:")
    print("• Auto-unlock after 30 seconds")
    print("• Admin can unlock accounts")
    print("• Password reset available")
    print("• Add money system with quick amounts")
    print("• Maximum deposit: $10,000")
    print("===============================")
    print("Starting server at http://localhost:5001")
    
    app.run(debug=True, host='0.0.0.0', port=5001)
