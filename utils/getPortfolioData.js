// Function to calculate the total portfolio value
function calculateTotalPortfolioValue(stocks) {
  let totalValue = stocks.reduce((total, { currentPrice, units }) => {
      // Only add to total if currentPrice is available
      if (currentPrice !== undefined && typeof units === 'number') {
        return total + (currentPrice * units);
      }
      return total;
    }, 0);
  
    return parseFloat(totalValue.toFixed(2));
}


// To fix: the weights don't add up to 1 because we don't consider the stocks that don't have a metric > 0
function calculateAverage(metric, stocks, portfolioValue) {
  
  let weightedAverage = 0;
  let positiveCounter = 0; // amount of positive metrics that we take into account

  for (const stock of stocks) {
    const stockValue = stock.totalValue;
    
    
    if (stock[metric] !== undefined) {
      const metricValue = stock[metric];
      
      const stockWeight = stockValue / portfolioValue;
      console.log("Weight of " + stock.ticker + ": ", stockWeight);


      // Only consider positive metric values
      if (metricValue > 0 && stockWeight !== undefined) {
        weightedAverage += stockWeight * metricValue;
        console.log("Weighted average of " + stock.ticker + " for " + metric + ": ", weightedAverage);
      }
    }

  }
  return weightedAverage.toFixed(2);
}

function countPositives(metric, stocks) {
  let positiveCounter = 0;
  const totalStocks = stocks.length;

  for (const stock of stocks) {
    if (stock[metric] > 0) {
      positiveCounter++;
    }
  }
  return positiveCounter/totalStocks;
}




// Export the functions to make them accessible from other files
module.exports = {
    calculateTotalPortfolioValue,
    calculateAverage
};