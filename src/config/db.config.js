const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@supabase/supabase-js');
const logger = require('./logger.config');

// Initialize Prisma client
const prisma = new PrismaClient();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create Supabase client with anonymous key (for client-side operations)
const supabase = createClient(supabaseUrl, supabaseKey);

// Create Supabase admin client with service role key (for server-side operations)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Connect to the database
const connectDB = async () => {
  try {
    await prisma.$connect();
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Database connection failed:', error);
    process.exit(1);
  }
};

module.exports = {
  prisma,
  supabase,
  supabaseAdmin,
  connectDB
};