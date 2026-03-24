
const db = require('./server/config/db');

async function checkExperiences() {
    try {
        const [rows] = await db.execute('SELECT * FROM consultant_experiences LIMIT 5');
        console.log('--- Current Experiences in DB (First 5) ---');
        console.log(JSON.stringify(rows, null, 2));

        const [count] = await db.execute('SELECT COUNT(*) as count FROM consultant_experiences');
        console.log('\nTotal Experiences:', count[0].count);

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkExperiences();
