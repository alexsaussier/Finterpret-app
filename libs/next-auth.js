import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
//import LinkProvider from "next-auth/providers/link";

import { MongoDBAdapter } from "@auth/mongodb-adapter";
import config from "@/config";
import connectMongo from "./mongo";

function LinkProvider(options) {
  console.log(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  console.log(options.clientId);
  console.log(options.clientSecret);

  return {

    id: "link",
    name: "Link",
    type: "oauth",
    checks: ["state"],
    authorization: {
      url: `https://login.link.com/auth?key=${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`,
      params: {
        scope: "read_email",
        key: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      },
    },
    token: {
      url: `https://login.link.com/auth/token?key=${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}&client_id=${options.clientId}&client_secret=${options.clientSecret}`,
      params: {
        key: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        client_id: options.clientId,
        client_secret: options.clientSecret
      },
    },
    userinfo: {
      url: `https://login.link.com/access/consumer?key=${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}&livemode=true`,
      params: { livemode: true }
    },
    async profile(profile) {
      console.log(profile);
      return {
        id: profile.email
      };
    },
    options,
  };
}




export const authOptions = {
  // Set any random key in .env.local
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      // Follow the "Login with Google" tutorial to get your credentials
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.given_name ? profile.given_name : profile.name,
          email: profile.email,
          image: profile.picture,
          createdAt: new Date(),
        };
      },
    }),

    
      LinkProvider({
      clientId: process.env.LINK_CLIENT_ID,
      clientSecret: process.env.LINK_SECRET,
    }),
      
    

    // Follow the "Login with Email" tutorial to set up your email server
    // Requires a MongoDB database. Set MONOGODB_URI env variable.
    ...(connectMongo
      ? [
          EmailProvider({
            server: process.env.EMAIL_SERVER,
            from: config.mailgun.fromNoReply,
          }),
        ]
      : []),
  ],
  // New users will be saved in Database (MongoDB Atlas). Each user (model) has some fields like name, email, image, etc..
  // Requires a MongoDB database. Set MONOGODB_URI env variable.
  // Learn more about the model type: https://next-auth.js.org/v3/adapters/models
  ...(connectMongo && { adapter: MongoDBAdapter(connectMongo) }),

  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub;
        session.user.snaptrade_user_secret = token.snaptrade_user_secret;
        session.user.hasAccess = token.hasAccess;
        session.user.portfolio = token.portfolio;
      }
      return session;
    },

    

  },
  session: {
    strategy: "jwt",
  },
  theme: {
    brandColor: config.colors.main,
    // Add you own logo below. Recommended size is rectangle (i.e. 200x50px) and show your logo + name.
    // It will be used in the login flow to display your logo. If you don't add it, it will look faded.
    logo: `/images/LogoLogin.png`,
  },
};
