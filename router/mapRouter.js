const mapRouter = require("express").Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authguard = require('../services/authguard')

// Route pour afficher la carte
mapRouter.get('/map', authguard,async (req, res) => {
    const ordinateurs = await prisma.ordinateur.findMany({
        select: {
            id: true,
            adresseMac: true,
            designation: true,
            adresse: true, // Assurez-vous que l'adresse est incluse
        }
    });
    res.render('pages/map.twig', { ordinateurs });
});

module.exports = mapRouter;
