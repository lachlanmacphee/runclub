# runclub

## Intro

Hey there! This codebase contains an end-to-end solution for managing a running club. I designed and built this for Gunn Runners South Melbourne (we call it the Gunnies App).

Feel free to fork the repository and adapt it to your own running club needs. If you add anything cool, more than happy to review any PRs you might have.

## Features

1. Time-tracking - a beautiful UI and stopwatch to update a run leaderboard live (note: our club uses bibs so it's setup for this)
2. View the leaderboard for current and past runs
3. Volunteer management - plan ahead for the next 12 weeks on who will volunteer
4. Track your performance over time with individual and club stats. We run 5k and 3.5k events. You will need to modify the code if you want to change the distances
5. Event management - admins can add events so that club members can see what's coming up
6. Admin panel - manage who is admin, search waivers, add banners, etc
7. Trivia - a fun way to keep club members engaged. We check the scores of this each year and announce winners.
8. Wiki page to hold all of your knowledge so it doesn't get lost over time.
9. FAQs page, PWA support, and much more. Customise to suit you!

## Deployment

Our setup is as follows:

- Frontend hosted on Vercel using the GitHub integration.
- Backend (Pocketbase) hosted on a fly.io $5 per month VPS. Everything you need for deployment is included in the `pocketbase/` directory.
