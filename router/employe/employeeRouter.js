const employeeRouter = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const authguard = require('../../services/authguard');
const bcrypt = require("bcrypt")

const prisma = new PrismaClient();

employeeRouter.get('/employe', authguard, async (req, res) => {
    try {
        // Supposons que vous stockez l'entreprise dans la session après la connexion
        const entrepriseId = req.session.entreprise.id; // Obtenez l'ID de l'entreprise à partir de la session

        const entreprise = await prisma.entreprise.findUnique({
            where: { id: entrepriseId }
        });

        res.render("pages/employee.twig", { entreprise }); // Passer l'entreprise au template
    } catch (error) {
        console.log("Vous devez être connecté pour accéder à cette page !");
        res.redirect("/login");
    }
});


// Route pour créer un employé
employeeRouter.post("/employe", authguard, async (req, res) => {
    try {
        if (req.body.password === req.body.confirm_password) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const employe = await prisma.employe.create({
                data: {
                    nom: req.body.nom,
                    prenom: req.body.prenom,
                    mail: req.body.mail,
                    age: parseInt(req.body.age, 10), // Assurez-vous que l'âge est un nombre
                    motDePasse: hashedPassword,
                    entreprise: {
                        connect: { id: parseInt(req.body.entrepriseId, 10) } // Connecter l'employé à l'entreprise sélectionnée
                    }
                }
            });
            console.log("Employé créé avec succès :", employe);
            res.redirect("/");
        } else {
            throw { confirm_password: "Les mots de passe ne correspondent pas" };
        }
    } catch (error) {
        console.log(error);
        res.render("pages/employee.twig", { error: error, title: "Inscription employé", entreprises: await prisma.entreprise.findMany() }); // Passer les entreprises en cas d'erreur
    }
});


// Route pour modifier un employé (affichage du formulaire de modification)
employeeRouter.get('/editEmploye/:id', authguard, async (req, res) => {
    try {
        const employeId = parseInt(req.params.id, 10);
        const employe = await prisma.employe.findUnique({
            where: { id: employeId }
        });

        res.render("pages/editEmployee.twig", { employe });
    } catch (error) {
        console.error("Erreur lors de la récupération de l'employé :", error);
        res.redirect('/');
    }
});

// Route pour traiter la modification de l'employé
employeeRouter.post('/editEmploye/:id', authguard, async (req, res) => {
    try {
        const employeId = parseInt(req.params.id, 10);
        const { nom, prenom, mail, age } = req.body;

        await prisma.employe.update({
            where: { id: employeId },
            data: { nom, prenom, mail, age: parseInt(age) }

        });

        console.log(`Employé ID ${employeId} mis à jour avec succès.`);
        res.redirect('/');
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'employé :", error);
        res.redirect(`/editEmploye/${req.params.id}`);
    }
});



// Route pour supprimer un employé
employeeRouter.post('/deleteEmploye', authguard, async (req, res) => {
    try {
        const employeId = parseInt(req.body.employeId, 10);

        await prisma.employe.delete({
            where: { id: employeId }
        });

        console.log(`Employé ID ${employeId} supprimé avec succès.`);
        res.redirect('/');
    } catch (error) {
        console.error("Erreur lors de la suppression de l'employé :", error);
        res.redirect('/');
    }
});

module.exports = employeeRouter;
