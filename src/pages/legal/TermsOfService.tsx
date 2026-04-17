import React from 'react';

export const TermsOfService: React.FC = () => {
  return (
    <div>
      <h1>Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-8">Last Updated: April 15, 2026</p>

      <section>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using Astro Marriage, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our services.
        </p>
      </section>

      <section>
        <h2>2. Description of Service</h2>
        <p>
          Astro Marriage provides astrological calculations, compatibility reports, and AI-driven insights based on Vedic astrology systems (Parashari, KP, Jaimini, etc.). These services are provided for entertainment and informational purposes only.
        </p>
      </section>

      <section>
        <h2>3. Use of AI</h2>
        <p>
          Our reports utilize Artificial Intelligence to synthesize complex astrological data. Astrology and AI are both interpretive fields. Results are intended to provide perspective and should not be used as the sole basis for major life decisions.
        </p>
      </section>

      <section>
        <h2>4. User Accounts</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate birth information to receive accurate services.
        </p>
      </section>

      <section>
        <h2>5. Payments and Subscriptions</h2>
        <p>
          Certain features require a one-time payment or subscription. All fees are clearly stated at the point of purchase. Payments are processed via Razorpay.
        </p>
      </section>

      <section>
        <h2>6. Disclaimer of Warranty</h2>
        <p>
          ASTROLOGICAL ANALYSIS IS SUBJECTIVE. WE DO NOT GUARANTEE THE ACCURACY, COMPLETENESS, OR RELIABILITY OF ANY CONTENT PROVIDED. OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND.
        </p>
      </section>

      <section>
        <h2>7. Limitation of Liability</h2>
        <p>
          Astro Marriage and NovaVentures AI shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use our services.
        </p>
      </section>

      <section>
        <h2>8. Governing Law</h2>
        <p>
          These terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law principles.
        </p>
      </section>
    </div>
  );
};

export default TermsOfService;
