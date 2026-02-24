#!/usr/bin/env python3
"""
Test Suite for Online Shop Application
Tests for Login, Product Management, and User Management
"""

import unittest
import json
import os
import tempfile
import shutil
from unittest.mock import patch, MagicMock
import sys
import io

# Add the parent directory to the path to import shop_app
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import shop_app
from shop_app import app, load_data, save_data, get_users, get_products, update_user, update_product, add_new_product, delete_product

class TestShopApp(unittest.TestCase):
    """Base test class with common setup and teardown"""
    
    def setUp(self):
        """Set up test environment before each test"""
        # Create a temporary directory for test files
        self.test_dir = tempfile.mkdtemp()
        self.test_data_file = os.path.join(self.test_dir, 'test_data.json')
        
        # Mock the DATA_FILE path
        self.original_data_file = getattr(shop_app, 'DATA_FILE', 'data.json')
        shop_app.DATA_FILE = self.test_data_file
        
        # Create test client
        app.config['TESTING'] = True
        app.config['WTF_CSRF_ENABLED'] = False
        app.config['UPLOAD_FOLDER'] = os.path.join(self.test_dir, 'uploads')
        self.client = app.test_client()
        
        # Create upload directory
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        
        # Create initial test data
        self.test_data = {
            "users": {
                "testuser": {
                    "password": "testpass",
                    "balance": 100.0,
                    "locked": False,
                    "locked_time": None
                },
                "admin": {
                    "password": "admin123",
                    "balance": 1000.0,
                    "locked": False,
                    "locked_time": None,
                    "is_admin": True
                }
            },
            "products": {
                "1": {
                    "name": "Test Product",
                    "price": 25.99,
                    "stock": 10,
                    "category": "Test",
                    "description": "A test product",
                    "image": "default-product.svg"
                }
            }
        }
        
        # Save test data to file
        with open(self.test_data_file, 'w') as f:
            json.dump(self.test_data, f)
    
    def tearDown(self):
        """Clean up after each test"""
        # Restore original DATA_FILE
        shop_app.DATA_FILE = self.original_data_file
        
        # Clean up temporary directory
        shutil.rmtree(self.test_dir, ignore_errors=True)
    
    def login_user(self, username, password):
        """Helper method to log in a user"""
        return self.client.post('/shop_login', data={
            'username': username,
            'password': password
        }, follow_redirects=True)

