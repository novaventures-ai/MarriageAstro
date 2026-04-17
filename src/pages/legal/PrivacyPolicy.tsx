import React from 'react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div>
      <h1>Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last Updated: April 15, 2026</p>

      <section>
        <h2>1. Introduction</h2>
        <p>
          Welcome to Astro Marriage ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our astrology-based compatibility services.
        </p>
      </section>

      <section>
        <h2>2. Information We Collect</h2>
        <h3>2.1 Personal Information</h3>
        <p>
          To provide accurate astrological analysis, we collect:
        </p>
        <ul>
          <li><strong>Birth Details:</strong> Name, date of birth, time of birth, and place of birth.</li>
          <li><strong>Contact Information:</strong> Email address (when you create an account).</li>
          <li><strong>Account Information:</strong> Credentials and profile settings.</li>
        </ul>
        
        <h3>2.2 Payment Information</h3>
        <p>
          We use third-party payment processors (Razorpay) to handle payments. We do not store your credit card or bank details on our servers. Razorpay collected information is governed by their own privacy policy.
        </p>
      </section>

      <section>
        <h2>3. How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Calculate astrological charts and compatibility reports.</li>
          <li>Provide personalized AI-driven astrological insights.</li>
          <li>Process your transactions and manage your subscription.</li>
          <li>Send administrative information, such as security alerts or product updates.</li>
          <li>Improve our calculation engines and user experience.</li>
        </ul>
      </section>

      <section>
        <h2>4. Data Security</h2>
        <p>
          We implement appropriate technical and organizational security measures to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.
        </p>
      </section>

      <section>
        <h2>5. Your Rights</h2>
        <p>
          Depending on your location, you may have rights to access, correct, or delete your personal data. You can manage your birth data directly through your dashboard or contact us for account deletion.
        </p>
      </section>

      <section>
        <h2>6. Contact Us</h2>
        <p>
          If you have questions or comments about this policy, you may email us at: support@marriage-astro.com
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
