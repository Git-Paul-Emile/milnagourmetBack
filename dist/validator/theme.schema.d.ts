import { z } from 'zod';
export declare const createThemeSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    lightColors: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    darkColors: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export declare const updateThemeSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    lightColors: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    darkColors: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
//# sourceMappingURL=theme.schema.d.ts.map