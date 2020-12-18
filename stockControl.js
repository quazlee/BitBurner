const LOWEST_TRADABLE_FORECAST = 0.57 - 0.5;
const commission = 100000;

export async function main(ns) {
    const startTime = (new Date()).getTime();
    let stocks = [];
    let stockSymbols = ns.getStockSymbols();
    for (let i = 0; i < stockSymbols.length; i++)
        stocks.push({ symbol: stockSymbols[i] });

    let purchasedStocks = [];

    const startMoney = ns.args[0] || ns.getServerMoneyAvailable("home");
    let freeMoney = startMoney;
    let moneyInStocks = 0;
    let totalMoney;

    let silent = ns.args[1] || "false";



    while (true) {

        //Updates Stock Information
        moneyInStocks = updateStocks(ns, stocks, purchasedStocks);
        totalMoney = moneyInStocks + freeMoney;

        //Checks to see if there is an Information Request
        const msg = ns.read(20);
        if (msg != "NULL PORT DATA" && msg == "stockUpdate") {
            ns.tprint("-------------Stock Controller-------------");
            ns.tprint("");
            ns.tprint("--General--");
            ns.tprint("");
            ns.tprint(`Total Money - ${format(totalMoney)}`);
            ns.tprint(`Money in Stocks - ${format(moneyInStocks)}`);
            ns.tprint(`Reserved Money - ${format(freeMoney)}`);
            ns.tprint(`Total Profit - ${format(totalMoney - startMoney)} (${(((totalMoney - startMoney) / startMoney) * 100).toFixed(3)}%)`);
            ns.tprint(`Lowest Tradable Forecast - ${LOWEST_TRADABLE_FORECAST + .5}`);
            ns.tprint(`Time Running - ${(((new Date()).getTime() - startTime)/60000).toFixed(3)}`);
            ns.tprint("");
            if (purchasedStocks.length > 0) {
                ns.tprint("--Stocks--");
                ns.tprint("");

                purchasedStocks.forEach((stock) => {
                    ns.tprint(`${stock.symbol} - ${format(stock.shares, false)} shares at ${format(ns.getStockPrice(stock.symbol))}`);
                });
                ns.tprint("");
            }
            ns.tprint("------------------------------------------");
        }

        let newStocks = {};

        let moneyRemaining = true;
        let money = totalMoney - ((10-purchasedStocks.length) * commission);
        
        for (let i = 0; moneyRemaining && i < stocks.length; i++) {
            
            let stock = stocks[i];
            
            if (stock.forecast > LOWEST_TRADABLE_FORECAST) {
                
                let numShares = Math.floor((money) / stock.askPrice);
                
                if (numShares > stock.maxShares) {
                    numShares = stock.maxShares;
                } else {
                    moneyRemaining = false;
                }

                newStocks[stock.symbol] = [stock, numShares];

                money -= numShares * stock.askPrice - commission;
                if (money <= 0) moneyRemaining = false;
            }
        }

        //Sell any unwanted shares
        purchasedStocks.forEach((stock) => {
            if (stock.symbol in newStocks) {
                if (stock.shares > newStocks[stock.symbol][1]  && ((stock.shares-newStocks[stock.symbol][1]) * stocks[0].validity * stocks[0].bidPrice) > commission) {
                    freeMoney += sell(ns, stock, stock.shares - newStocks[stock.symbol][1], silent);
                }
            } else {
                freeMoney += sell(ns, stock, stock.shares, silent);
            }
        });

        //Buy Shares
        for (let sym in newStocks) {
            let stock = newStocks[sym][0];
            let numShares = newStocks[sym][1]; //target number of shares
            if (stock.shares < numShares && (numShares * stocks[0].validity * stocks[0].bidPrice) > commission) {
                freeMoney -= buy(ns, stock, numShares - stock.shares, silent);
            }
        }

        await ns.sleep(12200);
    }
}

//Updates information about every stock (held in the stocks array)
function updateStocks(ns, stocks, purchasedStocks) {
    let moneyInStocks = 0;
    purchasedStocks.length = 0; //resets purchased Stocks
    for (let i = 0; i < stocks.length; i++) {
        let symbol = stocks[i].symbol;
        stocks[i].askPrice = ns.getStockAskPrice(symbol);
        stocks[i].bidPrice = ns.getStockBidPrice(symbol);
        stocks[i].shares = ns.getStockPosition(symbol)[0];
        stocks[i].maxShares = ns.getStockMaxShares(symbol);
        stocks[i].buyPrice = ns.getStockPosition(symbol)[1];
        stocks[i].volatility = ns.getStockVolatility(symbol);
        stocks[i].forecast = (ns.getStockForecast(symbol) - 0.5);
        stocks[i].validity = stocks[i].volatility * (2 * stocks[i].forecast) / 2;
        moneyInStocks += stocks[i].bidPrice * stocks[i].shares;
        if (stocks[i].shares > 0) purchasedStocks.push(stocks[i]);
    }
    stocks.sort(function (a, b) { return b.validity - a.validity });
    return moneyInStocks;

}

//Formats outgoing numbers to use Letters
function format(num, isMoney = true) {
    let symbols = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc"];
    let i = 0;
    let n = Math.abs(num);
    for (; (n >= 1000) && (i < symbols.length); i++) n /= 1000;

    return (isMoney ? ((Math.sgn(num) < 0) ? "-$" : "$") : "") + n.toFixed(3) + symbols[i];
}

//Buys shares
function buy(ns, stock, numShares, silent) {
    ns.buyStock(stock.symbol, numShares);
    if (silent == "false") ns.tprint(`Bought ${format(numShares, false)} shares in ${stock.symbol} for ${format(stock.askPrice)}`);
    return numShares * stock.askPrice + commission;
}

//Sells share
function sell(ns, stock, numShares, silent) {
    let profit = numShares * (stock.bidPrice - stock.buyPrice) - 2 * commission;
    if (silent == "false") ns.tprint(`Sold ${format(numShares, false)} shares in ${stock.symbol} for a profit of ${format(profit)}`);
    ns.sellStock(stock.symbol, numShares);
    return numShares * stock.bidPrice - commission;
}
