import themes from "daisyui/src/theming/themes.js";

const config = {
  // REQUIRED
  appName: "Finterpret",
  // REQUIRED: a short description of your app for SEO tags (can be overwritten)
  appDescription: "LLM-Powered Analytics for retail investors.",
  // REQUIRED (no https://, not trialing slash at the end, just the naked domain)
  domainName: "Finterpret.co",
  crisp: {
    // Crisp website ID. IF YOU DON'T USE CRISP: just remove this => Then add a support email in this config file (mailgun.supportEmail) otherwise customer support won't work.
    id: "",
    // Hide Crisp by default, except on route "/". Crisp is toggled with <ButtonSupport/>. If you want to show Crisp on every routes, just remove this below
    onlyShowOnRoutes: ["/"],
  },
  stripe: {
    // Create multiple plans in your Stripe dashboard, then add them here. You can add as many plans as you want, just make sure to add the priceId
    plans: [
      {
        // REQUIRED — we use this to find the plan in the webhook (for instance if you want to update the user's credits based on the plan)
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1P7z4TAvu92XwZMPBN6jl9FC"
            : "price_456",
        //  REQUIRED - Name of the plan, displayed on the pricing page
        name: "Monthly Subscription",
        // A friendly description of the plan, displayed on the pricing page. Tip: explain why this plan and not others
        description: "Get full access to all features, billed monthly.",
        // The price you want to display, the one user will be charged on Stripe.
        price: 5.99,
        // If you have an anchor price (i.e. $29) that you want to display crossed out, put it here. Otherwise, leave it empty
        priceAnchor: 9.99,
        features: [
          { name: "Import your portfolio automatically, in real time, with Snaptrade" },
          { name: "Portfolio Metrics" },
          { name: "Tailored Portfolio Reports" },
          { name: "Investment recommendations and optimizations" },
        ],
        mode: "subscription",
      },
      {
        // This plan will look different on the pricing page, it will be highlighted. You can only have one plan with isFeatured: true
        isFeatured: true,
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1P82UFAvu92XwZMPzUMvubpj"
            : "price_456",
        name: "Lifetime Access",
        description: "Pay once, have it forever.",
        price: 49.99,
        priceAnchor: 79.99,
        features: [
          { name: "Import your stock and crypto portfolios" },
          { name: "Portfolio Metrics" },
          { name: "Tailored Portfolio Reports" },
          { name: "Investment recommendations and optimizations" },
          { name: "Lifetime access" },
          { name: "24/7 support" },
        ],
        mode: "payment",
      },
    ],
  },
  aws: {
    // If you use AWS S3/Cloudfront, put values in here
    bucket: "bucket-name",
    bucketUrl: `https://bucket-name.s3.amazonaws.com/`,
    cdn: "https://cdn-id.cloudfront.net/",
  },
  mailgun: {
    // subdomain to use when sending emails, if you don't have a subdomain, just remove it. Highly recommended to have one (i.e. mg.yourdomain.com or mail.yourdomain.com)
    subdomain: "mg",
    // REQUIRED — Email 'From' field to be used when sending magic login links
    fromNoReply: `ShipFast <noreply@sandboxfbe2cdb4113e4ca58e8f982babbc54dc.mailgun.org>`,
    // REQUIRED — Email 'From' field to be used when sending other emails, like abandoned carts, updates etc..
    fromAdmin: "Alex at Finterpret <hello@alexandresaussier.com>",
    // Email shown to customer if need support. Leave empty if not needed => if empty, set up Crisp above, otherwise you won't be able to offer customer support."
    supportEmail: "asaussier99@gmail.com ",
    // When someone replies to supportEmail sent by the app, forward it to the email below (otherwise it's lost). If you set supportEmail to empty, this will be ignored.
    forwardRepliesTo: "asaussier99@gmail.com",
  },
  colors: {
    // REQUIRED — The DaisyUI theme to use (added to the main layout.js). Leave blank for default (light & dark mode). If you any other theme than light/dark, you need to add it in config.tailwind.js in daisyui.themes.
    theme: "lemonade",
    // REQUIRED — This color will be reflected on the whole app outside of the document (loading bar, Chrome tabs, etc..). By default it takes the primary color from your DaisyUI theme (make sure to update your the theme name after "data-theme=")
    // OR you can just do this to use a custom color: main: "#f37055". HEX only.
    main: themes[`[data-theme=lemonade]`]["primary"],
  },
  auth: {
    // REQUIRED — the path to log in users. It's use to protect private routes (like /dashboard). It's used in apiClient (/libs/api.js) upon 401 errors from our API
    loginUrl: "/api/auth/signin",
    // REQUIRED — the path you want to redirect users after successfull login (i.e. /dashboard, /private). This is normally a private page for users to manage their accounts. It's used in apiClient (/libs/api.js) upon 401 errors from our API & in ButtonSignin.js
    callbackUrl: "/dashboard",
  },
};

export default config;
