//dependancies
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
    syncDB(){
        userDB.sync().then(() => console.log("User database has been synced!"));
    },

    create(id, title, birthday, color){
        userDB.create({
            id: id,
            title: title,
            birthday: birthday,
            color: color
        }).then(() => console.log("New User was added to database."));
    }
}
