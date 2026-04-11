import { Router, type IRouter } from "express";
import healthRouter from "./health";
import { eventsRouter } from "./events";
import { clubsRouter } from "./clubs";
import { registrationsRouter } from "./registrations";
import { attendanceRouter } from "./attendance";
import { dashboardRouter } from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(eventsRouter);
router.use(clubsRouter);
router.use(registrationsRouter);
router.use(attendanceRouter);
router.use(dashboardRouter);

export default router;
