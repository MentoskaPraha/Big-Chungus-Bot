//library
const Sequelize = require('sequelize');

//database
const db = new Sequelize('users', 'admin', 'wordpass12', {
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
    title: {
        type: Sequelize.STRING,
        defaultValue: "",
    },
    birthday: {
        type: Sequelize.DATEONLY,
        defaultValue: 0
    },
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
    },

    addEntry(id, title, birthday, PersonalVcId){
        //create a new entry
        try {
            const entry = dbEntry.new({
                id: id,
                title: title,
                birthday: birthday,
                PersonalVcId: PersonalVcId 
            });

            return 0;
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
				return 1;
			}

			return 2;
        }
    },

    async getEntry(id){
        //get a vailid tag
        const entry = await dbEntry.findOne({where: {id: id}});

        if(!entry) return null;

        return entry;
    },

    async editEntry(id, newTitle, newBirthday, newPersonalVcId){
        //edit a tag
        var editedTags = 0;

        if(newTitle != null){
            editedTags += dbEntry.update({ title: newTitle }, { where: { id: id } });
        }

        if(newBirthday != null){
            editedTags += dbEntry.update({ title: newTitle }, { where: { id: id } });
        }

        if(newPersonalVcId != null){
            editedTags += dbEntry.update({ title: newTitle }, { where: { id: id } });
        }

        if(!editedTags >= 1){
            return 1;
        }

        return 0;
    }
}
