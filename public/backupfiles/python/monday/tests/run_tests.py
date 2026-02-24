"""
Test Runner Configuration and Utility Functions
"""

import os
import sys
import unittest
import json
import tempfile
from pathlib import Path

# Add parent directory to path for imports
parent_dir = Path(__file__).parent.parent
sys.path.insert(0, str(parent_dir))

def run_all_tests():
    """Run all test cases with comprehensive reporting"""
    # Discover and run all tests
    loader = unittest.TestLoader()
    start_dir = os.path.dirname(__file__)
    suite = loader.discover(start_dir, pattern='test_*.py')
    
    # Run with verbose output
    runner = unittest.TextTestRunner(
        verbosity=2,
        stream=sys.stdout,
        descriptions=True,
        failfast=False
    )
    
    print("="*70)
    print("RUNNING SHOP APPLICATION TEST SUITE")
    print("="*70)
    print(f"Test directory: {start_dir}")
    print(f"Parent application directory: {parent_dir}")
    print("="*70)
    
    result = runner.run(suite)
    
    # Print detailed summary
    print("\n" + "="*70)
    print("DETAILED TEST RESULTS")
    print("="*70)
    
    total_tests = result.testsRun
    failures = len(result.failures)
    errors = len(result.errors)
    success = total_tests - failures - errors
    success_rate = (success / total_tests * 100) if total_tests > 0 else 0
    
    print(f"Total Tests Run: {total_tests}")
    print(f"✅ Successful: {success}")
    print(f"❌ Failures: {failures}")
    print(f"💥 Errors: {errors}")
    print(f"📊 Success Rate: {success_rate:.1f}%")
    
    if result.failures:
        print(f"\n🚨 FAILED TESTS ({len(result.failures)}):")
        for i, (test, traceback) in enumerate(result.failures, 1):
            print(f"\n{i}. {test}")
            print("   " + "\n   ".join(traceback.split('\n')[:3]))
    
    if result.errors:
        print(f"\n💥 ERROR TESTS ({len(result.errors)}):")
        for i, (test, traceback) in enumerate(result.errors, 1):
            print(f"\n{i}. {test}")
            print("   " + "\n   ".join(traceback.split('\n')[:3]))
    
    print("\n" + "="*70)
    
    return result.wasSuccessful()

def run_specific_test(test_class=None, test_method=None):
    """Run a specific test class or method"""
    if test_class:
        suite = unittest.TestLoader().loadTestsFromName(f'test_shop_app.{test_class}')
        if test_method:
            suite = unittest.TestLoader().loadTestsFromName(f'test_shop_app.{test_class}.{test_method}')
    else:
        suite = unittest.TestLoader().discover('.', pattern='test_*.py')
    
    runner = unittest.TextTestRunner(verbosity=2)
    return runner.run(suite)

if __name__ == '__main__':
    if len(sys.argv) > 1:
        if len(sys.argv) == 2:
            # Run specific test class
            run_specific_test(sys.argv[1])
        elif len(sys.argv) == 3:
            # Run specific test method
            run_specific_test(sys.argv[1], sys.argv[2])
    else:
        # Run all tests
        success = run_all_tests()
        sys.exit(0 if success else 1)
