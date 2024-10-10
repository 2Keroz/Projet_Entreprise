const express = require("express");
const session = require("express-session")

// EntrepriseRouter
const registerRouter = require("./router/entreprise/registerRouter")
const loginRouter = require("./router/entreprise/loginRouter")
const logoutRouter = require("./router/entreprise/logoutRouter")
// DashboardRouter
const dashboardRouter = require("./router/dashboardRouter")
// ComputeurRouter
const computerRouter = require("./router/computerRouter");
// EmployeeRouter
const employeeRouter = require("./router/employe/employeeRouter");
const mapRouter = require("./router/mapRouter");



const app = express(); // on lance le server
app.use(express.static("./public"))
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: "kmr%2p~V3-s]RM3%#J-q6UM2=rW5yC88",
    resave: true,
    saveUninitialized: true,
}))

app.use(registerRouter)
app.use(loginRouter)
app.use(dashboardRouter)
app.use(logoutRouter)
app.use(computerRouter)
app.use(employeeRouter)
app.use(mapRouter)





app.listen(3000, ()=>{
    console.log("Connecté sur le port 3000");  
})