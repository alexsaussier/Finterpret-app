import connectMongo from "@/libs/mongoose";
import { listAccounts } from "./listAccounts";

export async function getHoldings(
  userId,
  snaptrade_user_secret,
  accountId,
  user
) {
  await connectMongo();
  const url = `http://localhost:3000/api/snaptrade/pull-holdings`;
  //For now, we can automatically fetch the first account, but we will separate the logic once we support multiple accounts
  //I recommend this so that our code is cleaner, specifically the dashboard page file
  if (!accountId) {
    let accountIdNew = "";
    //Check if there is not account ID in DB-->then list accounts and save the first one

    await listAccounts(userId, snaptrade_user_secret).then((accounts) => {
      if (accounts[0]) {
        accountIdNew = accounts[0].id;
        user.portfolioAccountId = accounts[0].id;
      }
    });
    await user.save();
    const data = { userId, snaptrade_user_secret, accountIdNew };
    const response = await fetch(url, {
      method: "POST",
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json();
  }

  const data = { userId, snaptrade_user_secret, accountId };
  const response = await fetch(url, {
    method: "POST",
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json();
}
