export async function listAccounts(userId, snaptrade_user_secret) {
  const url = process.env.NEXTAUTH_URL + `/api/snaptrade/list-accounts`;
  const data = { userId, snaptrade_user_secret };
  const response = await fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data),
  });
  return response.json();
}
