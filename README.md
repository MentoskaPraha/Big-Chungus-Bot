# Big Chungus Bot

A funny little Discord bot that does everything me and my friends need from a Discord bot, like schedule events, let us have colored roles, create Discord server quickly and easily, etc.

## Feature List

-   Event Scheduling (Work in Progress)
    -   Handle Discord's scheduled events
    -   Allow people to RSVP
-   Simple Poll's Polls (Work in Progress)
-   Simple Dice Roller
-   Basic commands (Work in Progress)
    -   Info command
    -   Status command
-   Vote Punishement from VC (Work in Progress)
    -   Can be used to mute/kick/ban a person from the VC
    -   Useful for when your friend gets a little too annoying
-   Color System (Work in Progress)
    -   Allows the user to their own custom color
    -   This color is synced across all Big Chungus servers
-   Server Intialiasation (Work in Progress)
    -   Will organise or create the basic channels
    -   Will organise or create the basic roles
    -   Will organise or create the custom soundboards and emojis
-   Whitelisting (Work in Progress)
    -   Gives whitelisted users access to the server on join
    -   There is one global whitelist and each server can enable it's own (This will override the global whitelist)
    -   Whitelists are based on userID
    -   Bots are ignore
-   Server References (Work in Progress)
    -   Each server the bot is in will have invite links to all the others
-   Minigames (Work in Progress)
    -   Can be played across servers
    -   Winning grants you special titles
    -   Leaderboards, positions can grant titles
-   Titles (Work in Progress)
    -   Must be obtained in some shape or form
    -   Each is unique
-   Automatic Birthday Announcements (Work in Progress)
-   Chungus Court (Work in Progress)

## Deployement

Currently not possible as a complete rewrite is in progress, however deployement is planned to be done through Docker.

## Develoment

Contribute to this bot simply fork the repo. For testing purposes a `.env` file at the root of the project is required, it should look like so:

```ini
DEV_ENV=true
DISCORD_TOKEN="Your Discord Bot's TOKEN here."
DISCORD_CLIENT_ID="Your Discord Bot's user ID here."
DISCORD_OWNER_ID="Your Discord user ID here."
```

## Dev To-Do List

-   Re-organise bot structure
    -   Create system for event and command registring for subsystems
-   ~~Rewrite user response handling~~
-   ~~Rewrite embed handling~~
-   Shutdown Handling
-   Rewrite database API to use Redis
