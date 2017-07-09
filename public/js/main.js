(()=> {
    let app = angular.module('stocks', ['ngAnimate']);

    app.controller('StockController', ['$scope', '$http',
        ($scope, $http)=> {
            $scope.tickerSymbol = '';
            $scope.companies = [];

            $scope.addCompany = ()=> {
                const newCompanySymbol = $scope.tickerSymbol;
                // Exit out if no user input
                if (!newCompanySymbol) return;
                
                let newCompany = {
                    ticker_symbol: newCompanySymbol.toUpperCase()
                }

                let apiKey = '';
                // Get API key from the server
                $.get('/rest/getenv', data=> {
                    apiKey = data.result;
                })

                $http.get('https://www.quandl.com/api/v3/datasets/WIKI/' + newCompanySymbol + '.json?api_key=' + apiKey)
                    .then(response=>{
                        newCompany.name = response.data.dataset.name;
                        // Compare objects works after removing $$hashkey property
                        if (angular.toJson($scope.companies).indexOf(angular.toJson(newCompany)) == -1) {
                            $scope.companies.push(newCompany);
                        }
                        // Todo: Graph on chart
                        // Todo: If already exists, replace data in chart
                    }, err=> {
                        // If ticker symbol doesn't exist, display a message on the front end and exit out of addCompany function
                        displayError("Ticker symbol not found");
                    });

                $scope.tickerSymbol = '';         
            }    

            $scope.removeCompany = company=> { 
                const index = $scope.companies.indexOf(company);
                $scope.companies.splice(index, 1);    
            }
        }
    ]);
})();

const displayError = message=> {
    $('#new-stock').append('<div class="error" style="display: none">' + message + '</div>');
        $('.error').fadeIn('fast', ()=> {
            $('.error').delay(1000).fadeOut('fast', ()=> {
                $('.error').remove();
            });
        });
}
$('.company').fadeIn('slow');

var socket = io();