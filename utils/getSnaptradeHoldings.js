import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import { listAccounts } from "./listAccounts";

export async function getSnaptradeHoldings() {
  await connectMongo();
  const session = await getServerSession(authOptions);
  const user = await User.findById(session.user.id);
  const userId = user.id;
  const snaptrade_user_secret = user.snaptrade_user_secret;
  const accountId = user.portfolioAccountId;

  const url = process.env.NEXTAUTH_URL + `/api/snaptrade/pull-holdings`;
  //For now, we can automatically fetch the first account, but we will separate the logic once we support multiple accounts
  //I recommend this so that our code is cleaner, specifically the dashboard page file
  if (!snaptrade_user_secret) {
    console.error("User is not connected to Snaptrade");
    return undefined;
  }

  if (!accountId) {
    let accountIdNew = "";
    //Check if there is not account ID in DB-->then list accounts and save the first one

    const accounts = await listAccounts(userId, snaptrade_user_secret);
    console.log("snaptrade accounts: " + accounts.response[0].id);  

    if (accounts.response[0].id) {
      accountIdNew = accounts.response[0].id;
      user.portfolioAccountId = accountIdNew;
      await user.save();
    } else {
      return undefined;
    }
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
