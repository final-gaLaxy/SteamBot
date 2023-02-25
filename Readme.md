<a name="top"></a>

<!-- PROJECT SHIELDS -->
[![Stars][stars-shield]][stars-url]
[![MIT License][license-shield]][license-url]


<h3 align="center">Node.js Steam Bot</h3>

<p align="center"><strong>Note: This project is old and may not work in its current state.</strong></p>

<p align="center">
A simple Node.js Steam bot for trading csgo items and accepting donations. This bot requires mobile Steam Guard to be enabled.
</p>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Available Commands](#available-commands)
- [License](#license)

</details>

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

* Node.js installed on your machine.

* A Steam account with mobile Steam Guard enabled.

* The Identity Secret and Shared Secret for your Steam account's mobile authentication.

### Installation

1. Clone this repository to your local machine using `git clone https://github.com/final-gaLaxy/SteamBot.git`.
2. Navigate to the directory where the repository was cloned and install the required dependencies with `npm i`.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
### Usage
1. Copy `config/config.json.sample` file and rename it to `config.json`.
2. Open `config.js` and fill in the necessary information and desired bot settings (username, password, shared secret, identity secret, etc.).
3. Save the `config.json` file.
4. (Optional) Edit `messages.json` as per your preferences.
5. Run the bot using `npm start`.

<p align="right">(<a href="#top">back to top</a>)</p>

### Available Commands
This bot currently supports the following commands :
* `!help`: Displays the available commands. Note that this command does not display admin commands.
* `!csgo`: Sends all of the bot's CSGO items to the owner of the bot. This command is only available to the bot's owner.
* `!steam`: Sends all of the bot's Steam items to the owner of the bot. This command is only available to the bot's owner.
* `!game [gameid]`: Changes the game being played by the bot to the game with the specified `gameid`. Replace `[gameid]` with the Steam game ID of the desired game. This command is only available to authorized users.

Note: This is not an exhaustive list of available commands. Use !help to see all available commands.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
[stars-shield]: https://img.shields.io/github/stars/final-gaLaxy/SteamBot.svg?style=for-the-badge
[stars-url]: https://github.com/final-gaLaxy/SteamBot/stargazers
[license-shield]: https://img.shields.io/github/license/final-gaLaxy/SteamBot.svg?style=for-the-badge
[license-url]: https://github.com/final-gaLaxy/SteamBot/blob/master/LICENSE.txt