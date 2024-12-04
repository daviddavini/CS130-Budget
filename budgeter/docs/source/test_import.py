# test_import.py
try:
    import myapp.admin  # Replace with actual module names as needed
    print("Module imported successfully")
except ImportError as e:
    print(f"Import failed: {e}")
