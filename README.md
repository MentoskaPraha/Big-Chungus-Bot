# Big Chungus Bot
It's a Big Chungus themed Discord bot, what more do you want?

## Commands
- maintenance
    - Get ping information and terminate the bot.
- announce
    - Make an announcements.
- info
    - Get information about the server or a user.
- poll
    - Create a poll with up to 20 answers.
- roll
    - Roll, up to 15, dice of any size between 2 and 100.
- database
    - Allows you to create and delete your personal database entry.
    - This is for privacy reasons.
- title
    - Give yourself a title that the bot uses to reference you.
- color
    - Get a custom color in any server.

## Bot Functions
- Automatic event announcements.

## License
GNU General Public License V3. Deployement support will not be provided.

## Version
Current Version: 1.3.4

## Docker
Link to the Docker Hub page: https://hub.docker.com/repository/docker/mentoskapraha/big-chungus-bot  
Please make sure you replace `[]` with the needed parameters.  
Build command: `docker build -t mentoskapraha/big-chungus-bot:[version] --platform linux/amd64 .`  
Run command: `docker run --name big-chungus --env DISCORD_BOT_TOKEN="[your bot token here]" --volume [your volume mount here]:/app/volume mentoskapraha/big-chungus-bot:[version]`  

## Credits
MentoskaPraha