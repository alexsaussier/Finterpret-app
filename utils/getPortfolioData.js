const { sum } = require("lodash");

// Function to calculate the total portfolio value
function calculateTotalPortfolioValue(stocks) {
  
  try{
    let totalValue = stocks.reduce((total, { currentPrice, units }) => {
      // Only add to total if currentPrice is available
      if (currentPrice !== undefined && typeof units === 'number') {
        return total + (currentPrice * units);
      }
      return total;
    }, 0);
  
    return parseFloat(totalValue.toFixed(2));
  }catch (e){
    console.log("could not calculate totalValue of portfolio.")
  }
}

// To fix: the weights don't add up to 1 because we don't consider the stocks that don't have a metric > 0
function calculateAverage(metric, stocks, portfolioValue) {
  
  let weightedAverage = 0;
  const positives = countPositives(metric, stocks);
  let sumOfWeights_positiveStocks = 0;

  for (const stock of stocks) {
    const stockValue = Number(stock.totalValue);
    
    if (stock[metric] !== undefined) {
      const metricValue = Math.max(0, stock[metric]);
      
      const stockWeight = stockValue / portfolioValue;

      // Only consider positive metric values
      if (metricValue > 0 && !isNaN(stockWeight)) {
        sumOfWeights_positiveStocks += stockWeight;

        weightedAverage += stockWeight * metricValue;
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

  // Return as %
  return parseFloat((positiveCounter/totalStocks)*100).toFixed(2);
}




// Export the functions to make them accessible from other files
module.exports = {
    calculateTotalPortfolioValue,
    calculateAverage,
    countPositives
};