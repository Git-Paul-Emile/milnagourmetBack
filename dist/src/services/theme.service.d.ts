interface ThemeColors {
    [key: string]: string;
}
interface CreateThemeData {
    name: string;
    description?: string;
    lightColors: ThemeColors;
    darkColors?: ThemeColors;
}
interface UpdateThemeData {
    name?: string;
    description?: string;
    lightColors?: ThemeColors;
    darkColors?: ThemeColors;
}
declare class ThemeService {
    getAllThemes(): Promise<{
        description: string | null;
        name: string;
        id: number;
        lightColors: import("@prisma/client/runtime/library").JsonValue;
        darkColors: import("@prisma/client/runtime/library").JsonValue | null;
        isDefault: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getActiveTheme(): Promise<{
        description: string | null;
        name: string;
        id: number;
        lightColors: import("@prisma/client/runtime/library").JsonValue;
        darkColors: import("@prisma/client/runtime/library").JsonValue | null;
        isDefault: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    getThemeById(id: number): Promise<{
        description: string | null;
        name: string;
        id: number;
        lightColors: import("@prisma/client/runtime/library").JsonValue;
        darkColors: import("@prisma/client/runtime/library").JsonValue | null;
        isDefault: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createTheme(data: CreateThemeData): Promise<{
        description: string | null;
        name: string;
        id: number;
        lightColors: import("@prisma/client/runtime/library").JsonValue;
        darkColors: import("@prisma/client/runtime/library").JsonValue | null;
        isDefault: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateTheme(id: number, data: UpdateThemeData): Promise<{
        description: string | null;
        name: string;
        id: number;
        lightColors: import("@prisma/client/runtime/library").JsonValue;
        darkColors: import("@prisma/client/runtime/library").JsonValue | null;
        isDefault: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    setActiveTheme(id: number): Promise<{
        description: string | null;
        name: string;
        id: number;
        lightColors: import("@prisma/client/runtime/library").JsonValue;
        darkColors: import("@prisma/client/runtime/library").JsonValue | null;
        isDefault: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    setDefaultTheme(id: number): Promise<{
        description: string | null;
        name: string;
        id: number;
        lightColors: import("@prisma/client/runtime/library").JsonValue;
        darkColors: import("@prisma/client/runtime/library").JsonValue | null;
        isDefault: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteTheme(id: number): Promise<{
        message: string;
    }>;
}
declare const _default: ThemeService;
export default _default;
//# sourceMappingURL=theme.service.d.ts.map