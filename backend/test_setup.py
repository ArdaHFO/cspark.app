#!/usr/bin/env python3
"""
Simple test script to verify Creator Transformer backend setup
"""

import sys
import subprocess
import importlib.util

def check_python_version():
    """Check if Python version is 3.9+"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 9):
        print("❌ Python 3.9+ required, found", f"{version.major}.{version.minor}")
        return False
    print(f"✅ Python {version.major}.{version.minor}.{version.micro}")
    return True

def check_package(package_name, import_name=None):
    """Check if a package is installed"""
    if import_name is None:
        import_name = package_name
    
    try:
        spec = importlib.util.find_spec(import_name)
        if spec is not None:
            print(f"✅ {package_name}")
            return True
        else:
            print(f"❌ {package_name} not found")
            return False
    except ImportError:
        print(f"❌ {package_name} not found")
        return False

def main():
    print("🔍 Checking Creator Transformer Backend Setup\n")
    
    all_good = True
    
    # Check Python version
    print("Python Version:")
    if not check_python_version():
        all_good = False
    
    print("\nRequired Packages:")
    packages = [
        ("fastapi", "fastapi"),
        ("uvicorn", "uvicorn"),
        ("httpx", "httpx"),
        ("pydantic", "pydantic"),
        ("trafilatura", "trafilatura"),
        ("beautifulsoup4", "bs4"),
        ("newspaper3k", "newspaper"),
        ("langdetect", "langdetect"),
        ("cachetools", "cachetools"),
        ("slowapi", "slowapi"),
    ]
    
    for package_name, import_name in packages:
        if not check_package(package_name, import_name):
            all_good = False
    
    print("\nOptional Packages:")
    optional_packages = [
        ("readability-lxml", "readability"),
        ("requests", "requests"),
    ]
    
    for package_name, import_name in optional_packages:
        check_package(package_name, import_name)
    
    print("\n" + "="*50)
    
    if all_good:
        print("🎉 All required packages are installed!")
        print("✅ Backend setup looks good!")
        
        # Try to import main modules
        try:
            sys.path.append('.')
            from app.config import get_settings
            print("✅ Configuration module works")
            
            from app.extractors import get_extraction_info
            info = get_extraction_info()
            print(f"✅ Extractors available: {[k for k, v in info.items() if v]}")
            
        except Exception as e:
            print(f"⚠️ Warning: Could not test modules: {e}")
        
    else:
        print("❌ Some required packages are missing!")
        print("💡 Run 'pip install -r requirements.txt' to install missing packages")
        sys.exit(1)

if __name__ == "__main__":
    main()
