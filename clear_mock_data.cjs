
const mysql = require('mysql2/promise');
require('dotenv').config({ path: './server/.env' });

async function clearExperiences() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });

    try {
        const [result] = await connection.execute('DELETE FROM consultant_experiences');
        console.log(`✅ Deleted ${result.affectedRows} experiences.`);

        // Also clear skills and tools if they were part of the seed
        const [skills] = await connection.execute('DELETE FROM consultant_competences_cles');
        console.log(`✅ Deleted ${skills.affectedRows} skills.`);

        const [tools] = await connection.execute('DELETE FROM consultant_outils');
        console.log(`✅ Deleted ${tools.affectedRows} tools.`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

clearExperiences();
