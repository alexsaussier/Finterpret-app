import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

// CHATGPT PROMPT TO GENERATE YOUR TERMS & SERVICES — replace with your own data 👇

// 1. Go to https://chat.openai.com/
// 2. Copy paste below
// 3. Replace the data with your own (if needed)
// 4. Paste the answer from ChatGPT directly in the <pre> tag below

// You are an excellent lawyer.

// I need your help to write a simple Terms & Services for my website. Here is some context:
// - Website: https://shipfa.st
// - Name: ShipFast
// - Contact information: marc@shipfa.st
// - Description: A JavaScript code boilerplate to help entrepreneurs launch their startups faster
// - Ownership: when buying a package, users can download code to create apps. They own the code but they do not have the right to resell it. They can ask for a full refund within 7 day after the purchase.
// - User data collected: name, email and payment information
// - Non-personal data collection: web cookies
// - Link to privacy-policy: https://shipfa.st/privacy-policy
// - Governing Law: France
// - Updates to the Terms: users will be updated by email

// Please write a simple Terms & Services for my site. Add the current date. Do not add or explain your reasoning. Answer:

export const metadata = getSEOTags({
  title: `Terms and Conditions | ${config.appName}`,
  canonicalUrlRelative: "/tos",
});

const TOS = () => {
  return (
    <main className="max-w-xl mx-auto">
      <div className="p-5">
        <Link href="/" className="btn btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </Link>
        <h1 className="text-3xl font-extrabold pb-6">
          Terms and Conditions for {config.appName}
        </h1>

        <pre
          className="leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "sans-serif" }}
        >
          {`Effective Date: 11. 8. 2024

Welcome to Finterpret ("the App"). By accessing or using the App, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the App.

1. Acceptance of Terms
By using Finterpret, you agree to these Terms, which constitute a binding agreement between you and Finterpret.

2. Use of the App
Finterpret is currently in BETA and is offered as a non-commercial, hobby/personal project. The App provides LLM-powered explanations about stocks and metrics based on the user's portfolio. This service is for informational purposes only and should not be construed as financial advice.

3. User Accounts
Account Creation: Users may sign up using Google OAuth or a magic link. You are responsible for maintaining the confidentiality of your account information.
Eligibility: You must be at least 18 years old to use the App.
Account Termination: We reserve the right to suspend or terminate your account at any time, with or without cause, and without notice.

4. No Financial Advice
The information provided by Finterpret is for informational purposes only and does not constitute financial, investment, or legal advice. You should consult with a qualified professional before making any financial decisions.

5. Limitation of Liability
To the fullest extent permitted by law, Finterpret shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from (i) your use or inability to use the App; (ii) any unauthorized access to or use of our servers and/or any personal information stored therein; (iii) any errors or omissions in any content or data; or (iv) any other matter relating to the App.

6. User Data
Data collected through the App is stored securely in a MongoDB database. For more information on how your data is handled, please refer to our Privacy Policy.

7. Beta Disclaimer
As a BETA product, Finterpret is provided "as is" and "as available." The App may have bugs or other issues. We do not guarantee the accuracy, completeness, or reliability of the information provided.

8. Changes to the Terms
We may update these Terms from time to time. If we make significant changes, we will notify you via email or through the App. Continued use of the App after any changes constitute your acceptance of the new Terms.

9. Governing Law
These Terms shall be governed and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law provisions.

10. Contact Information
If you have any questions about these Terms, please contact us at [Your Email Address].`}
        </pre>
      </div>
    </main>
  );
};

export default TOS;
