//dependancies
const { Sequelize, DataTypes} = require('sequelize');
const log = require('../logger.js');

//database
const sequelize = new Sequelize('userDB', 'admin', 'AeroMaster64Stinks', {
    dialect: 'sqlite',
    host: 'localhost',
    storage: 'database/userDb.sqlite',
    logging: false
});

//table
const userDB = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true
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
        type: DataTypes.INTEGER,
        defaultValue: null,
        allowNull: true
    }
});

//functions to interact with database
module.exports = {
    name: 'userDB',
    async syncDB(){
        await userDB.sync().then(() => log.info("User database(userDb) has been synced!"));
    },

    async create(id){
        await userDB.create({
            id: id,
            title: null,
            birthday: null,
            color: null
        }).then(() => log.info(`User(${id}) was added to the database userDb.`));
    },

    async edit(id, newTitle, newBirthday, newColor){
        const user = await userDB.findOne({where: {id: id}});

        if(user == null){
            log.warn(`The userDb entry on user-${id} has not been found for editing.`);
            return 1;
        }

        if(newTitle != null){
            await userDB.update({title: newTitle}, {where: {id: id}});
        }

        if(newBirthday != null){
            await userDB.update({birthday: newBirthday}, {where: {id: id}});
        }

        if(newColor != null){
            await userDB.update({color: newColor}, {where: {id: id}});
        }

        return 0;
    },

    async read(id){
        const user = await userDB.findOne({where: {id: id}});

        if(user == null){
            log.warn(`The userDb entry on user-${id} has not been found for accessing.`);
            return 1;
        }

        log.info(`The userDb entry on user-${id} has been accessed.`);
        return user;
    },

    async delete(id){
        const user = await userDB.findOne({where: {id: id}});

        if(user == null){
            log.warn(`The userDb entry on user-${id} has not been found for deletion.`);
            return 1;
        }

        await userDB.destroy({where: {id: id}}).then(() => log.info(`User(${id}) was deleted from userDb.`));
        return 0;
    }
}
