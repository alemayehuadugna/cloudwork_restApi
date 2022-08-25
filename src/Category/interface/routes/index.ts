// import { Scope } from "@/auth/interface/controllers/AccessScopeHandler";
import { updateProgressHandler } from "@/job/interface/controllers/UpdateProgressHandler";
import { Router } from "express";
import { createCategoryHandler } from "../controller/CreateCategoryHandler";
import { deleteCategoryHandler } from "../controller/DeleteCategoryHandler";
// import { deleteCategoryHandler } from "../controller/DeleteCategoryHandler";
import { getCategoryHandler } from "../controller/GetCategoryHandler";
import { listCategoriesHandler } from "../controller/ListCategoryHandler";
import { updateCategoryHandler } from "../controller/UpdateCategorieHandler";

type Dependencies = {
    apiRouter: Router;
}

const makeCategoryController = ({apiRouter}: Dependencies) => {
    const router = Router();
    router.get("/categories", listCategoriesHandler);
    router.post("/categories", createCategoryHandler);
    router.get("/categories/:id", getCategoryHandler);
    router.delete("/categories/:categoryId", deleteCategoryHandler);
    router.patch('/categories/:categoryId', updateCategoryHandler);


    apiRouter.use(router);
};

export {makeCategoryController};