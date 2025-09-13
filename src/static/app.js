document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('searchForm');
    const resultsDiv = document.getElementById('results');
    const resultsContent = document.getElementById('resultsContent');
    const errorDiv = document.getElementById('error');
    const errorMessage = document.getElementById('errorMessage');
    const searchBtn = form.querySelector('.search-btn');
    const btnText = searchBtn.querySelector('.btn-text');
    const loadingSpinner = searchBtn.querySelector('.loading-spinner');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Hide previous results/errors
        resultsDiv.style.display = 'none';
        errorDiv.style.display = 'none';
        
        // Show loading state
        searchBtn.disabled = true;
        btnText.style.display = 'none';
        loadingSpinner.style.display = 'inline-flex';
        
        try {
            // Gather form data
            const formData = new FormData(form);
            const searchData = {
                searchterm: formData.get('searchterm'),
                mode: formData.get('mode'),
                searchnumber: parseInt(formData.get('searchnumber')),
                sortby: formData.get('sortby'),
                email: formData.get('email') || ''
            };

            // Make API request
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(searchData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'An error occurred during search');
            }

            // Display results
            displayResults(data);
            
        } catch (error) {
            displayError(error.message);
        } finally {
            // Reset button state
            searchBtn.disabled = false;
            btnText.style.display = 'inline';
            loadingSpinner.style.display = 'none';
        }
    });

    function displayResults(data) {
        resultsContent.innerHTML = '';
        
        if (data.mode === 'emails') {
            // Display email results
            if (data.result && data.result.trim()) {
                resultsContent.innerHTML = `
                    <div class="email-results">
                        <strong>Author Emails Found:</strong><br>
                        ${data.result}
                    </div>
                `;
            } else {
                resultsContent.innerHTML = `
                    <div class="email-results">
                        <em>No author emails found for this search.</em>
                    </div>
                `;
            }
        } else {
            // Display overview results (markdown formatted)
            if (data.result && data.result.trim()) {
                // Convert markdown-like formatting to HTML
                const htmlContent = convertMarkdownToHTML(data.result);
                resultsContent.innerHTML = htmlContent;
            } else {
                resultsContent.innerHTML = `
                    <div class="email-results">
                        <em>No articles found for this search.</em>
                    </div>
                `;
            }
        }
        
        resultsDiv.style.display = 'block';
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
    }

    function displayError(message) {
        errorMessage.textContent = message;
        errorDiv.style.display = 'block';
        errorDiv.scrollIntoView({ behavior: 'smooth' });
    }

    function convertMarkdownToHTML(markdown) {
        let html = markdown;
        
        // Convert headers
        html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
        html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
        
        // Convert bold text
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        
        // Convert links
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
        
        // Convert tables
        html = convertMarkdownTables(html);
        
        // Convert line breaks
        html = html.replace(/\n/g, '<br>');
        
        // Convert horizontal rules
        html = html.replace(/^---$/gm, '<hr>');
        
        return html;
    }

    function convertMarkdownTables(html) {
        const lines = html.split('\n');
        let inTable = false;
        let result = [];
        let tableRows = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            if (line.startsWith('|') && line.endsWith('|')) {
                if (!inTable) {
                    inTable = true;
                    tableRows = [];
                }
                
                // Check if this is a separator line
                if (line.match(/^\|[\s\-\|]+\|$/)) {
                    // Skip separator line
                    continue;
                }
                
                const cells = line.split('|').slice(1, -1).map(cell => cell.trim());
                tableRows.push(cells);
            } else {
                if (inTable) {
                    // End of table, convert to HTML
                    if (tableRows.length > 0) {
                        let tableHtml = '<table>';
                        tableRows.forEach((row, index) => {
                            const tag = index === 0 ? 'th' : 'td';
                            tableHtml += '<tr>';
                            row.forEach(cell => {
                                tableHtml += `<${tag}>${cell}</${tag}>`;
                            });
                            tableHtml += '</tr>';
                        });
                        tableHtml += '</table>';
                        result.push(tableHtml);
                    }
                    inTable = false;
                    tableRows = [];
                }
                result.push(line);
            }
        }
        
        // Handle table at end of content
        if (inTable && tableRows.length > 0) {
            let tableHtml = '<table>';
            tableRows.forEach((row, index) => {
                const tag = index === 0 ? 'th' : 'td';
                tableHtml += '<tr>';
                row.forEach(cell => {
                    tableHtml += `<${tag}>${cell}</${tag}>`;
                });
                tableHtml += '</tr>';
            });
            tableHtml += '</table>';
            result.push(tableHtml);
        }
        
        return result.join('\n');
    }

    // Add some keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to submit form
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            form.dispatchEvent(new Event('submit'));
        }
    });
});