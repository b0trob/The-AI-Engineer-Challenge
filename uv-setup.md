# Simple OpenAI - UV Environment Setup Guide

This guide shows you how to use `uv` (the fast Python package installer) to manage your Python environment for the Simple OpenAI project.

## What is UV?

[UV](https://github.com/astral-sh/uv) is a fast Python package installer and resolver, written in Rust. It's designed to be a drop-in replacement for pip, pip-tools, and virtual environments.

## Prerequisites

### Install UV

**Linux/macOS:**
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

**Windows:**
```powershell
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

**Using pip:**
```bash
pip install uv
```

### Verify Installation
```bash
uv --version
```

## Setting Up the Environment

### Step 1: Navigate to Project Directory
```bash
cd The-AI-Engineer-Challenge
```

### Step 2: Create Virtual Environment with UV
```bash
# Create a new virtual environment
uv venv

# Activate the virtual environment
# On Linux/macOS:
source .venv/bin/activate
# On Windows:
.venv\Scripts\activate
```

### Step 3: Install Dependencies
```bash
# Install all dependencies from pyproject.toml
uv pip install -e .

# Or install specific dependencies
uv pip install fastapi uvicorn openai pydantic python-multipart
```

### Step 4: Install Development Dependencies
```bash
# Install dev dependencies for testing
uv pip install pytest pytest-asyncio httpx
```

## Alternative: One-Command Setup

UV can create the environment and install dependencies in one command:

```bash
# Create environment and install dependencies
uv sync

# This is equivalent to:
# uv venv
# source .venv/bin/activate  # (or .venv\Scripts\activate on Windows)
# uv pip install -e .
```

## Running the Application

### Start the Backend
```bash
# Make sure you're in the project root
cd The-AI-Engineer-Challenge

# Activate the environment
source .venv/bin/activate  # Linux/macOS
# or
.venv\Scripts\activate     # Windows

# Start the FastAPI server
cd api
python app.py
```

### Start the Frontend (in another terminal)
```bash
cd frontend
npm install
npm run dev
```

## Development Workflow

### Adding New Dependencies
```bash
# Add a new dependency
uv add requests

# Add a development dependency
uv add --dev pytest-cov
```

### Updating Dependencies
```bash
# Update all dependencies
uv pip install --upgrade -e .

# Update specific package
uv pip install --upgrade fastapi
```

### Removing Dependencies
```bash
# Remove a package
uv remove requests
```

## Testing with UV

### Run Tests
```bash
# Run all tests
uv run pytest

# Run tests with coverage
uv run pytest --cov=api
```

### Run the Application
```bash
# Run the FastAPI app directly
uv run python api/app.py

# Run with specific Python version
uv run --python 3.11 python api/app.py
```

## UV vs Traditional Methods

### Traditional (pip + venv)
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Install dev dependencies
pip install pytest pytest-asyncio httpx
```

### UV (Modern approach)
```bash
# Create environment and install dependencies
uv sync

# Add new dependency
uv add requests

# Run application
uv run python api/app.py
```

## Benefits of UV

1. **Speed**: UV is significantly faster than pip
2. **Reliability**: Better dependency resolution
3. **Simplicity**: Single tool for environment management
4. **Compatibility**: Works with existing Python projects
5. **Lock Files**: Automatic lock file generation for reproducible builds

## Lock File Management

UV automatically generates a `uv.lock` file for reproducible builds:

```bash
# Generate lock file
uv lock

# Install from lock file
uv sync --frozen
```

## Environment Variables

You can set environment variables for UV:

```bash
# Set environment variable for UV
export UV_INDEX_URL=https://pypi.org/simple/

# Or use .env file
echo "UV_INDEX_URL=https://pypi.org/simple/" > .env
```

## Troubleshooting

### Common Issues

**UV not found:**
```bash
# Add UV to PATH (Linux/macOS)
export PATH="$HOME/.cargo/bin:$PATH"

# Or reinstall UV
curl -LsSf https://astral.sh/uv/install.sh | sh
```

**Permission errors:**
```bash
# Fix permissions
chmod +x .venv/bin/activate
```

**Dependency conflicts:**
```bash
# Clear cache and reinstall
uv cache clean
uv sync --reinstall
```

### Getting Help
```bash
# Show UV help
uv --help

# Show specific command help
uv pip --help
uv venv --help
```

## Integration with Existing Scripts

You can update the deployment scripts to use UV:

### Update deploy-local.sh
```bash
# Replace pip install with uv sync
uv sync

# Replace python with uv run
uv run python api/app.py
```

### Update test-local.sh
```bash
# Use UV for running tests
uv run pytest
```

## Migration from Requirements.txt

If you want to migrate from `requirements.txt` to `pyproject.toml`:

1. **Convert requirements.txt to pyproject.toml** (already done)
2. **Remove requirements.txt** (optional)
3. **Update scripts to use UV**

```bash
# Remove old requirements.txt
rm api/requirements.txt

# Use pyproject.toml instead
uv sync
```

## Best Practices

1. **Use lock files**: Always commit `uv.lock` to version control
2. **Pin versions**: Use exact versions in `pyproject.toml` for production
3. **Separate dev dependencies**: Keep development tools separate
4. **Use UV run**: Use `uv run` for one-off commands
5. **Keep environment local**: Use `.venv` for project-specific environments

## Next Steps

1. **Install UV** using the commands above
2. **Run `uv sync`** to set up your environment
3. **Start developing** with the faster, more reliable toolchain
4. **Update your CI/CD** to use UV for consistent builds

For more information, visit the [UV documentation](https://docs.astral.sh/uv/). 