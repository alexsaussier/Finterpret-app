export default async function getStats(ticker) {
  // API CALL to retrieve stock metrics
  // BETA, EPS, P/E, ...
  const url = process.env.NEXTAUTH_URL + "/api/yahoo-finance/key-statistics";

  const response = await fetch(url, {
    method: "POST",
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      'x-rapidapi-key': '9bd7bf1ab5msh9844a86da9ae0aap142550jsnbd39264e4217',
      'x-rapidapi-host': 'yahoo-finance127.p.rapidapi.com'
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify({ ticker: ticker }), // body data type must match "Content-Type" header
  });
  try{
    return response.json();
  } catch (error) {
    console.error("getStats error: " + error);
  }
}
