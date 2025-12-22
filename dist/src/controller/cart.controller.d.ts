import type { Request, Response, NextFunction } from 'express';
declare class CartController {
    private cartService;
    getCart(req: Request, res: Response, next: NextFunction): Promise<void>;
    addToCart(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateCartItem(req: Request, res: Response, next: NextFunction): Promise<void>;
    removeFromCart(req: Request, res: Response, next: NextFunction): Promise<void>;
    clearCart(req: Request, res: Response, next: NextFunction): Promise<void>;
    addCustomCreation(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateCustomCreation(req: Request, res: Response, next: NextFunction): Promise<void>;
    removeCustomCreation(req: Request, res: Response, next: NextFunction): Promise<void>;
    checkout(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const _default: CartController;
export default _default;
//# sourceMappingURL=cart.controller.d.ts.map