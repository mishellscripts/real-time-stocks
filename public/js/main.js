(()=> {
    let app = angular.module('stocks', []);

    app.controller('StockController', ['$scope',
        ($scope)=> {
            $scope.newCompany = {};
            $scope.companyToRemove = {};
            $scope.tickerSymbol = '';
            $scope.companySymbols = ['FB'];

            $scope.addCompany = ()=> {
                const newCompanySymbol = $scope.tickerSymbol;
                if (!newCompanySymbol) return;

                // Add company to array
                $scope.companySymbols.push(newCompanySymbol);
                //console.log($scope.companySymbols);

                $.get('/api/' + newCompanySymbol, data =>{
                    alert(data);
                });        
            }

            $scope.removeCompany = companySymbol=> { 
                const index = $scope.companySymbols.indexOf(companySymbol);
                $scope.companySymbols.splice(index, 1); 
                //console.log($scope.companySymbols);    
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