const loginRouter = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

// Fonction pour échapper les caractères spéciaux
function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

// Route pour afficher le formulaire de connexion
loginRouter.get("/login", (req, res) => {
    res.render("pages/login.twig");
});

// Route pour traiter la soumission du formulaire de connexion
loginRouter.post("/login", async (req, res) => {
    try {
        const siret = escapeHtml(req.body.siret);
        const password = req.body.password; // Ne pas échapper le mot de passe

        const entreprise = await prisma.entreprise.findUnique({
            where: { siret: siret }
        });

        if (entreprise) {
            const passwordMatch = await bcrypt.compare(password, entreprise.motDePasse);
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