class TestLogin(TestShopApp):
    """Test cases for user login functionality"""
    
    def test_login_page_loads(self):
        """Test that login page loads correctly"""
        response = self.client.get('/shop_login')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Login', response.data)
    
    def test_successful_login_regular_user(self):
        """Test successful login with regular user credentials"""
        response = self.login_user('testuser', 'testpass')
        self.assertEqual(response.status_code, 200)
        # Should redirect to shop main page
        self.assertIn(b'Online Shop', response.data)
    
    def test_successful_login_admin_user(self):
        """Test successful login with admin credentials"""
        response = self.login_user('admin', 'admin123')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Online Shop', response.data)
        # Admin should see admin panel link
        self.assertIn(b'Admin Panel', response.data)
    
    def test_login_invalid_username(self):
        """Test login with non-existent username"""
        response = self.login_user('nonexistent', 'password')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'User not found', response.data)
    
    def test_login_wrong_password(self):
        """Test login with incorrect password"""
        response = self.login_user('testuser', 'wrongpass')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'locked', response.data.lower())
    
    def test_login_empty_credentials(self):
        """Test login with empty username and password"""
        response = self.client.post('/shop_login', data={
            'username': '',
            'password': ''
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Please enter both username and password', response.data)
    
    def test_login_missing_password(self):
        """Test login with username but no password"""
        response = self.client.post('/shop_login', data={
            'username': 'testuser',
            'password': ''
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Please enter both username and password', response.data)
    
    def test_logout(self):
        """Test user logout functionality"""
        # First login
        self.login_user('testuser', 'testpass')
        
        # Then logout
        response = self.client.get('/shop_logout', follow_redirects=True)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Login', response.data)
    
    def test_protected_route_without_login(self):
        """Test accessing protected route without login"""
        response = self.client.get('/shop_main', follow_redirects=True)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Login', response.data)
    
    def test_session_persistence(self):
        """Test that session persists across requests"""
        # Login
        self.login_user('testuser', 'testpass')
        
        # Access protected route
        response = self.client.get('/shop_main')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'testuser', response.data)

class TestProductManagement(TestShopApp):
    """Test cases for product management functionality"""
    
    def setUp(self):
        super().setUp()
        # Login as admin for product management tests
        self.login_user('admin', 'admin123')
    
    def test_product_management_page_access(self):
        """Test admin can access product management page"""
        response = self.client.get('/product_management')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Product Management', response.data)
    
    def test_product_management_non_admin_access(self):
        """Test non-admin user cannot access product management"""
        # Logout admin and login as regular user
        self.client.get('/shop_logout')
        self.login_user('testuser', 'testpass')
        
        response = self.client.get('/product_management', follow_redirects=True)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Access denied', response.data)
    
    def test_add_product_success(self):
        """Test successful product addition"""
        response = self.client.post('/add_product', data={
            'name': 'New Test Product',
            'price': '49.99',
            'stock': '25',
            'category': 'Electronics',
            'description': 'A new test product'
        }, follow_redirects=True)
        
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'added successfully', response.data)
        
        # Verify product was added to data
        products = get_products()
        found = False
        for product in products.values():
            if product['name'] == 'New Test Product':
                found = True
                self.assertEqual(product['price'], 49.99)
                self.assertEqual(product['stock'], 25)
                self.assertEqual(product['category'], 'Electronics')
                break
        self.assertTrue(found, "Product was not added to database")
    
    def test_add_product_invalid_data(self):
        """Test product addition with invalid data"""
        response = self.client.post('/add_product', data={
            'name': '',  # Empty name
            'price': '-10',  # Negative price
            'stock': 'invalid',  # Invalid stock
            'category': 'Electronics',
            'description': 'Test'
        }, follow_redirects=True)
        
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Error adding product', response.data)
    
    def test_edit_product_success(self):
        """Test successful product editing"""
        # First, get existing product ID
        products = get_products()
        product_id = list(products.keys())[0]
        
        response = self.client.post(f'/edit_product/{product_id}', data={
            'name': 'Updated Test Product',
            'price': '35.99',
            'stock': '15',
            'category': 'Updated',
            'description': 'Updated description'
        }, follow_redirects=True)
        
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'updated successfully', response.data)
        
        # Verify product was updated
        updated_products = get_products()
        updated_product = updated_products[int(product_id)]
        self.assertEqual(updated_product['name'], 'Updated Test Product')
        self.assertEqual(updated_product['price'], 35.99)
        self.assertEqual(updated_product['stock'], 15)
    
    def test_edit_nonexistent_product(self):
        """Test editing a product that doesn't exist"""
        response = self.client.post('/edit_product/999', data={
            'name': 'Test',
            'price': '10',
            'stock': '5',
            'category': 'Test',
            'description': 'Test'
        }, follow_redirects=True)
        
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Product not found', response.data)
    
    def test_delete_product_success(self):
        """Test successful product deletion"""
        # Add a product to delete
        new_id = add_new_product({
            'name': 'To Delete',
            'price': 10.0,
            'stock': 5,
            'category': 'Test',
            'description': 'Will be deleted',
            'image': 'default-product.svg'
        })
        
        response = self.client.post(f'/delete_product/{new_id}', follow_redirects=True)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'deleted successfully', response.data)
        
        # Verify product was deleted
        products = get_products()
        self.assertNotIn(new_id, products)
    
    def test_toggle_stock_out_of_stock(self):
        """Test marking product as out of stock"""
        products = get_products()
        product_id = list(products.keys())[0]
        
        response = self.client.post(f'/toggle_stock/{product_id}', follow_redirects=True)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'out of stock', response.data)
        
        # Verify stock was set to 0
        updated_products = get_products()
        self.assertEqual(updated_products[int(product_id)]['stock'], 0)
    
    def test_toggle_stock_restock(self):
        """Test restocking an out-of-stock product"""
        products = get_products()
        product_id = list(products.keys())[0]
        
        # First mark as out of stock
        self.client.post(f'/toggle_stock/{product_id}')
        
        # Then restock
        response = self.client.post(f'/toggle_stock/{product_id}', follow_redirects=True)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'back in stock', response.data)
        
        # Verify stock was restored
        updated_products = get_products()
        self.assertGreater(updated_products[int(product_id)]['stock'], 0)

