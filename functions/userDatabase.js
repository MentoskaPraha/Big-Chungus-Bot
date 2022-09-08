//library
const Sequelize = require('sequelize');

//database
const db = new Sequelize('users', 'admin', 'wordpass123', {
    host: 'localhost',
    dialect: 'sqlite',
    loggong: 'false',
    storage: 'database.sqlite'
});

//database entries
const dbEntry = db.define('users', {
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        defaultVaule: 0
    },
    title: Sequelize.STRING,
    birthday: Sequelize.DATEONLY,
    PersonalVcId: {
        type: Sequelize.INTEGER,
        unique: true,
        defaultValue: 0
    },
});

//the functions that will allow the system to interact with the database
module.exports = {
    async initUserDb(){
        await dbEntry.sync();
    }

}