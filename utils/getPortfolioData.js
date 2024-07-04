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
function calculateAveragePEValue() {
    // Add your code here

    
}

// Export the functions to make them accessible from other files
module.exports = {
    calculateTotalPortfolioValue,
    calculateAveragePEValue
};