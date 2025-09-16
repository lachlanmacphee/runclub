/* eslint-disable no-undef */

onRecordAfterCreateRequest((e) => {
  $app.logger().debug("Emails: Contact Us. Beginning message send...");

  function transformSubject(subject) {
    switch (subject) {
      case "general":
        return "General Enquiry";
      case "sponsor":
        return "Sponsor Enquiry";
      case "fundraising":
        return "Fundraising Enquiry";
      case "advertising":
        return "Advertising Enquiry";
      case "runningTip":
        return "Running Tip";
      default:
        return "Other Enquiry";
    }
  }

  const message = new MailerMessage({
    from: {
      address: "gunnrunnersmelbourne@gmail.com",
      name: "Gunn Runners",
    },
    to: [{ address: "gunnrunnersmelbourne@gmail.com" }],
    subject: transformSubject(e.record.get("subject")),
    html: e.record.get("comments"),
    headers: {
      "Reply-To": `${e.record.get("firstName")} ${e.record.get(
        "lastName"
      )} <${e.record.get("emailAddress")}>`,
    },
  });

  $app.logger().debug("Emails: Contact Us", "message", message);
  $app.newMailClient().send(message);
}, "contact_us_submissions");

routerAdd("GET", "/api/tuesdays", (c) => {
  function getNext12Tuesdays() {
    const next12Tuesdays = [];
    let currentDate = new Date();
    $app.logger().debug("Getting the next 12 Tuesdays...");
    currentDate.setHours(7, 0, 0, 0);

    while (next12Tuesdays.length < 12) {
      if (currentDate.getUTCDay() === 2) {
        const dateToSend = new Date(currentDate);
        dateToSend.setHours(0, 0, 0, 0);
        const formattedDate = dateToSend.toISOString();
        next12Tuesdays.push(formattedDate);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return next12Tuesdays;
  }

  return c.json(200, { message: getNext12Tuesdays() });
});

onRecordAfterDeleteRequest((e) => {
  $app.logger().debug("Volunteer deletion: Beginning email notification...");

  const deletedVolunteer = e.record;
  const runDate = new Date(deletedVolunteer.get("run_date"));
  const currentDate = new Date();
  
  // Calculate hours until run time (assuming run is at 6pm on the run date)
  runDate.setUTCHours(8, 0, 0, 0); // 6pm Melbourne time is 8am UTC (accounting for daylight savings)
  const hoursUntilRun = (runDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60);
  
  $app.logger().debug("Volunteer deletion: Hours until run", "hoursUntilRun", hoursUntilRun);

  // Only send email if deletion is within 48 hours of run time and run is in the future
  if (hoursUntilRun <= 48 && hoursUntilRun > 0) {
    let volunteer_name = "";

    const waiver_id = deletedVolunteer.get("waiver_id");
    const user_id = deletedVolunteer.get("user_id");

    if (waiver_id != "") {
      try {
        const waiver = $app.dao().findRecordById("waivers", waiver_id);
        volunteer_name = waiver.get("fname") + " " + waiver.get("lname");
      } catch (error) {
        $app.logger().debug("Volunteer deletion: Failed to find waiver", "error", error);
        return;
      }
    } else if (user_id != "") {
      try {
        const user = $app.dao().findRecordById("users", user_id);
        volunteer_name = user.get("name");
      } catch (error) {
        $app.logger().debug("Volunteer deletion: Failed to find user", "error", error);
        return;
      }
    } else {
      $app.logger().debug("Volunteer deletion: No waiver_id or user_id found");
      return;
    }

    // Get all admins to notify
    const admins = $app.dao().findRecordsByExpr(
      "users",
      $dbx.exp("role = {:input_role}", {
        input_role: "admin",
      })
    );

    const mailClient = $app.newMailClient();

    // Send email to admins
    admins.forEach((admin) => {
      const admin_name = admin.get("name");
      const admin_email = admin.get("email");

      mailClient.send(
        new MailerMessage({
          from: {
            address: $app.settings().meta.senderAddress,
            name: $app.settings().meta.senderName,
          },
          to: [{ address: admin_email }],
          subject: "Gunnies: Last-Minute Volunteer Cancellation",
          html: `Hey ${admin_name},<br><br>${volunteer_name} has just cancelled their volunteer slot for ${runDate.toDateString()} (${Math.round(hoursUntilRun)} hours before the run).<br><br>You may need to find a replacement volunteer urgently.<br><br>Thanks,<br>GunniesBot`,
        })
      );
    });

    $app.logger().debug("Volunteer deletion: Email notifications sent to admins");
  }
}, "volunteers");

cronAdd("volunteerEmail", "0 20 * * *", () => {
  // Runs at 8pm UTC time each day
  // So it will be roughly 7am local time in Melbourne
  // (dependent on daylight savings)
  var date = new Date();

  // We want to get the next day because volunteer dates are stored in UTC
  // as the day of the run at the 0th hour.
  // Later changed to day after next day as we want to send on Monday morning.
  date.setUTCDate(date.getUTCDate() + 2);
  date.setHours(0, 0, 0, 0);
  $app.logger().debug("Volunteer Notifications: Date", "date", date);

  const todaysVolunteers = $app.dao().findRecordsByExpr(
    "volunteers",
    $dbx.exp("run_date = {:date}", {
      date: date.toISOString().replace("T", " "),
    })
  );

  if (!todaysVolunteers || todaysVolunteers.length === 0) {
    $app
      .logger()
      .debug("Volunteer Notifications: No volunteers found for this day.");
    return;
  }

  $app
    .logger()
    .debug("Volunteer Notifications: Volunteers were found for this day.");

  const mailClient = $app.newMailClient();

  todaysVolunteers.forEach((volunteer) => {
    let volunteer_name = "";
    let volunteer_email = "";

    const waiver_id = volunteer.get("waiver_id");
    const user_id = volunteer.get("user_id");

    $app
      .logger()
      .debug("Volunteer Notifications: Waiver", "waiver_id", waiver_id);

    $app.logger().debug("Volunteer Notifications: User", "user_id", user_id);

    if (waiver_id != "") {
      $app.logger().debug("Volunteer Notifications: If Condition Entered");
      $app.dao().expandRecord(volunteer, ["waiver_id"], null);
      const waiver = volunteer.expandedOne("waiver_id");
      volunteer_name = waiver.get("fname") + " " + waiver.get("lname");
      volunteer_email = waiver.get("email");
    } else if (user_id != "") {
      $app.logger().debug("Volunteer Notifications: Else If Condition Entered");
      $app.dao().expandRecord(volunteer, ["user_id"], null);
      const user = volunteer.expandedOne("user_id");
      volunteer_name = user.get("name");
      volunteer_email = user.email();
    } else {
      $app.logger().debug("Volunteer Notifications: Else Condition Entered");
    }

    $app
      .logger()
      .debug(
        "Volunteer Notifications: Email",
        "volunteer_email",
        volunteer_email
      );

    mailClient.send(
      new MailerMessage({
        from: {
          address: $app.settings().meta.senderAddress,
          name: $app.settings().meta.senderName,
        },
        to: [{ address: volunteer_email }],
        subject: "Gunnies: Volunteer Notifications",
        html: `Hey ${volunteer_name},<br><br>
               You're signed up to volunteer at Gunnies tomorrow! Please arrive at 5:50pm to help set everything up.<br><br>
               You will find the volunteer guide inside the folder. The pin for the lock is <b>GUN</b>.<br><br>
               If you're no longer able to volunteer, please head into the app Volunteers page and remove your name from this week.<br><br>
               Thanks for helping out!`,
      })
    );
  });
});

cronAdd("insufficientVolunteersEmail", "0 1 * * *", () => {
  // 12pm AEST
  var date = new Date();

  date.setUTCDate(date.getUTCDate());
  date.setHours(0, 0, 0, 0);
  $app.logger().debug("Insufficient Volunteers: Date", "date", date);

  const todaysVolunteers = $app.dao().findRecordsByExpr(
    "volunteers",
    $dbx.exp("run_date = {:date}", {
      date: date.toISOString().replace("T", " "),
    })
  );

  const admins = $app.dao().findRecordsByExpr(
    "users",
    $dbx.exp("role = {:input_role}", {
      input_role: "admin",
    })
  );

  if (
    !todaysVolunteers || // there was nothing returned
    todaysVolunteers.length == 0 || // array empty so we can probably assume gunnies is not running
    todaysVolunteers.length >= 3 // theres enough volunteers
  )
    return;

  const mailClient = $app.newMailClient();

  admins.forEach((user) => {
    const user_name = user.get("name");
    const user_email = user.get("email");

    mailClient.send(
      new MailerMessage({
        from: {
          address: $app.settings().meta.senderAddress,
          name: $app.settings().meta.senderName,
        },
        to: [{ address: user_email }],
        subject: "Gunnies: Insufficient Volunteers",
        html: `Hey ${user_name},<br><br>It seems as though we haven't got 3 volunteers for Gunnies tonight. Can you please see if you can fill the missing spots?<br><br>Thanks,<br>GunniesBot`,
      })
    );
  });
});
