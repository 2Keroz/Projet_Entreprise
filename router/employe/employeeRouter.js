const employeeRouter = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const authguard = require('../../services/authguard');
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

// Regex patterns
const nomPrenomRegex = /^[a-zA-ZÀ-ÿ-' ]{2,50}$/;
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

employeeRouter.get('/employe', authguard, async (req, res) => {
    try {
        const entrepriseId = req.session.entreprise.id;
        const entreprise = await prisma.entreprise.findUnique({
            where: { id: entrepriseId }
        });
        res.render("pages/employee.twig", { entreprise });
    } catch (error) {
        console.log("Vous devez être connecté pour accéder à cette page !");
        res.redirect("/login");
    }
});

employeeRouter.post("/employe", authguard, async (req, res) => {
    try {
        const errors = {};

        // Validate nom
        if (!nomPrenomRegex.test(req.body.nom)) {
            errors.nom = "Le nom doit contenir entre 2 et 50 caractères alphabétiques.";
        }

        // Validate prenom
        if (!nomPrenomRegex.test(req.body.prenom)) {
            errors.prenom = "Le prénom doit contenir entre 2 et 50 caractères alphabétiques.";
        }

        // Validate email
        if (!emailRegex.test(req.body.mail)) {
            errors.mail = "L'adresse email n'est pas valide.";
        }

        // Validate age
        const age = parseInt(req.body.age, 10);
        if (isNaN(age) || age < 18 || age > 100) {
            errors.age = "L'âge doit être un nombre entre 18 et 100.";
        }

        // Validate password
        if (!passwordRegex.test(req.body.password)) {
            errors.password = "Le mot de passe doit contenir au moins 8 caractères, incluant une majuscule, une minuscule, un chiffre et un caractère spécial.";
        }

        // Check if passwords match
        if (req.body.password !== req.body.confirm_password) {
            errors.confirm_password = "Les mots de passe ne correspondent pas.";
        }

        // If there are errors, render the page with errors
        if (Object.keys(errors).length > 0) {
            const entreprise = await prisma.entreprise.findUnique({
                where: { id: parseInt(req.body.entrepriseId, 10) }
            });
            return res.render("pages/employee.twig", { errors, entreprise });
        }

        // If validation passes, create the employee
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const employe = await prisma.employe.create({
            data: {
                nom: escapeHtml(req.body.nom),
                prenom: escapeHtml(req.body.prenom),
                mail: escapeHtml(req.body.mail),
                age: age,
                motDePasse: hashedPassword,
                entreprise: {
                    connect: { id: parseInt(req.body.entrepriseId, 10) }
                }
            }
        });
        console.log("Employé créé avec succès :", employe);
        res.redirect("/");
    } catch (error) {
        console.log(error);
        const entreprise = await prisma.entreprise.findUnique({
            where: { id: parseInt(req.body.entrepriseId, 10) }
        });
        res.render("pages/employee.twig", { error: "Une erreur est survenue lors de la création de l'employé.", entreprise });
    }
});

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

employeeRouter.post('/editEmploye/:id', authguard, async (req, res) => {
    try {
        const employeId = parseInt(req.params.id, 10);
        const { nom, prenom, mail, age } = req.body;

        // Validate inputs
        const errors = {};
        if (!nomPrenomRegex.test(nom)) errors.nom = "Le nom n'est pas valide.";
        if (!nomPrenomRegex.test(prenom)) errors.prenom = "Le prénom n'est pas valide.";
        if (!emailRegex.test(mail)) errors.mail = "L'adresse email n'est pas valide.";
        const ageInt = parseInt(age, 10);
        if (isNaN(ageInt) || ageInt < 18 || ageInt > 100) errors.age = "L'âge doit être entre 18 et 100.";

        if (Object.keys(errors).length > 0) {
            const employe = await prisma.employe.findUnique({ where: { id: employeId } });
            return res.render("pages/editEmployee.twig", { employe, errors });
        }

        await prisma.employe.update({
            where: { id: employeId },
            data: { 
                nom: escapeHtml(nom), 
                prenom: escapeHtml(prenom), 
                mail: escapeHtml(mail), 
                age: ageInt 
            }
        });

        console.log(`Employé ID ${employeId} mis à jour avec succès.`);
        res.redirect('/');
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'employé :", error);
        res.redirect(`/editEmploye/${req.params.id}`);
    }
});

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