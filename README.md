# Big Chungus Bot

It's a Big Chungus themed Discord bot, what more do you want?  
This bot uses MongoDB as its database. It stores information such as the user's title and color. It also stores guild information such as the guild settings.

Please note that the bot will create a new role for each color it has, these are automatically deleted when colors are disable(so make sure to do that before kicking the bot).

## Developement

If you wish to aid in the bot's developement you may do so. Simple clone this repository to your computer and install the dependancies. You will need to create a `.env` file at the root of the project and customize it to your needs. Here is what that should look like:

```.env
DISCORD_BOT_TOKEN="YOUR_DICORD_BOT_TOKEN_HERE"
DISCORD_BOT_CLIENT_ID="YOUR_DISCORD_BOT_CLIENT_ID_HERE"
DISCORD_BOT_OWNER_ID="YOUR_DISCORD_ID_HERE"
DISCORD_BOT_DB_URI="YOUR_MONGODB_URI_WITH_DATABASE_NAME_HERE"
```

## Commands

-   maintenance
    -   Preform maintenance tasks on the bot.
-   status
    -   Get the bot's status.
-   announce
    -   Make announcements in different channels, can be configured with the settings command.
-   info
    -   Get information about the server or any user.
-   poll
    -   Create a poll with up to 20 answers.
-   roll
    -   Roll up to 15 dice of any size between 2 and 100.
-   database
    -   Allows you to view and delete your database entry.
    -   This is for privacy reasons so that users know what data we store about them.
-   title
    -   Give yourself a title that the bot uses to refer to you.
-   color
    -   Get a custom color in any server from a list of colors.
-   settings
    -   Change the bot's settings for that specific guild.

## Version

Current Version: `1.6.0`

## Docker

Link to the Docker Hub page: [here](https://hub.docker.com/repository/docker/mentoskapraha/big-chungus-bot)  
To run it, please use the `docker-compose.yaml`, you can customize all options inside that file.  
Please make sure that you update the Discord Enviroment Variables to your specific needs, please also make sure the `docker-compose.yaml` is in a seperate directory as it will create volumes in the same directory.

## Credits

-   MentoskaPraha
-   Gljue
