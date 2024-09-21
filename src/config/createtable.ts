// // scripts/createTable.ts
// import pool from '@/config/db';

// async function createTable() {
//     const createTableQuery = `
//     CREATE TABLE IF NOT EXISTS users (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         name VARCHAR(100) NOT NULL,
//         email VARCHAR(100) UNIQUE NOT NULL,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     );
//     `;

//     try {
//         const connection = await pool.getConnection();
//         await connection.query(createTableQuery);
//         console.log('Table created or already exists.');
//         connection.release();
//     } catch (error) {
//         console.error('Error creating table:', error);
//     }
// }

// createTable();
