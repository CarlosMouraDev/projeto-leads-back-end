import { Router } from "express";
import { LeadsController } from "./controllers/LeadsController";
import { GroupsController } from "./controllers/GroupsController";

const router = Router();
const leadsController = new LeadsController();
const groupsController = new GroupsController();

//Leads routes
router.get("/leads", leadsController.index);
router.get("/leads/:id", leadsController.show);
router.post("/leads", leadsController.create);
router.delete("/leads/:id", leadsController.delete);
router.put("/leads/:id", leadsController.update);

//Groups routes
router.get("/groups", groupsController.index);
router.get("/groups/:id", groupsController.show);
router.post("/groups", groupsController.create);

export { router };
