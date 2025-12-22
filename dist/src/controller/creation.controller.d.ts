import type { Request, Response, NextFunction } from 'express';
declare class CreationController {
    private fruitService;
    private sauceService;
    private cerealeService;
    private tailleCreationService;
    getFruits(req: Request, res: Response, next: NextFunction): Promise<void>;
    getFruitById(req: Request, res: Response, next: NextFunction): Promise<void>;
    createFruit(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateFruit(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteFruit(req: Request, res: Response, next: NextFunction): Promise<void>;
    getSauces(req: Request, res: Response, next: NextFunction): Promise<void>;
    getSauceById(req: Request, res: Response, next: NextFunction): Promise<void>;
    createSauce(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateSauce(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteSauce(req: Request, res: Response, next: NextFunction): Promise<void>;
    getCereales(req: Request, res: Response, next: NextFunction): Promise<void>;
    getCerealeById(req: Request, res: Response, next: NextFunction): Promise<void>;
    createCereale(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateCereale(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteCereale(req: Request, res: Response, next: NextFunction): Promise<void>;
    getTailles(req: Request, res: Response, next: NextFunction): Promise<void>;
    getTailleById(req: Request, res: Response, next: NextFunction): Promise<void>;
    createTaille(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateTaille(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteTaille(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const _default: CreationController;
export default _default;
//# sourceMappingURL=creation.controller.d.ts.map