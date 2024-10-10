const registerRouter = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const hashPasswordExtension = require("../../services/extension/hashPasswordExtension");

const prisma = new PrismaClient().$extends(hashPasswordExtension)

registerRouter.get("/register", (req, res) => {
    res.render("pages/register.twig"); //le chemin commence à partir du dossier Views
});

registerRouter.post("/register", async (req, res) => {
    try {
        // Vérification que les champs de mot de passe et de confirmation correspondent
        if (req.body.password === req.body.confirm_password) {
            const entreprise = await prisma.entreprise.create({
                data: {
                    siret: req.body.siret,
                    raisonSociale: req.body.raison_sociale,
                    motDePasse: req.body.password, // On stocke le mot de passe haché
                }
            });
            console.log("Entreprise créée avec succès :", entreprise);
            res.redirect("/login");
        } else {
            throw { confirm_password: "Les mots de passe ne correspondent pas" };
        }
    } catch (error) {
        console.log(error);
        res.render("pages/register.twig", { error: error, title: "Inscription Entreprise" });
    }
});

module.exports = registerRouter;
