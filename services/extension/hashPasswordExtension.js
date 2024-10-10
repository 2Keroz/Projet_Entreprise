const { Prisma } = require("@prisma/client");
const bcrypt = require("bcrypt");

module.exports = Prisma.defineExtension({
    query: {
        entreprise: {
            create: async ({ args, query }) => {
                try {
                    // Hachage du mot de passe avant de le stocker
                    const hash = await bcrypt.hash(args.data.motDePasse, 10);
                    args.data.motDePasse = hash;
                    return query(args);
                } catch (error) {
                    throw error;
                }
            }
        }
    }
});
