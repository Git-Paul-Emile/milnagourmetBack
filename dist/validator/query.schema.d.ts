import { z } from 'zod';
export declare const orderQuerySchema: z.ZodObject<{
    page: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    search: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    sortBy: z.ZodOptional<z.ZodEnum<{
        date: "date";
        status: "status";
        total: "total";
    }>>;
    status: z.ZodOptional<z.ZodEnum<{
        RECU: "RECU";
        LIVREE: "LIVREE";
        ANNULEE: "ANNULEE";
        recu: "recu";
        livree: "livree";
        annulee: "annulee";
    }>>;
}, z.core.$strip>;
export declare const userQuerySchema: z.ZodObject<{
    page: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    search: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    sortBy: z.ZodOptional<z.ZodEnum<{
        date: "date";
        name: "name";
        orders: "orders";
    }>>;
    blocked: z.ZodOptional<z.ZodEnum<{
        true: "true";
        false: "false";
    }>>;
}, z.core.$strip>;
export declare const productQuerySchema: z.ZodObject<{
    page: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    search: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    sortBy: z.ZodOptional<z.ZodEnum<{
        date: "date";
        name: "name";
        price: "price";
    }>>;
    category: z.ZodOptional<z.ZodString>;
    disponible: z.ZodOptional<z.ZodEnum<{
        true: "true";
        false: "false";
    }>>;
}, z.core.$strip>;
export type OrderQuery = z.infer<typeof orderQuerySchema>;
export type UserQuery = z.infer<typeof userQuerySchema>;
export type ProductQuery = z.infer<typeof productQuerySchema>;
//# sourceMappingURL=query.schema.d.ts.map