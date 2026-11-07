/* eslint-disable no-undef */

// One-off: existing users are trusted, so mark them as email verified before
// the "verified email required to log in" hook (pb_hooks/main.pb.js) goes live.
migrate(
  (db) => {
    db.newQuery("UPDATE users SET verified = TRUE").execute();
  },
  () => {
    // no-op: we can't know which users were unverified beforehand
  }
);
