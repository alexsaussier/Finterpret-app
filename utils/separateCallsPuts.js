export function separateCallsAndPuts(optionPositions) {
  const calls = optionPositions.filter(
    (position) => position.optionType === "CALL"
  );
  const puts = optionPositions.filter(
    (position) => position.optionType === "PUT"
  );
  return { calls, puts };
}
