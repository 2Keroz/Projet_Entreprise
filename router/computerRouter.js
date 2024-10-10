const express = require("express");
const { PrismaClient } = require("@prisma/client");
const authguard = require('../services/authguard');

const prisma = new PrismaClient();
const computerRouter = express.Router();


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
        const { adresseMac, designation, adresse } = req.body;
        const entrepriseId = req.session.entreprise.id;


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
        res.render("pages/computer.twig", { error: "Erreur lors de la création de l'ordinateur." });
    }
});

module.exports = computerRouter;