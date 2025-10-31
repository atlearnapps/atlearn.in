import { BASE_URL } from "src/apiClients/config";

export const CancellationRefundPolicyData = [
  {
    title: "Cancellation of Subscription",
    content: [
      "Users may cancel their subscriptions at any time through their account settings.",
      "Upon cancellation, users will retain access to the features until the end of the current billing cycle.",
      "No further charges will be made after cancellation.",
    ],
  },
  {
    title: "Refund Policy",
    content: [
      "Refunds: Refunds are not available for partial periods or unused services. For any refund-eligible cases, the refund will be processed within 5-7 working days. The credited amount may take additional time to reflect in the customer's bank account depending on the bank's policies.",
      "Cancellation: Users may cancel their subscriptions at any time. Cancellation will be effective at the end of the current billing cycle, and no further charges will be applied.",
    ],
  },
  {
    title: "Shipping / Delivery Policy",
    content: [
      "At Atlearn, we provide digital products and services, which are available for access immediately after purchase or subscription. Since our offerings are entirely digital, no physical shipping or delivery is required.",
      "Subscriptions to our services are automatically billed based on the agreed subscription plan. You will continue to have uninterrupted access to our digital services unless you cancel your subscription before the renewal date.",
    ],
  },

  {
    title: "Contact Information",
    content: [
      `For questions or concerns about our pricing policy, please contact us at 
      <a href="mailto:support@atlearn.in" class="text-blue-600 underline">support@atlearn.in</a> 
      or visit our website at 
      <a href="${BASE_URL}/pricing" class="text-blue-600 underline">${BASE_URL}/pricing</a>.`,
    ],
  },
];
