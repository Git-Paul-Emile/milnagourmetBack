import pkg from "@prisma/client";

const { PrismaClient } = pkg;

const prisma = new PrismaClient();

export const connectToDatabase = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Connecté à la base de données principale");
  } catch (err) {
    console.error("❌ Impossible de se connecter à la base de données", err);
    throw err;
  }
};

export { prisma };