# PubMed Author Finder

**Always follow these instructions first and only fallback to additional search and context gathering if the information here is incomplete or found to be in error.**

PubMed Author Finder is a Python CLI application that helps researchers quickly find research papers on any topic and provides author contact information. The application searches PubMed, extracts article data, and formats output as either an overview or a list of author emails.

## Repository Structure and Key Files

### Core Application Files (src/)
- `main.py` - Main entry point and CLI runner
- `cli.py` - Command-line argument parsing with argparse
- `services.py` - Main business logic (getSummary, getEmails functions)
- `pipeline.py` - PubMed API pipeline using entrezpy
- `analyzer.py` - Article analysis (contains TODO comment)
- `article.py` - Article data model
- `researcher.py` - Researcher/author data model
- `parsing.py` - XML parsing and data extraction
- `format.py` - Output formatting (overview and email formats)
- `constants.py` - Application constants (output options, sort options)

### Test Files (tests/)
- 101 test files covering all major functionality
- Uses pytest framework with configuration in `pytest.ini`

### Configuration Files
- `pyproject.toml` - Poetry configuration and project metadata
- `poetry.lock` - Dependency lock file
- `.github/workflows/` - CI/CD workflows (lint.yml, python-tests.yml, run.yml)

## Installation and Setup

### Requirements
- Python 3.10+ (tested with 3.11, 3.12, 3.13)
- Internet access to PubMed API (eutils.ncbi.nlm.nih.gov)
- Poetry for dependency management (preferred) OR pip

### Installation Steps

**Option 1: Using Poetry (Recommended)**
```bash
# Install Poetry if not available
pip install poetry

# Install dependencies (takes ~1-2 seconds)
poetry install --no-interaction --no-root
```

**Option 2: Using pip directly**
```bash
# Install core dependencies
pip install entrezpy lxml pytest uniqpath

# Install for development including linting
pip install ruff

# Or install the package itself
pip install .
```

## Building and Testing

### Linting
```bash
# With Poetry - takes ~0.5 seconds
poetry run ruff check .

# With pip-installed ruff
ruff check .
```

### Running Tests
```bash
# With Poetry - takes ~1 second, runs 101 tests
poetry run pytest tests/

# With pip
pytest tests/
```

**TIMING EXPECTATIONS:**
- Poetry dependency installation: 1-2 seconds
- Linting with Ruff: 0.5 seconds  
- Full test suite: 1 second (101 tests)
- NEVER CANCEL: These are very fast operations, but allow 30+ second timeouts for safety

## Running the Application

### CLI Usage
```bash
# With Poetry
poetry run python src/main.py "search term" [options]

# With pip or from src/ directory  
cd src && python main.py "search term" [options]

# See all options
python src/main.py --help
```

### CLI Options
- `searchterm` (required) - Topic to search for
- `-m, --mode` - Output type: `overview` (default) or `emails`
- `-e, --email` - Filter by author email
- `-n, --searchnumber` - Number of results (default: 10)
- `-s, --sortby` - Sort order: `relevance` (default), `pub_date`, `Author`, `JournalName`

### Example Commands
```bash
# Basic search with overview
python src/main.py "cancer immunotherapy"

# Get author emails for 5 results
python src/main.py "machine learning" -m emails -n 5

# Sort by publication date
python src/main.py "COVID vaccine" -s pub_date -n 3
```

## Validation Requirements

### Critical Limitation
**The application requires internet access to PubMed API.** In sandboxed environments without internet access:
- The CLI argument parsing works correctly
- Help text displays properly  
- Tests run successfully (they use mocked data)
- **Actual searches will fail with network errors**

### Manual Validation Steps
After making changes, always validate:

1. **CLI Interface:**
   ```bash
   # Verify help displays correctly
   python src/main.py --help
   
   # Test argument parsing (will work offline)
   python src/main.py "test" -n 2 -m emails --help
   ```

2. **Code Quality:**
   ```bash
   # Run linting - must pass for CI
   ruff check .
   
   # Run full test suite
   pytest tests/
   ```

3. **Functional Testing (requires internet):**
   ```bash
   # Test basic search functionality
   python src/main.py "cancer" -n 2 -m overview
   
   # Test email extraction
   python src/main.py "machine learning" -n 1 -m emails
   ```

## CI/CD Information

### GitHub Actions Workflows
- **lint.yml**: Runs Ruff linting on Python 3.13
- **python-tests.yml**: Runs tests on Python 3.11, 3.12, 3.13 with Poetry
- **run.yml**: Manual workflow dispatch for running searches via GitHub Actions

### CI Requirements
- All checks must pass before merging
- Linting must be clean (`ruff check .`)
- All 101 tests must pass
- At least one reviewer approval required

## Development Workflow

### Making Changes
1. Always run linting and tests before committing:
   ```bash
   ruff check .
   pytest tests/
   ```

2. For network-dependent features, ensure tests use mocks or sample data

3. Be aware of the TODO in `analyzer.py` - this may need completion for some features

### Common File Paths for Reference
```
├── src/
│   ├── main.py           # Entry point
│   ├── services.py       # Core business logic  
│   ├── cli.py           # Argument parsing
│   ├── pipeline.py      # PubMed API integration
│   └── constants.py     # Configuration constants
├── tests/               # 101 test files
├── pyproject.toml       # Poetry config
└── .github/workflows/   # CI/CD pipelines
```

### Dependencies
- **entrezpy**: PubMed/NCBI Entrez API client
- **lxml**: XML parsing for PubMed responses  
- **pytest**: Testing framework
- **uniqpath**: Path utilities
- **ruff**: Python linting and formatting

### Important Notes
- Application requires network access to function fully
- Tests run offline using mocked data
- Very fast build and test cycle (under 3 seconds total)
- Well-structured codebase with comprehensive test coverage
- GitHub Action available for running searches without local setup