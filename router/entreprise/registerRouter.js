const registerRouter = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const hashPasswordExtension = require("../../services/extension/hashPasswordExtension");

const prisma = new PrismaClient().$extends(hashPasswordExtension)

// Regex patterns
const siretRegex = /^[0-9]{14}$/;
const raisonSocialeRegex = /^[a-zA-Z0-9\s]{2,100}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

registerRouter.get("/register", (req, res) => {
    res.render("pages/register.twig");
});

registerRouter.post("/register", async (req, res) => {
    try {
        const errors = {};

        // Validate SIRET
        if (!siretRegex.test(req.body.siret)) {
            errors.siret = "Le SIRET doit contenir exactement 14 chiffres.";
        }

        // Validate Raison Sociale
        if (!raisonSocialeRegex.test(req.body.raison_sociale)) {
            errors.raison_sociale = "La raison sociale doit contenir entre 2 et 100 caractères alphanumériques.";
        }

        // Validate Password
        if (!passwordRegex.test(req.body.password)) {
            errors.password = "Le mot de passe doit contenir au moins 8 caractères, incluant une majuscule, une minuscule, un chiffre et un caractère spécial.";
        }

        // Check if passwords match
        if (req.body.password !== req.body.confirm_password) {
            errors.confirm_password = "Les mots de passe ne correspondent pas.";
        }

        // If there are errors, render the page with errors
        if (Object.keys(errors).length > 0) {
            return res.render("pages/register.twig", { errors: errors });
        }

        // If validation passes, create the entreprise
        const entreprise = await prisma.entreprise.create({
            data: {
                siret: req.body.siret,
                raisonSociale: req.body.raison_sociale,
                motDePasse: req.body.password,
            }
        });
        console.log("Entreprise créée avec succès :", entreprise);
        res.redirect("/login");
    } catch (error) {
        console.log(error);
        res.render("pages/register.twig", { errors: { server: "Une erreur est survenue lors de l'inscription." } });
    }
});

module.exports = registerRouter;