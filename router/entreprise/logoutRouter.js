const logoutRouter = require("express").Router();

// Route pour gérer la déconnexion
logoutRouter.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Erreur lors de la destruction de la session :", err);
            return res.redirect("/dashboard"); // Rediriger vers le tableau de bord en cas d'erreur
        }
        // Rediriger vers la page de connexion après déconnexion réussie
        res.redirect("/login");
    });
});

module.exports = logoutRouter;
