const loginRouter = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

// Route pour afficher le formulaire de connexion
loginRouter.get("/login", (req, res) => {
    res.render("pages/login.twig");
});

// Route pour traiter la soumission du formulaire de connexion
loginRouter.post("/login", async (req, res) => {
    try {

        const entreprise = await prisma.entreprise.findUnique({
            where: { siret: req.body.siret }
        });

        if (entreprise) {
            const passwordMatch = await bcrypt.compare(req.body.password, entreprise.motDePasse);
            if (passwordMatch) {
                req.session.entreprise = entreprise; 
                console.log("Connexion réussie pour l'entreprise :", entreprise.raisonSociale);
                res.redirect('/');
            } else {
                throw { password: "Mot de passe incorrect" };
            }
        } else {
            throw { siret: "Numéro de SIRET inexistant" };
        }
    } catch (error) {
        console.error(error);
        res.render("pages/login.twig", {
            error: error.password || error.siret || "Erreur de connexion"
        });
    }
});

module.exports = loginRouter;
