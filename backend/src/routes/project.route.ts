import { Router } from "express";
import {
  getProjectsByUserId, createProject,
  getProjectById, updateProject,
  deleteProject,
  uploadProjectFiles,
  mapStakeholders,
  increamentProjectStatus,
  mapFacts,
  deleteFact,
  findContradictions,
  ResolveContradiction,
  generateBRD,
  refineBRD,
  saveBRD,
} from "../controllers/project.controller";
import upload from "../utils/multer";

const projectRouter = Router();

projectRouter.post("/projects", createProject);
projectRouter.get("/projects/user/:userId", getProjectsByUserId);
projectRouter.get("/projects/:projectId", getProjectById);
projectRouter.put("/projects/:projectId", updateProject);
projectRouter.delete("/projects/:projectId", deleteProject);

projectRouter.post("/projects/:projectId/files", upload.array("files", 10), uploadProjectFiles);
projectRouter.post("/projects/:projectId/stakeholders", mapStakeholders);
projectRouter.post("/projects/:projectId/increament-status", increamentProjectStatus);
projectRouter.post("/projects/:projectId/map-facts", mapFacts);
projectRouter.delete("/projects/:projectId/facts/:factId", deleteFact);
projectRouter.post("/projects/:projectId/find-contradictions", findContradictions);
projectRouter.post("/projects/:projectId/resolve-contradiction", ResolveContradiction);
projectRouter.post("/projects/:projectId/generate-brd", generateBRD);
projectRouter.post("/projects/:projectId/refine-brd", refineBRD);
projectRouter.post("/projects/:projectId/save-brd", saveBRD);

export default projectRouter;
