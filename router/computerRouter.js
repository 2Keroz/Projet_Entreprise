const express = require("express");
const { PrismaClient } = require("@prisma/client");
const authguard = require('../services/authguard');

const prisma = new PrismaClient();
const computerRouter = express.Router();

// Fonction pour échapper les caractères spéciaux
function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

// Regex pour l'adresse MAC
const macAddressRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;

computerRouter.get("/computer", authguard, async (req, res) => {
    try {
        const entrepriseId = req.session.entreprise.id;
        res.render("pages/computer.twig", { entrepriseId });
    } catch (error) {
        console.error(error);
        res.redirect("/login");
    }
});

computerRouter.post("/deleteComputer", authguard, async (req, res) => {
    try {
        const ordinateurId = parseInt(req.body.ordinateurId, 10);
        await prisma.ordinateur.delete({
            where: { id: ordinateurId },
        });
        console.log(`Ordinateur avec ID ${ordinateurId} supprimé avec succès.`);
        res.redirect("/");
    } catch (error) {
        console.error("Erreur lors de la suppression de l'ordinateur :", error);
        res.redirect("/"); 
    }
});

computerRouter.post("/computer", authguard, async (req, res) => {
    try {
        let { adresseMac, designation, adresse } = req.body;
        const entrepriseId = req.session.entreprise.id;

        // Validation et nettoyage des entrées
        adresseMac = escapeHtml(adresseMac.trim());
        designation = escapeHtml(designation.trim());
        adresse = escapeHtml(adresse.trim());

        // Vérification de l'adresse MAC
        if (!macAddressRegex.test(adresseMac)) {
            throw new Error("Format d'adresse MAC invalide");
        }

        const ordinateur = await prisma.ordinateur.create({
            data: {
                adresseMac,
                designation,
                entrepriseId,
                adresse,
            },
        });

        console.log("Ordinateur créé avec succès :", ordinateur);
        res.redirect("/");
    } catch (error) {
        console.error("Erreur lors de la création de l'ordinateur :", error);
        res.render("pages/computer.twig", { 
            error: error.message || "Erreur lors de la création de l'ordinateur.",
            entrepriseId: req.session.entreprise.id
        });
    }
});

module.exports = computerRouter;