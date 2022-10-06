//dependancies
const { EmbedAssertions } = require('@discordjs/builders');
const { Sequelize, DataTypes} = require('sequelize');

//database
const sequelize = new Sequelize('userDB', 'admin', 'AeroMaster64Stinks', {
    dialect: 'sqlite',
    host: 'localhost',
    storage: 'database/userDb.sqlite',
    logging: true
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
        await userDB.sync().then(() => console.log("User database has been synced!"));
    },

    async create(id){
        await userDB.create({
            id: id,
            title: null,
            birthday: null,
            color: null
        }).then(() => console.log("New User was added to database."));

        return 0;
    },

    edit(id, newTitle, newBirthday, newColor){

    },

    async delete(id){
        user = await userDB.findOne({where: {id: id}});

        if(user == null) return 1;

        await userDB.destroy({where: {id: id}}).then(() => console.log("User was deleted."));
        return 0;
    }
}
