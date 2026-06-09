import pg from 'pg';

const { Pool } = pg;

const clientPool = new Pool({ connectionString: process.env.DATABASE_CLIENT_URL });

export default clientPool;
