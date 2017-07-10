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

            $scope.addCompany = ()=> {
                const newCompanySymbol = $scope.tickerSymbol;
                // Exit out if no user input
                if (!newCompanySymbol) return;
                
                let newCompany = {
                    ticker_symbol: newCompanySymbol.toUpperCase()
                }

                $http.get('https://www.quandl.com/api/v3/datasets/WIKI/' + newCompanySymbol + '.json?api_key=' + apiKey)
                    .then(response=>{
                        newCompany.name = response.data.dataset.name;
                        // Compare objects works after removing $$hashkey property
                        if (angular.toJson($scope.companies).indexOf(angular.toJson(newCompany)) == -1) {
                            $scope.companies.push(newCompany);
                        }
                        // Todo: Graph on chart
                        plotChart(response.data.dataset.name, response.data.dataset.data);
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

const plotChart = (name, data)=> {
    Highcharts.chart('chart', {
        chart: {
            zoomType: 'x'
        },
        title: {
            text: name
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                    'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: 'Volume'
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },

        series: [{
            type: 'area',
            name: name,
            data: data
        }]
    });
};

$('.company').fadeIn('slow');

var socket = io();