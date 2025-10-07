const express = require('express');
const router = express.Router();
const SearchController = require('../controllers/searchController');

// Create controller instance
const searchController = new SearchController();

// Search form page
router.get('/', searchController.buildSearchView.bind(searchController));

// Process search (GET and POST)
router.get('/results', searchController.searchVehicles.bind(searchController));
router.post('/results', searchController.advancedSearch.bind(searchController));

// Search suggestions (AJAX)
router.get('/suggestions', searchController.getSearchSuggestions.bind(searchController));

// Search history (admin feature)
router.get('/history', searchController.buildSearchHistoryView.bind(searchController));

// Clear search history (admin feature)
router.post('/history/clear', searchController.clearSearchHistory.bind(searchController));

module.exports = router;
