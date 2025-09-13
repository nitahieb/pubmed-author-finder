from flask import Flask, render_template, request, jsonify
from services import getSummary, getEmails
from constants import APPLICATION_OUTPUT_OPTIONS, PUBMED_SORT_OPTIONS

app = Flask(__name__, template_folder='templates', static_folder='static')

@app.route('/')
def index():
    """Main web interface"""
    return render_template('index.html',
                         output_options=APPLICATION_OUTPUT_OPTIONS,
                         sort_options=PUBMED_SORT_OPTIONS)

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'version': '0.1.0'})

@app.route('/api/search', methods=['POST'])
def search():
    """Main search API endpoint"""
    try:
        data = request.get_json()

        # Validate required fields
        if not data or 'searchterm' not in data:
            return jsonify({'error': 'searchterm is required'}), 400

        # Extract parameters with defaults
        searchterm = data['searchterm']
        mode = data.get('mode', 'overview')
        email = data.get('email', '')
        searchnumber = int(data.get('searchnumber', 10))
        sortby = data.get('sortby', 'relevance')

        # Validate parameters
        if mode not in APPLICATION_OUTPUT_OPTIONS:
            return jsonify({
                'error': f'Invalid mode. Must be one of: {APPLICATION_OUTPUT_OPTIONS}'
            }), 400

        if sortby not in PUBMED_SORT_OPTIONS:
            return jsonify({'error': f'Invalid sortby. Must be one of: {PUBMED_SORT_OPTIONS}'}), 400

        if searchnumber <= 0 or searchnumber > 100:
            return jsonify({'error': 'searchnumber must be between 1 and 100'}), 400

        # Execute search based on mode
        if mode == 'overview':
            result = getSummary(searchterm, sortby, email, searchnumber)
        else:  # emails mode
            result = getEmails(searchterm, sortby, email, searchnumber)

        return jsonify({
            'success': True,
            'mode': mode,
            'result': result,
            'parameters': {
                'searchterm': searchterm,
                'mode': mode,
                'email': email,
                'searchnumber': searchnumber,
                'sortby': sortby
            }
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Development server
    app.run(debug=True, host='0.0.0.0', port=5000)
