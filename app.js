(function () {
    'use strict';
    
    angular.module('menuCategoriesApp', [])
    .controller('menuCategoriesController', menuCategoriesController)
    .service('menuCategoriesService', menuCategoriesService)
    .directive('foundItems', foundItems)
    .constant('apiBasePath', "https://coursera-jhu-default-rtdb.firebaseio.com");
    
    function foundItems() {
        var ddo = {
            templateUrl: 'foundItems.html'
        };
    
        return ddo;
    };

    menuCategoriesController.$inject = ['menuCategoriesService'];
    function menuCategoriesController(menuCategoriesService) {
        var menu = this;
        var promise = menuCategoriesService.getMenuCategories();

        menu.searchTerm = "";

        menu.searchItem = function() {
            menu.errorMessage = undefined;
            menu.results = [];

            promise.then(function(response) {
                menu.results = menuCategoriesService.searchItem(response.data, menu.searchTerm);
            })
            .catch(function (error) {
                menu.errorMessage = error.message;
            });
        };

        menu.removeItem = function(index) {
            menu.results.splice(index, 1);
        };
    };
    
    menuCategoriesService.$inject = ['$http', 'apiBasePath'];
    function menuCategoriesService($http, apiBasePath) {
        var service = this;
    
        service.getMenuCategories = function () {
            var response = $http({
                method: "GET",
                url: (apiBasePath + "/menu_items.json")
            });

            return response;
        };

        service.searchItem = function(categories, searchTerm) {
            var results = [];

            for (var item in categories) {
                var obj = categories[item];

                for (var prop in obj.menu_items) {
                    var desc = obj.menu_items[prop].description;

                    if (searchTerm != "" && desc.toLowerCase().includes(searchTerm.toLowerCase())) {
                        results.push(obj.menu_items[prop]);
                    }
                }
            }

            if(results.length < 1) {
                throw new Error("Nothing found");
            }

            return results;
        };
    
    }
    
})();