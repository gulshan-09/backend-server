const express = require('express');
const router = new express.Router();


const controllers = require("../controllers/dataController")

// routes

router.post("/api/v1/upload", controllers.datapost);
router.get("/api/v1/data", controllers.getData);
router.get("/filter", controllers.advancedatafilter);
router.get("/api/v1/popular/:id", controllers.getonedata);
router.delete("/api/v1/delete/:id", controllers.deletedata);
router.put("/api/v1/popular/update/:dataid", controllers.updatedata);


module.exports = router;