class TestUserManagement(TestShopApp):
    """Test cases for user management functionality"""
    
    def setUp(self):
        super().setUp()
        # Login as admin for user management tests
        self.login_user('admin', 'admin123')
    
    def test_admin_panel_access(self):
        """Test admin can access admin panel"""
        response = self.client.get('/admin')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Admin Panel', response.data)
    
    def test_admin_panel_non_admin_access(self):
        """Test non-admin user cannot access admin panel"""
        # Logout admin and login as regular user
        self.client.get('/shop_logout')
        self.login_user('testuser', 'testpass')
        
        response = self.client.get('/admin', follow_redirects=True)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Access denied', response.data)
    
    def test_unlock_user_success(self):
        """Test admin unlocking a locked user"""
        # First lock a user by failing login
        self.client.get('/shop_logout')
        self.client.post('/shop_login', data={
            'username': 'testuser',
            'password': 'wrongpass'
        })
        
        # Login back as admin
        self.login_user('admin', 'admin123')
        
        # Unlock the user
        response = self.client.post('/unlock_user', data={
            'target_username': 'testuser'
        }, follow_redirects=True)
        
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'unlocked', response.data)
        
        # Verify user is unlocked
        users = get_users()
        self.assertFalse(users['testuser']['locked'])
    
    def test_unlock_nonexistent_user(self):
        """Test unlocking a user that doesn't exist"""
        response = self.client.post('/unlock_user', data={
            'target_username': 'nonexistent'
        }, follow_redirects=True)
        
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'User not found', response.data)
    
    def test_user_balance_persistence(self):
        """Test that user balance changes persist"""
        # Login as regular user
        self.client.get('/shop_logout')
        self.login_user('testuser', 'testpass')
        
        # Add money
        response = self.client.post('/add_money', data={
            'amount': '50.00'
        }, follow_redirects=True)
        
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Successfully added', response.data)
        
        # Verify balance was updated
        users = get_users()
        self.assertEqual(users['testuser']['balance'], 150.0)
    
    def test_password_reset_success(self):
        """Test successful password reset"""
        # First verify the old password works
        response = self.login_user('testuser', 'testpass')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Online Shop', response.data)
        self.client.get('/shop_logout')
        
        # Now reset the password
        response = self.client.post('/reset_password', data={
            'username': 'testuser',
            'new_password': 'newpass123',
            'confirm_password': 'newpass123'
        }, follow_redirects=True)
        
        self.assertEqual(response.status_code, 200)
        # After successful reset, it redirects to login page
        self.assertIn(b'Online Shop', response.data)
        
        # Test login with new password works
        response = self.login_user('testuser', 'newpass123')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Online Shop', response.data)
    
    def test_password_reset_mismatch(self):
        """Test password reset with mismatched passwords"""
        response = self.client.post('/reset_password', data={
            'username': 'testuser',
            'new_password': 'newpass123',
            'confirm_password': 'different'
        })
        
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'do not match', response.data)
    
    def test_password_reset_short_password(self):
        """Test password reset with too short password"""
        response = self.client.post('/reset_password', data={
            'username': 'testuser',
            'new_password': '123',
            'confirm_password': '123'
        })
        
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'at least 4 characters', response.data)

class TestIntegration(TestShopApp):
    """Integration tests combining multiple functionalities"""
    
    def test_complete_shopping_flow(self):
        """Test complete flow: login, view products, buy product"""
        # Login as customer
        self.login_user('testuser', 'testpass')
        
        # View shop
        response = self.client.get('/shop_main')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Test Product', response.data)
        
        # Buy product
        response = self.client.post('/buy_product', data={
            'product_id': '1'
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Successfully purchased', response.data)
        
        # Verify balance decreased and stock decreased
        users = get_users()
        products = get_products()
        
        expected_balance = 100.0 - 25.99
        self.assertAlmostEqual(users['testuser']['balance'], expected_balance, places=2)
        self.assertEqual(products[1]['stock'], 9)
    
    def test_admin_product_management_flow(self):
        """Test complete admin flow: login, add product, edit product, delete product"""
        # Login as admin
        self.login_user('admin', 'admin123')
        
        # Add product
        response = self.client.post('/add_product', data={
            'name': 'Admin Test Product',
            'price': '99.99',
            'stock': '5',
            'category': 'Admin',
            'description': 'Product added by admin'
        }, follow_redirects=True)
        
        self.assertIn(b'added successfully', response.data)
        
        # Get the new product ID
        products = get_products()
        new_product_id = None
        for pid, product in products.items():
            if product['name'] == 'Admin Test Product':
                new_product_id = pid
                break
        
        self.assertIsNotNone(new_product_id)
        
        # Edit the product
        response = self.client.post(f'/edit_product/{new_product_id}', data={
            'name': 'Updated Admin Product',
            'price': '89.99',
            'stock': '3',
            'category': 'Updated',
            'description': 'Updated by admin'
        }, follow_redirects=True)
        
        self.assertIn(b'updated successfully', response.data)
        
        # Delete the product
        response = self.client.post(f'/delete_product/{new_product_id}', follow_redirects=True)
        self.assertIn(b'deleted successfully', response.data)
        
        # Verify product is gone
        final_products = get_products()
        self.assertNotIn(new_product_id, final_products)

if __name__ == '__main__':
    # Create test suite
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    
    # Add test classes
    suite.addTests(loader.loadTestsFromTestCase(TestLogin))
    suite.addTests(loader.loadTestsFromTestCase(TestProductManagement))
    suite.addTests(loader.loadTestsFromTestCase(TestUserManagement))
    suite.addTests(loader.loadTestsFromTestCase(TestIntegration))
    
    # Run tests with detailed output
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # Print summary
    print(f"\n{'='*60}")
    print(f"TEST SUMMARY")
    print(f"{'='*60}")
    print(f"Tests run: {result.testsRun}")
    print(f"Failures: {len(result.failures)}")
    print(f"Errors: {len(result.errors)}")
    print(f"Success rate: {((result.testsRun - len(result.failures) - len(result.errors)) / result.testsRun * 100):.1f}%")
    
    if result.failures:
        print(f"\nFAILURES:")
        for test, traceback in result.failures:
            print(f"- {test}: {traceback}")
    
    if result.errors:
        print(f"\nERRORS:")
        for test, traceback in result.errors:
            print(f"- {test}: {traceback}")
