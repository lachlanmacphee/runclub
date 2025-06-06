export const FAQ_DATA = [
  {
    question: "Where can I run with a group in Melbourne?",
    answer:
      "Every Tuesday night you can run the Albert Park Lake with the Gunn Runners. We meet at the Limerick Arms Hotel (corner of Clarendon St and Park St) at 6pm.",
  },
  {
    question: "How good of a runner do I need to be / what pace do you run at?",
    answer:
      "At Gunnies we cater for a wide range of running abilities and paces with up to 35 minutes to complete either the 3.5km or 5km course.",
  },
  {
    question: "How much does it cost?",
    answer:
      "Your first run with us is free (normally it is a weekly fee of $5). The $5 weekly fee goes to the administration of Gunn Runners (eg, insurance, website, etc), charity (eg, Relay for Life and Sacred Heart Mission) or returned to members via subsidised social events. We are a not-for-profit incorporated association.",
  },
  {
    question: "What time do I need to be at the venue?",
    answer:
      "You need to be at the Limerick Arms Hotel by 6pm so that we can all be registered by the 6:30pm departure time.",
  },
  {
    question: "How do I get there?",
    answer:
      "If you are taking public transport, the Route 1 to South Melbourne Beach and the Route 12 to St Kilda both stop near the Limerick Arms Hotel. By car, you can park in the spaces outside the Limerick or on the street. You may need a parking ticket depending on location. The Limerick Arms Hotel is also only a few kilometres from the city, so bike or e-scooter are also viable means of getting there and are encouraged for environmental reasons.",
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

export const PAST_RESULTS_DOWNLOAD_LINK =
  "https://drive.google.com/file/d/1a0GmwSpOzbJIJfCLiHYv6Cyr5HB5WUGQ/view?usp=sharing";

export const WAIVER_PARAGRAPHS = [
  "The Gunn Runners Incorporated (A0046461M) (Gunn Runners) is a not-for-profit organisation that conducts a weekly social run/walk (the Event), usually over distances of 3km and 5km at Albert Park or surrounds. Gunn Runners Incorporated is run by a 'Crew' of volunteers.",
  "You are required to read and tick the box at the bottom of this waiver form in order to participate in the Event. This is an insurance requirement.",
  "Declaration: I know and understand that running and/or walking is a potentially hazardous activity, and that participation in the Event involves sustained strenuous physical activity that can result in injury or even death. I am medically able and properly trained to participate in the Event, and I am not aware of any medical condition or impairment that will be detrimental to my health if I participate in the Event.",
  "I appreciate and assume any and all risks involved in and associated with participating in the Event, including but not limited to falls, contact with other participants or with other persons, the conditions of the path and/or road, the effects of weather, over-exertion, dehydration, muscular injuries, and ankle, knee or other joint injuries.",
  "Knowing these facts, and in consideration of the acceptance of my participation in the Event, I waive and release The Gunn Runners Incorporated, its officers, servants, agents and representatives, and all instrumentalities or councils responsible for the place where the Event is held, from any and all claims or liabilities arising out of or connected with my participation in the Event, including any injury that I may suffer before, during or after the Event, and whether or not such claim or liability arises out of negligence or carelessness.",
  "I acknowledge that Gunn Runners does not have insurance in respect of personal injury to participants and understand that I should, in my own interests, obtain applicable health insurance.",
  "I acknowledge that photographs may be taken in connection with the Event or other activities organised by The Gunn Runners Incorporated and posted on Facebook. I consent to the publication on the Gunn Runners website or elsewhere of any such photograph in which more than 3 people are depicted. In the case of photographs depicting 3 people or less, the specific consent of each individual will be obtained before any publication of the photograph on the Gunn Runners website.",
  "I agree to abide by the Rules of Association, policies and procedures that may be adopted by the Committee from time to time.",
];

export const ROLES = {
  MEMBER: "member",
  VOLUNTEER: "volunteer",
  MODERATOR: "moderator",
  ADMIN: "admin",
};

export const GUNN_RUNNER_USER_ID = "4s4o3zqi89ro1zt";

export const COLLECTIONS = {
  PARTICIPANT_RUNS: "participant_runs",
};

export const NAV_ROUTES = [
  { path: "/", label: "Home", minRole: null },
  { path: "/runs", label: "Runs", minRole: null },
  { path: "/newrun", label: "Create Run", minRole: ROLES.MODERATOR },
  { path: "/volunteer", label: "Volunteer", minRole: ROLES.MODERATOR },
  { path: "/stats/club", label: "Club Stats", minRole: ROLES.MEMBER },
  { path: "/stats/member", label: "Your Stats", minRole: ROLES.MEMBER },
  { path: "/events", label: "Events", minRole: ROLES.MEMBER },
  { path: "/trivia", label: "Trivia", minRole: ROLES.MEMBER },
  { path: "/manage", label: "Manage", minRole: ROLES.ADMIN },
  { path: "/faqs", label: "FAQs", minRole: null },
  { path: "/wiki", label: "Wiki", minRole: ROLES.ADMIN },
  { path: "/contact", label: "Contact Us", minRole: null },
];

export const LOCATION_OPTIONS = {
  AP_LAKE: "albertParkLake",
  PM_BEACH: "portMelbBeach",
  SM_BEACH: "southMelbBeach",
  TAN: "tanGardens",
};

export const DISTANCE_OPTIONS = [
  { label: "3.5km", value: "3.5" },
  { label: "5km", value: "5" },
];

export const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=-37.8333&longitude=144.9667&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,wind_direction_10m&forecast_days=1";
