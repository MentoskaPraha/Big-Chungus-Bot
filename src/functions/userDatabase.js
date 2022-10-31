//dependancies
const { Sequelize, DataTypes} = require('sequelize');
const log = require('../logger.js');

//database
const sequelize = new Sequelize('userDB', 'admin', 'AeroMaster64Stinks', {
    dialect: 'sqlite',
    host: 'localhost',
    storage: 'volume/database/userDb.sqlite',
    logging: false
});

//table
const userDB = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        defaultValue: null,
        allowNull: true,
    },
    birthday: {
        type: DataTypes.DATEONLY,
        defaultValue: null,
        allowNull: true
    },
    color: {
        type: DataTypes.STRING,
        defaultValue: null,
        allowNull: true
    },
    colorRoleId: {
        type: DataTypes.STRING,
        defaultValue: null,
        allowNull: true
    }
});

//functions to interact with database
module.exports = {
    name: 'userDB',
    async syncDB(){
        //synchronise the database
        await userDB.sync().then(() => log.info("User database(userDb) has been synced!"));
    },

    async create(id){
        //check if the user exists
        const user = await userDB.findOne({where: {id: id}});

        if(user != null){ 
            log.warn(`User-${id} already exists in userDb.`);
            return 1;
        }

        //create the new user
        await userDB.create({
            id: id,
            title: null,
            birthday: null,
            color: null,
            colorRoleId: null
        }).then(() => log.info(`User-${id} was added to userDb.`));

        //return
        return 0;
    },

    async edit(id, newTitle, newBirthday, newColor, newColorRoleId){
        //find the user
        const user = await userDB.findOne({where: {id: id}});

        //if they don't exist end code
        if(user === null){
            log.warn(`The userDb entry on user-${id} has not been found for editing.`);
            return 1;
        }

        //update the title
        if(newTitle != null){
            await userDB.update({title: newTitle}, {where: {id: id}});
            log.info(`The title part of the userDb entry on user-${id} has been updated.`);
        }

        //update the birthday
        if(newBirthday != null){
            await userDB.update({birthday: newBirthday}, {where: {id: id}});
            log.info(`The birthday part of the userDb entry on user-${id} has been updated.`);
        }

        //update the color
        if(newColor != null){
            await userDB.update({color: newColor}, {where: {id: id}});
            log.info(`The color part of the userDb entry on user-${id} has been updated.`);
        }

        //update the color role id
        if(newColorRoleId != null){
            await userDB.update({colorRoleId: newColorRoleId}, {where: {id: id}});
            log.info(`The colorRoleId part of the userDb entry on user-${id} has been updated.`);
        }

        //return success
        return 0;
    },

    async read(id){
        //find the user
        const user = await userDB.findOne({where: {id: id}});

        //make sure they exist
        if(user === null){
            log.warn(`The userDb entry on user-${id} has not been found for accessing.`);
            return 1;
        }

        //return
        log.info(`The userDb entry on user-${id} has been accessed.`);
        return user;
    },

    async delete(id){
        //find the user
        const user = await userDB.findOne({where: {id: id}});

        //make sure they exist
        if(user === null){
            log.warn(`The userDb entry on user-${id} has not been found for deletion.`);
            return 1;
        }

        //delete the user and return success
        await userDB.destroy({where: {id: id}}).then(() => log.info(`User-${id} was deleted from the userDb.`));
        return 0;
    },

    async getTitle(id){
        //find the user
        const user = await userDB.findOne({where: {id: id}});

        //make sure they exist, if not return a placeholder title
        if(user === null){
            log.warn(`The userDb entry on user-${id} has not been found for accessing.`);
            return "Titleless";
        }

        //get their title
        var title = user.title;

        //if they don't have a title, get a placeholder title
        if(title === null) title = "Titleless"

        //return the title
        log.info(`The userDb entry on user-${id} has been accessed and the title element was read.`);
        return title;
    }
}
