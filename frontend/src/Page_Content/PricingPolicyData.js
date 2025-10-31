import { BASE_URL } from "src/apiClients/config";

export const PricingPolicyData = [
  {
    title: "Introduction",
    content:
      "Atlearn offers a range of subscription plans designed to cater to various needs and preferences. This Pricing Policy provides details on our plans, payment terms, and refund policies.",
  },
  {
    title: "Pricing Plans",
    content: [
      "Free Plan:Provides essential features, including Public / Private Chat, Shared Notes, and Screen Sharing, with limited access and usage restrictions.",
      "Basic Plan:Includes additional features such as Screen Sharing, 15 GB storage, Recordings, etc, for Rs.100 per month, billed monthly.",
      "Pro Plan:Offers advanced features and higher usage limits for Rs. 250 per billed monthly.",
      "Enterprise Plan:Includes 50 GB storage, Multi-User Whiteboard, along with all the features of the Silver Plan, for Rs. 500 per month, billed monthly.",
    ],
  },
  {
    title: "Payment Terms",
    content: [
      "Billing: Charges for Standard, Professional, and Enterprise plans are billed in advance. The payment will be processed through Razorpay.",
      "Trial Period: A free trial is available for 14 days. Users must cancel during the trial period to avoid charges.",
    ],
  },
  {
    title: "Refunds",
    content: [
      "Refunds: Refunds are not available for partial periods or unused services. For any refund-eligible cases, the refund will be processed within 5-7 working days. The credited amount may take additional time to reflect in the customer's bank account depending on the bank's policies.",
      "Cancellation: Users may cancel their subscriptions at any time. Cancellation will be effective at the end of the current billing cycle, and no further charges will be applied.",
    ],
  },
  {
    title: "Price Changes",
    content: [
      "Adjustments: Atlearn reserves the right to change pricing at any time. Users will be notified of any price changes through mail before they take effect.",
    ],
  },
  {
    title: "Contact Information",
    content: `For questions or concerns about our pricing policy, please contact us at 
      <a href="mailto:support@atlearn.in" class="text-blue-600 underline">support@atlearn.in</a> 
      or visit our website at 
      <a href="${BASE_URL}/pricing" class="text-blue-600 underline">${BASE_URL}/pricing</a>.`,
  },
];
