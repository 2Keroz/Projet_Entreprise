const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()


const authguard = async (req, res, next) => {
    try {
        if (req.session.entreprise) {
            let entreprise = await prisma.entreprise.findUnique({
                where: {
                    siret: req.session.entreprise.siret
                }
            });
            if (entreprise) return next()
            throw { authgard: "Entreprise non connectée" }
        }
        throw { authgard: "Entreprise non connectée" }

    } catch (error) {
        res.redirect("/login")
    }


}

module.exports = authguard