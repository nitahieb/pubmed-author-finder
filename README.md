# PubMed Author Finder

**Know a topic? Pull up articles. Meet authors. Make contact.**

PubMed Author Finder helps you quickly find research papers on any topic and gives you author contact info so you can reach out faster.

## 🌐 Web Application

The easiest way to use PubMed Author Finder is through our modern web interface:

### Quick Start
1. **Clone and run locally:**
```bash
git clone https://github.com/nitahieb/pubmed-author-finder.git
cd pubmed-author-finder
poetry install
cd src
poetry run python webapp.py
```

2. **Open your browser and go to:** `http://localhost:5000`

3. **Search away!** Enter your research topic, choose your output mode, and click "Search PubMed"

### Web Interface Features
- **Modern, responsive design** that works on desktop and mobile
- **Real-time search** with all the same options as the CLI
- **Two output modes:**
  - **Overview:** Beautiful formatted article summaries with author information
  - **Emails:** Clean list of author email addresses
- **Flexible filtering:** Sort by relevance, date, author, or journal name
- **Easy deployment:** See [DEPLOYMENT.md](DEPLOYMENT.md) for production setup

![Web Interface](https://github.com/user-attachments/assets/8569688c-9328-4258-adcf-78d62dc23957)

---

##  What Is It

 Type in “cancer immunotherapy” and see titles, authors, affiliations, and emails. No more fumbling through PubMed pages manually.

---

## Using the GitHub Action

You can interact with PubMed Author Finder directly from GitHub using the provided GitHub Action workflow. This is useful for running searches and retrieving results without setting up the app locally.

### How to Trigger

- **Manually:** Go to the **Actions** tab in your GitHub repository, select `Run application`, and click **Run workflow**. Fill in the input fields as needed.

### Supported Parameters

| Parameter      | Description                                 | Required | Default     | Options/Example Values           |
| -------------- | ------------------------------------------- | -------- | ----------- | ------------------------------- |
| `search`       | Topic or query to search for                | Yes      | –           | "cancer immunotherapy"          |
| `mode`         | Output type                                 | No       | overview    | overview, emails                |
| `email`        | Filter by author email                      | No       | (empty)     | "author@email.com"              |
| `searchnumber` | Number of results to return                 | No       | 10          | 1, 5, 20                        |
| `sortby`       | Sort order for PubMed search                | No       | relevance   | relevance, pub_date, Author, JournalName |

### Modes

- `overview`: Returns a summary of articles for the search term.
- `emails`: Returns author emails for the search term.

### Example: Manual Run

1. Go to **Actions** > **Run application** > **Run workflow**.
2. Enter your search term (e.g., `cancer immunotherapy`).
3. Choose a mode (e.g., `emails` to get author emails).
4. Optionally set `searchnumber`, `sortby`, or `email`.
5. Click **Run workflow**. Results will appear in the workflow summary.

---

## How to Use the script

Once downloaded, you can run `PubMedSearch` directly from your terminal.

**Basic search:**

```bash
python main.py "cancer immunotherapy"
```

This will display an overview of the top 10 most relevant articles for the search term.

**Specify number of results:**

```bash
python main.py "cancer immunotherapy" -n 5
```

This returns only the top 5 results.

**Choose output mode:**

```bash
python main.py "cancer immunotherapy" -m emails
```

`-m` or `--mode` can be one of the available application output options (e.g., `relevance`, `pub_date`, `Author`, `JournalName`).

**Sort results:**

```bash
python main.py "cancer immunotherapy" -s date
```

Sort articles by relevance, date, or other supported PubMed sort options.

**Filter by email (optional):**

```bash
python main.py "cancer immunotherapy" -e example@email.com
```

Search and display articles associated with a specific author email.

**Combine options:**

```bash
python main.py "cancer immunotherapy" -n 5 -m emails -s date
```

You can mix and match options to customize your search results.

---

##  Contributing

We welcome your contributions! Please check out our [`CONTRIBUTING.md`](CONTRIBUTING.md) for guidelines on how to submit pull requests, ensure checks pass, and request approvals.

## Linting with Ruff

We use [Ruff](https://github.com/charliermarsh/ruff) as our Python linter to maintain code quality and consistency.

**Install Ruff:**

```bash
pip install ruff
```

**Run Ruff manually:**

```bash
ruff check .
```

This will analyze your project and display any style or linting issues.

**Recommended:** Use the [Ruff VS Code extension](https://marketplace.visualstudio.com/items?itemName=charliermarsh.ruff) for inline linting and autofix suggestions while editing your code.

---

