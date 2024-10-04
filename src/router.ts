import { Router } from "express";
import { LeadsController } from "./controllers/LeadsController";

const router = Router() 
const leadsController = new LeadsController

router.get("/leads", leadsController.index)
router.get("/leads/:id", leadsController.show)
router.post("/leads", leadsController.create)
router.delete("/leads/:id", leadsController.delete)
router.put("/leads/:id", leadsController.update)

export { router }