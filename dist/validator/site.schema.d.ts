import { z } from 'zod';
export declare const updateBrandingSchema: z.ZodObject<{
    logo: z.ZodString;
}, z.core.$strip>;
export declare const updateAvatarToastSchema: z.ZodObject<{
    image: z.ZodString;
}, z.core.$strip>;
export declare const updateContactSchema: z.ZodObject<{
    companyName: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    whatsapp: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateSocialMediaSchema: z.ZodArray<z.ZodObject<{
    plateforme: z.ZodString;
    url: z.ZodString;
    active: z.ZodBoolean;
}, z.core.$strip>>;
export declare const createTestimonialSchema: z.ZodObject<{
    name: z.ZodString;
    location: z.ZodString;
    rating: z.ZodCoercedNumber<unknown>;
    comment: z.ZodString;
    avatar: z.ZodOptional<z.ZodString>;
    active: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const updateTestimonialSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    rating: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    comment: z.ZodOptional<z.ZodString>;
    avatar: z.ZodOptional<z.ZodString>;
    active: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const updateHeroSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    subtitle: z.ZodOptional<z.ZodString>;
    badge: z.ZodOptional<z.ZodString>;
    banner: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateCatalogSectionSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    creationTitle: z.ZodOptional<z.ZodString>;
    creationDescription: z.ZodOptional<z.ZodString>;
    creationButtonText: z.ZodOptional<z.ZodString>;
    creationImage: z.ZodOptional<z.ZodString>;
    emptyMessage: z.ZodOptional<z.ZodString>;
    emptySubMessage: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateStoreHoursSchema: z.ZodObject<{
    hours: z.ZodArray<z.ZodObject<{
        day: z.ZodString;
        open: z.ZodString;
        close: z.ZodString;
        closed: z.ZodBoolean;
    }, z.core.$strip>>;
}, z.core.$strip>;
//# sourceMappingURL=site.schema.d.ts.map