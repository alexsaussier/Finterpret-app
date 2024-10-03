import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

// CHATGPT PROMPT TO GENERATE YOUR PRIVACY POLICY — replace with your own data 👇

// 1. Go to https://chat.openai.com/
// 2. Copy paste bellow
// 3. Replace the data with your own (if needed)
// 4. Paste the answer from ChatGPT directly in the <pre> tag below

// You are an excellent lawyer.

// I need your help to write a simple privacy policy for my website. Here is some context:
// - Website: https://shipfa.st
// - Name: ShipFast
// - Description: A JavaScript code boilerplate to help entrepreneurs launch their startups faster
// - User data collected: name, email and payment information
// - Non-personal data collection: web cookies
// - Purpose of Data Collection: Order processing
// - Data sharing: we do not share the data with any other parties
// - Children's Privacy: we do not collect any data from children
// - Updates to the Privacy Policy: users will be updated by email
// - Contact information: marc@shipfa.st

// Please write a simple privacy policy for my site. Add the current date.  Do not add or explain your reasoning. Answer:

export const metadata = getSEOTags({
  title: `Privacy Policy | ${config.appName}`,
  canonicalUrlRelative: "/privacy-policy",
});

const PrivacyPolicy = () => {
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
          </svg>{" "}
          Back
        </Link>
        <h1 className="text-3xl font-extrabold pb-6">
          Privacy Policy for {config.appName}
        </h1>

        <pre
          className="leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "sans-serif" }}
        >
          {`Effective Date: 11. 8. 2024

Finterpret ("the App") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, and share information about you when you use the App, and your rights under the General Data Protection Regulation (GDPR) if you are located in the European Economic Area (EEA).

1. Information We Collect
Personal Information: We collect personal information when you sign up for the App, including your name, email address, and profile image.
Stock Data: We collect data related to the stocks you enter, including ticker symbols and the number of units.
General Analysis Data: The App generates and stores LLM-powered explanations about your stocks.

2. How We Use Your Information
To Provide Services: We use your information to provide the features and functionality of the App, including generating stock analyses and managing your portfolio.
To Improve the App: We may use aggregated data to understand how users interact with the App and to make improvements.
Legal Compliance: We may process your personal data to comply with legal obligations, or to protect your vital interests or those of another person.

3. Legal Basis for Processing (for users in the EEA)
If you are located in the EEA, we process your personal data based on the following legal grounds:

Consent: By signing up for the App, you consent to the processing of your personal data as described in this Privacy Policy.
Performance of a Contract: Processing your data is necessary to provide the App’s services under the terms of service.
Legitimate Interests: We may process your data for legitimate business interests, such as improving the App, provided that these interests do not override your rights and freedoms.

4. Data Storage
All data is securely stored in a MongoDB database. We implement reasonable security measures to protect your information, but we cannot guarantee its absolute security.

5. Sharing Your Information
We do not share your personal information with third parties except as necessary to operate the App or as required by law.

6. Data Retention
We retain your personal information for as long as necessary to provide the App and fulfill the purposes described in this Privacy Policy. We may also retain and use your information to comply with our legal obligations, resolve disputes, and enforce our agreements.

7. Your Rights Under GDPR
If you are located in the EEA, you have the following rights regarding your personal data:

Access: You have the right to request access to the personal data we hold about you.
Rectification: You have the right to request that we correct any inaccuracies in your personal data.
Erasure: You have the right to request the deletion of your personal data ("right to be forgotten").
Restriction: You have the right to request that we limit the processing of your personal data.
Portability: You have the right to receive your personal data in a structured, commonly used, and machine-readable format, and to transmit that data to another controller.
Objection: You have the right to object to the processing of your personal data under certain circumstances.
Withdrawal of Consent: Where we rely on your consent to process your personal data, you have the right to withdraw your consent at any time.
To exercise any of these rights, please contact us at [Your Email Address]. We will respond to your request within one month of receipt.

8. International Data Transfers
Your personal data may be transferred to, and processed in, countries other than the country in which you are resident. These countries may have data protection laws that are different from those of your country. We take appropriate safeguards to ensure that your personal data remains protected in accordance with this Privacy Policy when transferred internationally.

9. Children's Privacy
The App is not intended for use by children under the age of 13, and we do not knowingly collect personal information from children under 13.

10. Changes to the Privacy Policy
We may update this Privacy Policy from time to time. If we make significant changes, we will notify you via email or through the App.

11. Contact Information
If you have any questions or concerns about this Privacy Policy, or if you wish to exercise your rights under GDPR, please contact us at [Your Email Address].`}
        </pre>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
