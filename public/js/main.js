(()=> {
    var app = angular.module('stocks', []);

    var stocks = [
        {
            name: 'TEST',
            price: 25.0,
            description: 'dsfdsf',
            canPurchase: true,
            color: '#EB7B59',
        },
        {
            name: 'TEST',
            price: 25.0,
            description: 'dsfdsf',
            canPurchase: false,
            color: '#A7C5BD',
        },        
    ];

    app.controller('StockController', ['$scope',
        ($scope)=> {
            $scope.products = stocks;
        }
    ]);



})();