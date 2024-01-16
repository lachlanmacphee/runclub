export const FAQData = [
  {
    question: "Where can I run with a group in Melbourne?",
    answer:
      "Every Tuesday night you can run the Albert Park Lake with the Gunn Runners. We meet at the Limerick Arms Hotel (corner of Clarendon St and Park St) at 6:15pm.",
  },
  {
    question: "How much does it cost?",
    answer:
      "Your first run with us is free (normally it is a nominal fee of $5). The $5 fee goes to the administration of Gunn Runners (eg, insurance, website, etc), charity (eg, Relay for Life and Sacred Heart Mission) or returned to members via subsidised social events. We are a not-for-profit incorporated association.",
  },
  {
    question: "What time do I need to be at the venue?",
    answer:
      "You need to be at the Limerick Arms Hotel by 6:15pm so that we can all be registered by the 6:30pm departure time.",
  },
  {
    question: "How many runners do we get on a Tuesday night?",
    answer:
      "We generally get between 25 and 50 runners on a Tuesday night. We encourage you to stay afterwards for a drink and/or dinner if you have the time.",
  },
  {
    question:
      "Where can I store my bag, valuables and clothing while I'm running?",
    answer:
      "We suggest you leave valuables at work or locked out of sight in your car (limited secured storage is available for your mobile phone and wallet).",
  },
  {
    question:
      "Who supplies the drink on Tuesday nights when we hand our bib in?",
    answer:
      "The Limerick Arms as part of their sponsorship donates a free drink for each runner.",
  },
  {
    question: "Are there promo codes available for upcoming running events?",
    answer:
      "For Run the Pen's 2024 events use the discount code CLUB for 10% off. All Sole Motive's 2024 events have 10% off with promo code SM-MEMBER-GR.",
  },
  {
    question: "What is the history of Gunn Runners?",
    answer:
      'Originally set up 21 years ago by a group of friends, the Gunn Runners met at the Gunn Island Hotel once a week for a simple "Run and a Beer". The format remains much the same, with the group now meeting at the Limerick Arms Hotel in South Melbourne.',
  },
];

export const homeImgLinks = [
  "https://gunnrunners.org.au/wp-content/uploads/2021/02/2021-02-26_12-09-45-700x475.png",
  "https://gunnrunners.org.au/wp-content/uploads/2021/02/2021-02-26_12-19-17-700x475.png",
  "https://gunnrunners.org.au/wp-content/uploads/2019/08/Echuca-Sweat-vs-Steam-2018_-700x475.jpg",
  "https://gunnrunners.org.au/wp-content/uploads/2019/08/Christmas-Run-2018-700x475.jpg",
  "https://gunnrunners.org.au/wp-content/uploads/2021/02/2021-02-26_12-11-04-700x475.png",
  "https://gunnrunners.org.au/wp-content/uploads/2021/02/2021-02-26_12-19-58-671x455.png",
  "https://gunnrunners.org.au/wp-content/uploads/2021/02/2021-02-26_12-23-48-700x475.png",
  "https://gunnrunners.org.au/wp-content/uploads/2021/02/2021-02-26_12-09-45-700x475.png",
];

export const ROLES = {
  MEMBER: "member",
  MODERATOR: "moderator",
  ADMIN: "admin",
};

export const ROUTES = [
  { path: "/", label: "Home", minRole: null },
  { path: "/runs", label: "Runs", minRole: null },
  { path: "/newrun", label: "New Run", minRole: ROLES.MODERATOR },
  { path: "/volunteer", label: "Volunteer", minRole: ROLES.MODERATOR },
  { path: "/leaderboard", label: "Leaderboard", minRole: null },
  { path: "/manage", label: "Manage", minRole: ROLES.ADMIN },
  { path: "/faqs", label: "FAQs", minRole: null },
  { path: "/wiki", label: "Wiki", minRole: ROLES.MODERATOR },
  { path: "/contact", label: "Contact Us", minRole: null },
];

export const distanceOptions = [
  { label: "3.5km", value: "3.5" },
  { label: "5km", value: "5" },
];
