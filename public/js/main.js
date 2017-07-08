(()=> {
    let app = angular.module('stocks', []);

    app.controller('StockController', ['$scope',
        ($scope)=> {
            $scope.newCompany = {};
            $scope.companyToRemove = {};
            $scope.tickerSymbol = '';
            $scope.companies = [{
                ticker_symbol: 'FB'
            }];

            $scope.addCompany = ()=> {
                const newCompany = {
                    ticker_symbol: $scope.tickerSymbol
                }
                if (!newCompany.ticker_symbol) return;

                $scope.companies.push(newCompany);
                //console.log($scope.companies);  
            }
            $scope.removeCompany = function(company) { 
                const index = $scope.companies.indexOf(company);
                $scope.companies.splice(index, 1); 
                //console.log($scope.companies);    
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