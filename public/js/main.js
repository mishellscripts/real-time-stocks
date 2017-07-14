(()=> {
    let app = angular.module('stocks', ['ngAnimate', 'LocalStorageModule']);
    let nextColorIndex = 0;

    app.controller('StockController', ['$scope', '$http',
        ($scope, $http)=> {
            $scope.tickerSymbol = '';
            $scope.companies = JSON.parse(localStorage.getItem('companies')) || [];

            $scope.setColor = company=> {
                return {
                    borderLeftColor: company.color
                }
            }

            // Graph all of the companies from previous session
            $scope.companies.forEach(company=> {
                $http.get('https://www.quandl.com/api/v3/datasets/WIKI/' + company.ticker_symbol + '.json?api_key=' + apiKey + '&start_date=01-01-2017')
                    .then(response=> {
                        company.color = colors[nextColorIndex];
                        if (nextColorIndex == colors.length) nextColorIndex = 0;
                        else nextColorIndex++;
                        chart.addSeries({id: company.ticker_symbol, name: company.ticker_symbol, data: processQuandlData(response.data.dataset.data)});
                    });
            });

            $scope.addCompany = ()=> {
                const newCompanySymbol = $scope.tickerSymbol;
                if (!newCompanySymbol) return;  // Exit out if no user input

                const newCompany = {
                    ticker_symbol: newCompanySymbol.toUpperCase(),
                    color: colors[nextColorIndex]
                }
                if (nextColorIndex == colors.length) nextColorIndex = 0;
                else nextColorIndex++;
                $http.get('https://www.quandl.com/api/v3/datasets/WIKI/' + newCompanySymbol + '.json?api_key=' + apiKey + '&start_date=01-01-2017')
                        .then(response=>{
                            const companyInfo = response.data.dataset;
                            const companyData = processQuandlData(companyInfo.data);
                            newCompany.name = companyInfo.name;

                            if (angular.toJson($scope.companies).indexOf(angular.toJson(newCompany)) == -1) {
                                 chart.addSeries({id: newCompanySymbol, name: newCompanySymbol, data: companyData});
                                $scope.companies.push(newCompany);
                                localStorage.setItem('companies', JSON.stringify($scope.companies));
                            }
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
                localStorage.setItem('companies', JSON.stringify($scope.companies));
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
        var value = (x[2]+x[3])/2;
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
        },
        tickInterval: 30 * 24 * 3600 * 1000
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

let socket = io();

const colors = ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee',
            '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'];