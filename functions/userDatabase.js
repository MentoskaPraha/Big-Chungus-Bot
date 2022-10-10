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
        await userDB.sync().then(() => log.info("User database has been synced!"));
    },

    async create(id){
        await userDB.create({
            id: id,
            title: null,
            birthday: null,
            color: null
        }).then(() => log.info(`User(${id}) was added to the database`));
    },

    edit(id, newTitle, newBirthday, newColor){

    },

    async delete(id){
        user = await userDB.findOne({where: {id: id}});

        if(user == null){
            log.warn(`User(${id}) for deletion was no found.`);
            return 1;
        }

        await userDB.destroy({where: {id: id}}).then(() => log.info(`User(${id}) was deleted.`));
        return 0;
    }
}
