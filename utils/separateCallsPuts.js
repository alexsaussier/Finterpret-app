export function separateCallsAndPuts(optionPositions) {
  const calls = optionPositions.filter(
    (position) => position.symbol.option_symbol.option_type === "CALL"
  );
  const puts = optionPositions.filter(
    (position) => position.symbol.option_symbol.option_type === "PUT"
  );
  return { calls, puts };
}
