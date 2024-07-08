// Function to calculate the total portfolio value
function calculateTotalPortfolioValue(stocks) {
    let totalValue = stocks.reduce((total, { currentPrice, units }) => {
        // Only add to total if currentPrice is available
        if (currentPrice !== undefined && typeof units === 'number') {
          return total + (currentPrice * units);
        }
        return total;
      }, 0);
    
      return parseFloat(totalValue.toFixed(2));}

// Function to calculate the average P/E value of the portfolio
function calculateAveragePeRatio(stocks) {
  // GET AVERAGE PE RATIO
  try {
    //Loop through all stocks and calculate the average PE ratio, weighted according to the stock's value in the portfolio
    let totalValue = 0;
    let weightedSum = 0;

    for (const stock of stocks) {
      const stockValue = stock.currentPrice * stock.units; // replace 'value' with the actual property name that represents the stock's value in the portfolio
      const peRatio = stock.peRatio; // replace 'peRatio' with the actual property name that represents the stock's PE ratio

      // Only consider positive PE ratios
      if (peRatio > 0) {
        totalValue += stockValue;
        weightedSum += stockValue * peRatio;
      }
    }

    const averagePeRatio = weightedSum / totalValue;
    console.log("Average PE ratio: ", averagePeRatio);

    return averagePeRatio;
  } catch (e) {
    return console.error("Failed to fetch average PE");
  }
}

// Export the functions to make them accessible from other files
module.exports = {
    calculateTotalPortfolioValue,
    calculateAveragePeRatio
};