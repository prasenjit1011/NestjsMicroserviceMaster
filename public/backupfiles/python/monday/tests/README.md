# Test Configuration and Requirements

## Test Framework
- **Framework**: Python unittest (built-in)
- **Coverage**: Login, Product Management, User Management
- **Test Data**: Isolated test environment with temporary files
- **Mocking**: unittest.mock for external dependencies

## Test Categories

### 1. Login Tests (`TestLogin`)
- ✅ Login page loads correctly
- ✅ Successful login (regular user)
- ✅ Successful login (admin user)
- ✅ Invalid username handling
- ✅ Wrong password handling (account locking)
- ✅ Empty credentials validation
- ✅ Missing password validation
- ✅ Logout functionality
- ✅ Protected route access without login
- ✅ Session persistence

### 2. Product Management Tests (`TestProductManagement`)
- ✅ Admin access to product management
- ✅ Non-admin access denial
- ✅ Add product successfully
- ✅ Add product with invalid data
- ✅ Edit product successfully
- ✅ Edit non-existent product
- ✅ Delete product successfully
- ✅ Toggle stock (out of stock)
- ✅ Toggle stock (restock)

### 3. User Management Tests (`TestUserManagement`)
- ✅ Admin panel access
- ✅ Non-admin panel access denial
- ✅ Unlock user successfully
- ✅ Unlock non-existent user
- ✅ User balance persistence
- ✅ Password reset successfully
- ✅ Password reset with mismatch
- ✅ Password reset with short password

### 4. Integration Tests (`TestIntegration`)
- ✅ Complete shopping flow
- ✅ Admin product management flow

## Running Tests

### Run All Tests
```bash
cd tests
python run_tests.py
```

### Run Specific Test Class
```bash
python run_tests.py TestLogin
```

### Run Specific Test Method
```bash
python run_tests.py TestLogin test_successful_login_regular_user
```

### Direct Test Execution
```bash
python test_shop_app.py
```

## Test Environment

### Isolation Features
- **Temporary directories**: Each test gets isolated file system
- **Mock data file**: Tests use separate `test_data.json`
- **Clean setup/teardown**: Fresh environment for each test
- **No side effects**: Tests don't affect production data

### Test Data Structure
```json
{
  "users": {
    "testuser": {
      "password": "testpass",
      "balance": 100.0,
      "locked": false,
      "locked_time": null
    },
    "admin": {
      "password": "admin123",
      "balance": 1000.0,
      "locked": false,
      "locked_time": null,
      "is_admin": true
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
```

## Coverage Areas

### Authentication & Security
- Login validation
- Session management
- Admin privilege checking
- Account locking mechanisms
- Password reset functionality

### Product Operations
- CRUD operations (Create, Read, Update, Delete)
- Stock management
- Price validation
- Category management
- Image handling

### User Operations
- Balance management
- Account status (locked/unlocked)
- Admin operations
- User data persistence

### Business Logic
- Purchase workflows
- Balance calculations
- Stock decrements
- Permission validations

## Test Benefits

1. **Reliability**: Ensures core functionality works as expected
2. **Regression Prevention**: Catches breaking changes
3. **Documentation**: Tests serve as usage examples
4. **Confidence**: Safe refactoring and feature additions
5. **Quality Assurance**: Validates business logic and edge cases

## Dependencies
- Python 3.x
- Flask application (`shop_app.py`)
- Standard library modules: `unittest`, `json`, `tempfile`, `shutil`
- Mock library: `unittest.mock`
