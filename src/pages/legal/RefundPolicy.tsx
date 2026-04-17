import React from 'react';

export const RefundPolicy: React.FC = () => {
  return (
    <div>
      <h1>Refund & Cancellation Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last Updated: April 15, 2026</p>

      <section>
        <h2>1. Digital Products</h2>
        <p>
          Astro Marriage provides digital content, including astrological reports and AI-generated insights. Due to the digital nature of these products, they are typically delivered immediately upon successful payment.
        </p>
      </section>

      <section>
        <h2>2. Refund Eligibility</h2>
        <h3>2.1 Successful Reports</h3>
        <p>
          Once a report has been generated and displayed or sent to you, the service is considered "consumed." We do not offer refunds for reports based on the "accuracy" of astrological interpretations, as astrology is an interpretive science.
        </p>
        
        <h3>2.2 Technical Failures</h3>
        <p>
          If a technical error prevents you from accessing a paid report or if the system fails to generate a report after a successful payment, you are eligible for a full refund or a credit to reproduce the report.
        </p>

        <h3>2.3 Erroneous Transactions</h3>
        <p>
          In case of duplicate payments or incorrect amounts charged due to technical glitches, we will process a refund for the excess amount.
        </p>
      </section>

      <section>
        <h2>3. Cancellation Policy</h2>
        <p>
          For one-time report purchases, cancellations are not possible once the payment is processed and the report generation has started.
        </p>
        <p>
          For subscription-based plans (if applicable), you can cancel your subscription at any time through your account settings. The cancellation will take effect at the end of the current billing cycle.
        </p>
      </section>

      <section>
        <h2>4. Refund Process</h2>
        <p>
          To request a refund for technical reasons, please contact us at support@marriage-astro.com with your transaction ID and details of the issue.
        </p>
        <p>
          Approved refunds will be processed back to the original payment method within 5-7 working days, subject to the policies of our payment partner (Razorpay) and your bank.
        </p>
      </section>
    </div>
  );
};

export default RefundPolicy;
