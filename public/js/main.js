(()=> {
    let app = angular.module('stocks', ['ngAnimate']);

    let apiKey = '';
    // Get API key from the server
    $.get('/rest/getenv', data=> {
        apiKey = data.result;
    })

    app.controller('StockController', ['$scope', '$http',
        ($scope, $http)=> {
            $scope.tickerSymbol = '';
            $scope.companies = [];

            // Initially plot data here
            $scope.companies.forEach(company=> {

            })

            $scope.addCompany = ()=> {
                const newCompanySymbol = $scope.tickerSymbol;
                // Exit out if no user input
                if (!newCompanySymbol) return;
                
                let newCompany = {
                    ticker_symbol: newCompanySymbol.toUpperCase()
                }

                $http.get('https://www.quandl.com/api/v3/datasets/WIKI/' + newCompanySymbol + '.json?api_key=' + apiKey + '&start_date=01-01-2017')
                    .then(response=>{
                        newCompany.name = response.data.dataset.name;
                        // Compare objects works after removing $$hashkey property
                        if (angular.toJson($scope.companies).indexOf(angular.toJson(newCompany)) == -1) {
                            $scope.companies.push(newCompany);
                        }
                        const data = processQuandlData(response.data.dataset.data);
                        chart.addSeries({id: newCompanySymbol, data: data});

                        // Todo: If already exists, replace data in chart
                    }, err=> {
                        // If ticker symbol doesn't exist, display a message on the front end and exit out of addCompany function
                        if (err.status === 404) displayError("Ticker symbol not found");
                    });

                $scope.tickerSymbol = '';         
            }    

            $scope.removeCompany = company=> { 
                const index = $scope.companies.indexOf(company);
                $scope.companies.splice(index, 1);
                chart.get(company.ticker_symbol).remove();  
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

const processQuandlData = data=> {
    let newData = [];
    data.forEach(function(x, index) {
        const date = new Date(x[0]).getTime();
        var value = (x[1]+x[2]+x[3]+x[4])/4;
        newData.push([date, value]);
    });
    return newData.reverse();
}

let chart = Highcharts.chart('chart', {
    chart: {
        type: 'spline'
    },
    title: {
        text: 'Real time stock market trend data'
    },
    xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
            month: '%b',
            year: '%b'
        },
        title: {
            text: 'Date'
        }
    },
    yAxis: {
        title: {
            text: 'Volume'
        },
        min: 0
    },
    legend: {
        enabled: false
    },    
    tooltip: {
        headerFormat: '<b>{series.name}</b><br>',
        pointFormat: '{point.x:%e. %b}: {point.y:.2f} m'
    },
    plotOptions: {
        spline: {
            marker: {
                enabled: true
            }
        }
    },
    credits: {
        enabled: false
    },    
    series: []
});

var socket = io();