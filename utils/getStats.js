export default async function getStats(ticker) {
    // API CALL to retrieve stock metrics
    // BETA, EPS, P/E, ...
    const url = "http://localhost:3000/api/yahoo-finance/key-statistics";
    
    const response = await fetch(url, {
        method: "POST",
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          'X-RapidAPI-Key': '9bd7bf1ab5msh9844a86da9ae0aap142550jsnbd39264e4217',
          'X-RapidAPI-Host': 'yahoo-finance127.p.rapidapi.com'
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(ticker), // body data type must match "Content-Type" header
      });
      console.log(response.json);
    return response.json();
    
}