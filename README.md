<a name="readme-top"></a>

<!-- PROJECT SHIELDS -->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<br />
<div align="center">
  <a href="https://github.com/lachlanmacphee/runclub">
    <h3 align="center">Run Club</h3>
  </a>

  <p align="center">
    An open-source all-in-one solution for running club management
    <br />
    <br />
    <a href="https://github.com/othneildrew/Best-README-Template/issues">Report a Bug</a>
    ·
    <a href="https://github.com/othneildrew/Best-README-Template/issues">Request Feature</a>
  </p>
</div>

<!-- ABOUT THE PROJECT -->

## About The Project

Run Club is an open-source solution to managing all the operations of a running club, including timing, volunteers, announcements, blogs, and news. It was built for my local running club which uses bibs to time participants, so most of the development centres around that.

### Built With

- Go Fiber
- HTMX
- Alpine.js

## Getting Started

### Prerequisites

- golang
- air

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/lachlanmacphee/runclub.git
   ```
2. Install the required Golang packages
3. Uncomment the migrations line in `main.go` to setup the database when you first run the app
4. Start the app with the `air` command
5. Close the app and re-comment the migration line in `main.go`
6. Start the app again with the `air` command
7. Go to `http://localhost:5173`

## Real-World Implementations

If you've used Run Club for your local club, please share it with me! I'd love to see the thing I've built in use.

## Roadmap

- [x] Basic Events
- [ ] Accounts
- [ ] Volunteering
- [ ] Blog
- [ ] News
- [ ] Announcements

See the [open issues](https://github.com/lachlanmacphee/runclub/issues) for a full list of proposed features (and known issues).

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement". Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the GNU GPLv3 License. See `LICENSE.txt` for more information.

## Contact

Lachlan MacPhee - contact@lachlanmacphee.com

[contributors-shield]: https://img.shields.io/github/contributors/lachlanmacphee/runclub.svg?style=for-the-badge
[contributors-url]: https://github.com/lachlanmacphee/runclub/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/lachlanmacphee/runclub.svg?style=for-the-badge
[forks-url]: https://github.com/lachlanmacphee/runclub/network/members
[stars-shield]: https://img.shields.io/github/stars/lachlanmacphee/runclub.svg?style=for-the-badge
[stars-url]: https://github.com/lachlanmacphee/runclub/stargazers
[issues-shield]: https://img.shields.io/github/issues/lachlanmacphee/runclub.svg?style=for-the-badge
[issues-url]: https://github.com/lachlanmacphee/runclub/issues
[license-shield]: https://img.shields.io/github/license/lachlanmacphee/runclub.svg?style=for-the-badge
[license-url]: https://github.com/lachlanmacphee/runclub/blob/master/LICENSE.txt
