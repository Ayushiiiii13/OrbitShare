const Resource = require('./models/Resource');
const User = require('./models/User');
const sequelize = require('./config/database');

async function dump() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        const users = await User.findAll({ attributes: ['id', 'name', 'email'] });
        console.log('\n--- USERS ---');
        console.table(users.map(u => u.toJSON()));

        const resources = await Resource.findAll({
            include: [{ model: User, attributes: ['name'] }]
        });
        console.log('\n--- RESOURCES ---');
        console.table(resources.map(r => ({
            id: r.id,
            title: r.title,
            uploaderId: r.uploaderId,
            authorName: r.User?.name
        })));

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
}

dump();
