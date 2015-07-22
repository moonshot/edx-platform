;(function (define) {
    'use strict';

    define(['backbone', 'js/discovery/collection', 'js/discovery/views/search_form',
        'js/discovery/views/courses_listing', 'js/discovery/views/filter_bar', 'js/discovery/views/refine_sidebar'],
        function(Backbone, Collection, SearchForm, CoursesListing, FilterBarView, RefineSidebar) {

            return function (meanings, searchQuery) {

                var collection = new Collection([]);
                var listing = new CoursesListing({ collection: collection });
                var dispatcher = _.clone(Backbone.Events);
                var form = new SearchForm();
                var filters = new FilterBarView();
                var refineSidebar = new RefineSidebar(meanings);

                dispatcher.listenTo(form, 'search', function (query) {
                    form.showLoadingIndicator();
                    filters.changeQueryFilter(query);
                });

                dispatcher.listenTo(filters, 'search', function (searchTerm, facets) {
                    collection.performSearch(searchTerm, facets);
                    form.showLoadingIndicator();
                });

                dispatcher.listenTo(filters, 'clear', function () {
                    form.clearSearch();
                    collection.performSearch();
                    filters.hideClearAllButton();
                });

                dispatcher.listenTo(listing, 'next', function () {
                    collection.loadNextPage();
                    form.showLoadingIndicator();
                });

                dispatcher.listenTo(collection, 'search', function () {
                    if (collection.length > 0) {
                        form.showFoundMessage(collection.totalCount);
                        listing.render();
                    }
                    else {
                        form.showNotFoundMessage(collection.searchTerm);
                    }
                    refineSidebar.renderFacets(collection.facets);
                    form.hideLoadingIndicator();
                });

                dispatcher.listenTo(collection, 'next', function () {
                    listing.renderNext();
                    form.hideLoadingIndicator();
                });

                dispatcher.listenTo(collection, 'error', function () {
                    form.showErrorMessage();
                    form.hideLoadingIndicator();
                });

                dispatcher.listenTo(refineSidebar, 'addFilter', function (data) {
                    filters.addFilter(data);
                });

                // kick off search on page refresh
                form.doSearch(searchQuery);

            };

        });

})(define || RequireJS.define);
