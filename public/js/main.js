(()=> {
    let app = angular.module('stocks', []);

    app.controller('StockController', ['$scope', '$http',
        ($scope, $http)=> {
            $scope.tickerSymbol = '';
            $scope.companies = [];

            $scope.addCompany = ()=> {
                const newCompanySymbol = $scope.tickerSymbol;
                if (!newCompanySymbol) return;
                
                let newCompany = {
                    ticker_symbol: newCompanySymbol
                }

                let apiKey = '';
                $.get('/rest/getenv', data=> {
                    apiKey = data;
                })

                $.get('/api/' + newCompanySymbol, data =>{
                    if (!data) {
                        $http.get('https://www.quandl.com/api/v3/datasets/WIKI/' + newCompanySymbol + '.json?api_key=' + apiKey)
                            .then(response=>{
                                newCompany.name = response.data.dataset.name;
                            });
                    } else {
                        newCompany.name = data.name;
                    }
                });

                // Add company to array if not already there
                if ($scope.companies.indexOf(newCompany) == -1)
                    $scope.companies.push(newCompany);
                
                $scope.tickerSymbol = '';
                console.log($scope.companies);
            }    

            $scope.removeCompany = company=> { 
                const index = $scope.companies.indexOf(company);
                $scope.companies.splice(index, 1);    
            }
        }
    ]);
})();

$('#stock-form').submit(function(e){
    e.preventDefault();
    $.ajax({
        url:'/',
        type:'post',
        data:$('#stock-form').serialize(),
        success:function(){
            //whatever you wanna do after the form is successfully submitted
        }
    });
});

var socket = io();