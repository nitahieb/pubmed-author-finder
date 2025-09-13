import pytest
from unittest.mock import patch
import sys
import os

# Add src directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from webapp import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_index_route(client):
    """Test that the main page loads correctly"""
    response = client.get('/')
    assert response.status_code == 200
    assert b'PubMed Author Finder' in response.data
    assert b'Search Term' in response.data

def test_health_endpoint(client):
    """Test health check endpoint"""
    response = client.get('/api/health')
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'healthy'
    assert 'version' in data

def test_search_endpoint_missing_searchterm(client):
    """Test search endpoint with missing searchterm"""
    response = client.post('/api/search',
                          json={},
                          content_type='application/json')
    assert response.status_code == 400
    data = response.get_json()
    assert 'searchterm is required' in data['error']

def test_search_endpoint_invalid_mode(client):
    """Test search endpoint with invalid mode"""
    response = client.post('/api/search',
                          json={'searchterm': 'test', 'mode': 'invalid'},
                          content_type='application/json')
    assert response.status_code == 400
    data = response.get_json()
    assert 'Invalid mode' in data['error']

def test_search_endpoint_invalid_sortby(client):
    """Test search endpoint with invalid sortby"""
    response = client.post('/api/search',
                          json={'searchterm': 'test', 'sortby': 'invalid'},
                          content_type='application/json')
    assert response.status_code == 400
    data = response.get_json()
    assert 'Invalid sortby' in data['error']

def test_search_endpoint_invalid_searchnumber(client):
    """Test search endpoint with invalid searchnumber"""
    response = client.post('/api/search',
                          json={'searchterm': 'test', 'searchnumber': 0},
                          content_type='application/json')
    assert response.status_code == 400
    data = response.get_json()
    assert 'searchnumber must be between 1 and 100' in data['error']

@patch('webapp.getSummary')
def test_search_endpoint_overview_mode(mock_get_summary, client):
    """Test search endpoint in overview mode with mocked service"""
    mock_get_summary.return_value = "## Mock Article\n**Title:** Test Article"
    
    response = client.post('/api/search',
                          json={'searchterm': 'test', 'mode': 'overview'},
                          content_type='application/json')
    assert response.status_code == 200
    data = response.get_json()
    assert data['success']
    assert data['mode'] == 'overview'
    assert 'Mock Article' in data['result']
    mock_get_summary.assert_called_once_with('test', 'relevance', '', 10)

@patch('webapp.getEmails')
def test_search_endpoint_emails_mode(mock_get_emails, client):
    """Test search endpoint in emails mode with mocked service"""
    mock_get_emails.return_value = "test@example.com, author@university.edu"
    
    response = client.post('/api/search',
                          json={'searchterm': 'test', 'mode': 'emails'},
                          content_type='application/json')
    assert response.status_code == 200
    data = response.get_json()
    assert data['success']
    assert data['mode'] == 'emails'
    assert 'test@example.com' in data['result']
    mock_get_emails.assert_called_once_with('test', 'relevance', '', 10)
