//dependancies
import { Sequelize, DataTypes } from "sequelize";
import { userDBEntry } from "../types";
import log from "../logger";

//database
const sequelize = new Sequelize("userDB", "admin", "AeroMaster64Stinks", {
    dialect: "sqlite",
    host: "localhost",
    storage: "volume/database/userDb.sqlite",
    logging: false
});

//table
const userDB = sequelize.define("users", {
    id: {
        type: DataTypes.STRING,
        unique: true,
        primaryKey: true,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        defaultValue: "Titleless",
        allowNull: true,
    },
    color: {
        type: DataTypes.STRING,
        defaultValue: "N/A",
        allowNull: true
    },
    colorRoleId: {
        type: DataTypes.STRING,
        defaultValue: "N/A",
        allowNull: true
    }
});

//functions to interact with database
export = {
    name: "userDB",
    async syncDB(){
        await userDB.sync().then(() => log.info("UserDB has been synced!"));
    },

    async create(id: string){
        //check if the user exists
        const user = await userDB.findOne({where: {id: id}});
        if(user != null){ 
            log.warn(`User-${id} already exists in userDB.`);
            return false;
        }

        //create the new user
        await userDB.create({
            id: id,
        }).then(() => log.info(`User-${id} was added to userDB.`));

        return true;
    },

    async edit(id: string, newTitle: string, newColor: string, newColorRoleId: string){
        const user = await userDB.findOne({where: {id: id}});

        //check if the user exists
        if(user == null){
            log.warn(`User-${id} does not exist in userDB (for editing).`);
            return false;
        }

        //update the title
        if(newTitle != null){
            await userDB.update({title: newTitle}, {where: {id: id}});
            log.info(`Updated title for user-${id} in userDB.`);
        }

        //update the color
        if(newColor != null){
            await userDB.update({color: newColor}, {where: {id: id}});
            log.info(`Updated color for user-${id} in userDB.`);
        }

        //update the color role id
        if(newColorRoleId != null){
            await userDB.update({colorRoleId: newColorRoleId}, {where: {id: id}});
            log.info(`Updated colorRoleId for user-${id} in userDB.`);
        }

        return true;
    },

    async read(id: string){
        const user = await userDB.findOne({where: {id: id}});

        //check if the user exists
        if(user == null){
            log.warn(`User-${id} does not exist in userDB (for reading).`);
            return false;
        }

        //conver to userDBEntry object
        const userEntry:userDBEntry = {
            id: user.dataValues.id,
            title: user.dataValues.title,
            color: user.dataValues.color,
            colorRoleId: user.dataValues.colorRoleId
        };

        log.info(`User-${id} in userDB was read.`);

        return userEntry;
    },

    async delete(id: string){
        const user = await userDB.findOne({where: {id: id}});

        //check if the user exists
        if(user == null){
            log.warn(`User-${id} does not exist in userDB (for deleting).`);
            return false;
        }

        //delete the user
        await userDB.destroy({where: {id: id}}).then(() => log.info(`User-${id} was deleted from userDB.`));

        return true;
    },

    async getTitle(id: string){
        const user = await userDB.findOne({where: {id: id}});

        //check if the user exists
        if(user == null){
            log.warn(`User-${id} does not exist in userDB (for reading title).`);
            return "Titleless";
        }

        //get their title
        const title:string = user.toJSON().title;

        log.info(`The userDb entry on user-${id} has been accessed and the title element was read.`);
        return title;
    }
}
