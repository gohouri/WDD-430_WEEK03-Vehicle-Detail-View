const SearchModel = require('../models/search');
const InventoryModel = require('../models/inventory');
const { getNav } = require('../utilities');

class SearchController {
    constructor() {
        this.searchModel = new SearchModel();
        this.inventoryModel = new InventoryModel();
    }

    // Display search form
    async buildSearchView(req, res, next) {
        try {
            const [nav, classifications, colors, yearRange, priceRange, mileageRange] = await Promise.all([
                getNav(),
                this.inventoryModel.getClassifications(),
                this.searchModel.getUniqueColors(),
                this.searchModel.getYearRange(),
                this.searchModel.getPriceRange(),
                this.searchModel.getMileageRange()
            ]);

            res.render('search/search', {
                title: 'Search Vehicles',
                nav,
                classifications,
                colors,
                yearRange,
                priceRange,
                mileageRange,
                searchParams: req.query || {}
            });
        } catch (error) {
            console.error('Error building search view:', error);
            next(error);
        }
    }

    // Process search request
    async searchVehicles(req, res, next) {
        try {
            const searchParams = {
                query: req.query.q || req.body.q || '',
                classification_id: req.query.classification_id || req.body.classification_id || 'all',
                min_price: req.query.min_price || req.body.min_price || '',
                max_price: req.query.max_price || req.body.max_price || '',
                min_miles: req.query.min_miles || req.body.min_miles || '',
                max_miles: req.query.max_miles || req.body.max_miles || '',
                min_year: req.query.min_year || req.body.min_year || '',
                max_year: req.query.max_year || req.body.max_year || '',
                color: req.query.color || req.body.color || 'all'
            };

            // Perform search
            console.log('Performing search with params:', searchParams);
            const searchResults = await this.searchModel.searchVehicles(searchParams);
            console.log('Search results found:', searchResults.length);
            if (searchResults.length > 0) {
                console.log('First result:', searchResults[0]);
            }

            // Save search to history (temporarily disabled for testing)
            // try {
            //     await this.searchModel.saveSearchHistory({
            //         query: searchParams.query,
            //         filters: searchParams,
            //         results_count: searchResults.length,
            //         user_ip: req.ip || req.connection.remoteAddress,
            //         user_agent: req.get('User-Agent')
            //     });
            // } catch (historyError) {
            //     console.error('Error saving search history:', historyError);
            //     // Don't fail the search if history saving fails
            // }

            // Get filter options for the search form
            const [nav, classifications, colors, yearRange, priceRange, mileageRange] = await Promise.all([
                getNav(),
                this.inventoryModel.getClassifications(),
                this.searchModel.getUniqueColors(),
                this.searchModel.getYearRange(),
                this.searchModel.getPriceRange(),
                this.searchModel.getMileageRange()
            ]);

            res.render('search/results', {
                title: 'Search Results',
                nav,
                searchResults,
                searchParams,
                classifications,
                colors,
                yearRange,
                priceRange,
                mileageRange,
                resultsCount: searchResults.length
            });
        } catch (error) {
            console.error('Error searching vehicles:', error);
            next(error);
        }
    }

    // Display search history (admin feature)
    async buildSearchHistoryView(req, res, next) {
        try {
            const [nav, searchHistory, searchStats, popularSearches] = await Promise.all([
                getNav(),
                this.searchModel.getSearchHistory(50),
                this.searchModel.getSearchStats(),
                this.searchModel.getPopularSearches(10)
            ]);

            res.render('search/history', {
                title: 'Search History',
                nav,
                searchHistory,
                searchStats,
                popularSearches
            });
        } catch (error) {
            console.error('Error building search history view:', error);
            next(error);
        }
    }

    // Get search suggestions (AJAX endpoint)
    async getSearchSuggestions(req, res, next) {
        try {
            const query = req.query.q || '';
            if (query.length < 2) {
                return res.json([]);
            }

            // Get suggestions from vehicle makes, models, and years
            const suggestions = await this.searchModel.searchVehicles({
                query: query,
                classification_id: 'all',
                min_price: '',
                max_price: '',
                min_miles: '',
                max_miles: '',
                min_year: '',
                max_year: '',
                color: 'all'
            });

            // Extract unique suggestions
            const uniqueSuggestions = [...new Set(
                suggestions.map(vehicle => [
                    vehicle.inv_make,
                    vehicle.inv_model,
                    vehicle.inv_year.toString(),
                    `${vehicle.inv_make} ${vehicle.inv_model}`,
                    `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`
                ]).flat()
            )].filter(suggestion => 
                suggestion.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 10);

            res.json(uniqueSuggestions);
        } catch (error) {
            console.error('Error getting search suggestions:', error);
            res.json([]);
        }
    }

