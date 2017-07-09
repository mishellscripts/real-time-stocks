# Charting the Stock Market
### User stories
1) I can view a graph displaying the recent trend lines for each added stock.
    - Will use [Highcharts](https://www.highcharts.com/) to display trend lines based on market data from [Quandl API](https://docs.quandl.com/) 
2) I can add new stocks by their symbol name.
3) I can remove stocks.
4) I can see changes in real-time when any other user adds or removes a stock. For this you will need to use Web Sockets.
    - Used [Socket.io](https://socket.io/) to view changes in real time across different connections.

### Other technologies used:
- Back-end: MongoDB, ExpressJS, NodeJS
- Front-end: HTML (Pug), CSS, AngularJS
