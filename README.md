# Big Chungus Bot

It's a Big Chungus themed Discord bot, what more do you want?

## Commands

-   maintenance
    -   Preform maintenance tasks on the bot.
-   status
    -   Get the bot's status.
-   announce
    -   Make announcements.
-   info
    -   Get information about the server or a user.
-   poll
    -   Create a poll with up to 20 answers.
-   roll
    -   Roll up to 15 dice of any size between 2 and 100.
-   database
    -   Allows you to create and delete your personal database entry.
    -   This is for privacy reasons.
-   title
    -   Give yourself a title that the bot uses to refer to you.
-   color
    -   Get a custom color in any server from a list of colors.
-   settings
    -   Change the bot's settings for that specific guild.

## Database

This bot uses MongoDB as its database.  
It stores information such as the user's title and color. It also stores guild information such as the guild settings.

## License

GNU General Public License V3.

## Version

Current Version: `1.5.0`

## Docker

Link to the Docker Hub page: https://hub.docker.com/repository/docker/mentoskapraha/big-chungus-bot  
To run it, please use the `docker-compose.yaml`, you can customize all options inside that file.  
Please make sure that you update the Discord Enviroment Variables to your specific needs, please also make sure the `docker-compose.yaml` is in a seperate directory as it will create volumes in the same directory. Please also use `docker stack` instead of `docker compose`.

## Credits

-   MentoskaPraha
