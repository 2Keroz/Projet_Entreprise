const dashboardRouter = require("express").Router()
const { PrismaClient } = require("@prisma/client")
const authguard = require('../services/authguard')

const prisma = new PrismaClient()

dashboardRouter.get('/', authguard, async (req, res) => {
    try {
        if (!req.session.entreprise) {
            return res.redirect("/login");
        }

        const entrepriseId = req.session.entreprise.id;

        const entreprise = await prisma.entreprise.findUnique({
            where: { id: entrepriseId },
        });

        const employes = await prisma.employe.findMany({
            where: {
                entrepriseId: entrepriseId 
                
            }
        });

        const ordinateurs = await prisma.ordinateur.findMany({
            where: { entrepriseId: entrepriseId }
        });

        res.render("pages/dashboard.twig", { employes, entreprise, ordinateurs }); // Passer les employés et l'entreprise au template
    } catch (error) {
        console.error("Erreur lors de la récupération des employés :", error);
        res.redirect("/login");
    }
});


// Route pour assigner un ordinateur à un employé
dashboardRouter.post('/assignComputer', authguard, async (req, res) => {
    try {
        const { ordinateurId, employeId } = req.body;
        const entrepriseId = req.session.entreprise.id;

        // Met à jour l'ordinateur avec l'employé sélectionné
        await prisma.employe.update({
            where: { id: parseInt(employeId, 10) },
            data: {
                ordinateurId: parseInt(ordinateurId, 10)
            }
        });

        res.redirect('/');
    } catch (error) {
        console.error("Erreur lors de l'assignation de l'ordinateur :", error);
        res.redirect('/');
    }
});


// Route pour désassigner un ordinateur
dashboardRouter.post('/unassignComputer', authguard, async (req, res) => {
    try {
        const { ordinateurId } = req.body;

        // Mettre à jour l'employé pour enlever l'assignation de l'ordinateur
        await prisma.employe.updateMany({
            where: { ordinateurId: parseInt(ordinateurId, 10) },
            data: { ordinateurId: null }
        });

        console.log(`Ordinateur ID ${ordinateurId} désassigné avec succès.`);
        res.redirect('/');
    } catch (error) {
        console.error("Erreur lors de la désassignation de l'ordinateur :", error);
        res.redirect('/');
    }
});

module.exports = dashboardRouter;
