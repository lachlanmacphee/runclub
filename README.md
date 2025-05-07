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

### Overview

At Gunn Runners South Melbourne, we use the following setup:

- Frontend hosted on Vercel using the GitHub integration. This means that every change we make to the source code (once pushed) is automatically updated on the frontend.
- Backend (Pocketbase) hosted as an app on fly.io for $5 per month. Everything you need for deployment is included in the `pocketbase/` directory. Simply follow fly.io's guide to launching an app.

That being said, you can host the frontend anywhere you can put files for a static site, and you can host the backend anywhere where you can have a persistent volume (as Pocketbase uses SQLite for the database).

### Guide

While the setup above works for us, I'd recommend just going with 1 VPS for deployment that has both the static site files and backend on it. As such, the guide below will walk you through roughly how to set that up. If you know what you're doing, feel free to adjust things as you see fit, but if you just want a guide on how to get up and running with a minimal and secure setup, this should hopefully cover a majority of it!

#### Step 1: Get a VPS

This is highly dependent on which region your running club is in. I can give you some recommendations, but you might wish to do your own research on what the best bang for the buck VPS hosting in your area is.

Look into providers like DigitalOcean, Hetzner, OVHCloud. If you're in Australia, I can highly recommend BinaryLane. It's nothing fancy but has incredible bang for buck.

Recommended Specs:

- Debian-based OS (I'd go with Ubuntu Server)
- 1 VCPU
- 1GB of Memory
- 20GB of NVME Storage

I really don't think you need anything much higher than this to run a simple static site + lightweight backend for a running club.

#### Step 2: Setup the VPS

For security's sake, ensure that you switch away from password-based SSH to an SSH key (there are plenty of guides online for this), and limit the IP ranges of who can SSH. You can do this with the `ufw` tool using the command `sudo ufw allow from <replace-with-ip> to any port 22`. This will mean only the IP you specify can SSH into the machine.

You'll also need to install `nvm` on your machine which you can do with one command. See [this guide](http://github.com/nvm-sh/nvm) for instructions. Once `nvm` is installed, run `nvm install stable` to get the latest stable version of `Node.js` and `npm`.

Also, you'll need to install Docker. Follow the guide [here](https://docs.docker.com/engine/install/ubuntu/) if you're on an Ubuntu install, otherwise check [this](https://docs.docker.com/engine/install/) out for other distros.

#### Step 3: Get a domain

Buy a domain if you don't have one already and setup the following DNS records:

- An A record with the host as `@` pointing to your VPS IPv4 IP
- An A record with the host as `www` pointing to your VPS IPv4 IP
- An A record with the host as `pb` pointing to your VPS IPv4 IP

#### Step 4: Clone this repo and edit some stuff

From your home folder of the VPS (run `cd ~` to get there), clone this repo with the command `git clone https://github.com/lachlanmacphee/runclub.git`.

Then run the command `cd runclub` and then `rm -r .git` to remove the git source control files (you won't need this if you just want to deploy).

Then run the following commands (make sure to edit the names) to change the name from `Gunn Runners` to whatever your club is called:

```bash
find ~/runclub -type f -exec sed -i 's/Gunn Runners/<your club name here>/g' {} \;
find ~/runclub -type f -exec sed -i 's/gunniesapp/<your club name here in lowercase with no spaces>app/g' {} \;
```

Then run the following commands (make sure to edit your domain) to change the domain of the backend:

```bash
find ~/runclub -type f -exec sed -i 's/gunniesapp.fly.dev/pb.yourdomain.com/g' {} \;
```

#### Step 5: Build the frontend

Run the following commands to build the frontend:

```
npm i
npm run build
```

#### Step 6: Create the necessary files

I intentionally haven't included these in the repo because I think it's important to understand what's in them and you'll need to edit some stuff to ensure it works for your setup.

Assuming you're still in the `runclub` directory, run the command `nano docker-compose.yml` and paste the following, then hit `CTRL+X`, enter `y`, and hit enter to save the file.

```yaml
services:
  pocketbase:
    build: ./pocketbase
    restart: unless-stopped
    networks:
      - network
    ports:
      - "127.0.0.1:8080:8080"
    volumes:
      - "./pocketbase-data:/pb/pb_data"
  caddy:
    image: caddy:latest
    ports:
      - "80:80"
      - "443:443"
      - "443:443/udp"
    networks:
      - network
    volumes:
      - $PWD/Caddyfile:/etc/caddy/Caddyfile
      - $PWD/dist:/srv
      - caddy_data:/data
      - caddy_config:/config
    depends_on:
      - tbh

volumes:
  caddy_data:
  caddy_config:

networks:
  network:
    driver: bridge
```

The next and only other file you need to create is with the command `nano Caddyfile`, then paste the following, being sure to edit the domains, and then hit `CTRL+X`, enter `y`, and hit enter to save the file.

```
pb.yourdomain.com {
    reverse_proxy pocketbase:8080
}

yourdomain.com {
    root * /srv
    encode gzip
    file_server
}
```

Now run `docker compose up` and see if there are any errors. If so, feel free to raise an issue and I can help you to diagnose them. If there are no errors, hit `CTRL+C` to gracefully stop the containers, then run `docker compose up -d` to run them again in detached mode. You should be able to go to `pb.yourdomain.com` now and setup your Pocketbase admin account (make sure to use a strong admin password, ideally 20+ characters).

#### Step 7: Import the Pocketbase schema

This is the final step, nice work if you've got up to this point, you're nearly there! Manually download the `pb_schema.json` file from the `/pocketbase` folder of the repo and use Pocketbase's import schema feature to setup all the required tables.

You should now be able to go to `yourdomain.com` and see the frontend.

#### Optional extras

If you want to enable Google sign in you'll need to set this up in the Pocketbase admin console. I will not provide the steps here for setting up on the Google Cloud side as there are plenty of guides online to do that. That being said, if you run into trouble I'm more than happy to help you if you raise an issue.

If you've found anything incorrect with these docs, please feel free to raise an issue on the GitHub repo, or raise a PR if you know how to fix!

## Backups

We use Pocketbase's built-in backup system with our S3-compatible object storage provider Backblaze to run weekly backups. You might want to backup more frequently if you run multiple runs per week.