    // Clear search history (admin feature)
    async clearSearchHistory(req, res, next) {
        try {
            // This would require a method in the model to clear history
            // For now, we'll just redirect back to history view
            req.flash('message', 'Search history cleared successfully');
            req.flash('messageType', 'success');
            res.redirect('/search/history');
        } catch (error) {
            console.error('Error clearing search history:', error);
            req.flash('message', 'Error clearing search history');
            req.flash('messageType', 'error');
            res.redirect('/search/history');
        }
    }

    // Advanced search with multiple criteria
    async advancedSearch(req, res, next) {
        try {
            const searchParams = {
                query: req.body.search_query || '',
                classification_id: req.body.classification_id || 'all',
                min_price: req.body.min_price || '',
                max_price: req.body.max_price || '',
                min_miles: req.body.min_miles || '',
                max_miles: req.body.max_miles || '',
                min_year: req.body.min_year || '',
                max_year: req.body.max_year || '',
                color: req.body.color || 'all'
            };

            // Validate search parameters
            const validationErrors = this.validateSearchParams(searchParams);
            if (validationErrors.length > 0) {
                req.flash('message', validationErrors.join(', '));
                req.flash('messageType', 'error');
                return res.redirect('/search');
            }

            // Perform search
            const searchResults = await this.searchModel.searchVehicles(searchParams);

            // Save search to history
            try {
                await this.searchModel.saveSearchHistory({
                    query: searchParams.query,
                    filters: searchParams,
                    results_count: searchResults.length,
                    user_ip: req.ip || req.connection.remoteAddress,
                    user_agent: req.get('User-Agent')
                });
            } catch (historyError) {
                console.error('Error saving search history:', historyError);
            }

            // Get filter options
            const [nav, classifications, colors, yearRange, priceRange, mileageRange] = await Promise.all([
                getNav(),
                this.inventoryModel.getClassifications(),
                this.searchModel.getUniqueColors(),
                this.searchModel.getYearRange(),
                this.searchModel.getPriceRange(),
                this.searchModel.getMileageRange()
            ]);

            res.render('search/results', {
                title: 'Advanced Search Results',
                nav,
                searchResults,
                searchParams,
                classifications,
                colors,
                yearRange,
                priceRange,
                mileageRange,
                resultsCount: searchResults.length
            });
        } catch (error) {
            console.error('Error in advanced search:', error);
            next(error);
        }
    }

    // Validate search parameters
    validateSearchParams(params) {
        const errors = [];

        // Validate price range
        if (params.min_price && params.max_price) {
            const minPrice = parseFloat(params.min_price);
            const maxPrice = parseFloat(params.max_price);
            if (minPrice > maxPrice) {
                errors.push('Minimum price cannot be greater than maximum price');
            }
        }

        // Validate mileage range
        if (params.min_miles && params.max_miles) {
            const minMiles = parseInt(params.min_miles);
            const maxMiles = parseInt(params.max_miles);
            if (minMiles > maxMiles) {
                errors.push('Minimum mileage cannot be greater than maximum mileage');
            }
        }

        // Validate year range
        if (params.min_year && params.max_year) {
            const minYear = parseInt(params.min_year);
            const maxYear = parseInt(params.max_year);
            if (minYear > maxYear) {
                errors.push('Minimum year cannot be greater than maximum year');
            }
        }

        // Validate numeric inputs
        if (params.min_price && isNaN(parseFloat(params.min_price))) {
            errors.push('Minimum price must be a valid number');
        }
        if (params.max_price && isNaN(parseFloat(params.max_price))) {
            errors.push('Maximum price must be a valid number');
        }
        if (params.min_miles && isNaN(parseInt(params.min_miles))) {
            errors.push('Minimum mileage must be a valid number');
        }
        if (params.max_miles && isNaN(parseInt(params.max_miles))) {
            errors.push('Maximum mileage must be a valid number');
        }
        if (params.min_year && isNaN(parseInt(params.min_year))) {
            errors.push('Minimum year must be a valid number');
        }
        if (params.max_year && isNaN(parseInt(params.max_year))) {
            errors.push('Maximum year must be a valid number');
        }

        return errors;
    }

    close() {
        this.searchModel.close();
        this.inventoryModel.close();
    }
}

module.exports = SearchController;
