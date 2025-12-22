declare const swaggerDefinition: {
    openapi: string;
    info: {
        title: string;
        version: string;
        description: string;
    };
    servers: {
        url: string;
        description: string;
    }[];
    paths: {
        '/api/auth/register': {
            post: {
                summary: string;
                tags: string[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    201: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    400: {
                        description: string;
                    };
                };
            };
        };
        '/api/auth/login': {
            post: {
                summary: string;
                tags: string[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
        '/api/auth/refresh': {
            post: {
                summary: string;
                tags: string[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        token: {
                                            type: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
        '/api/auth/logout': {
            post: {
                summary: string;
                tags: string[];
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/api/auth/logout-all': {
            post: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
        '/api/auth/me': {
            get: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
        '/api/auth/profile': {
            put: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
        '/api/auth/account': {
            delete: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    204: {
                        description: string;
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
        '/api/categories': {
            get: {
                summary: string;
                tags: string[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    items: {
                                        $ref: string;
                                    };
                                };
                            };
                        };
                    };
                };
            };
            post: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    201: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
        '/api/categories/{id}': {
            get: {
                summary: string;
                tags: string[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    404: {
                        description: string;
                    };
                };
            };
            put: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    401: {
                        description: string;
                    };
                    404: {
                        description: string;
                    };
                };
            };
            delete: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    204: {
                        description: string;
                    };
                    401: {
                        description: string;
                    };
                    404: {
                        description: string;
                    };
                };
            };
        };
        '/api/products': {
            get: {
                summary: string;
                tags: string[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    items: {
                                        $ref: string;
                                    };
                                };
                            };
                        };
                    };
                };
            };
            post: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    201: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
        '/api/products/{id}': {
            get: {
                summary: string;
                tags: string[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    404: {
                        description: string;
                    };
                };
            };
            put: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    401: {
                        description: string;
                    };
                    404: {
                        description: string;
                    };
                };
            };
            delete: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    204: {
                        description: string;
                    };
                    401: {
                        description: string;
                    };
                    404: {
                        description: string;
                    };
                };
            };
        };
    };
    components: {
        securitySchemes: {
            bearerAuth: {
                type: string;
                scheme: string;
                bearerFormat: string;
            };
        };
        schemas: {
            User: {
                type: string;
                properties: {
                    id: {
                        type: string;
                    };
                    email: {
                        type: string;
                        format: string;
                    };
                    name: {
                        type: string;
                    };
                    role: {
                        type: string;
                        enum: string[];
                    };
                    createdAt: {
                        type: string;
                        format: string;
                    };
                    updatedAt: {
                        type: string;
                        format: string;
                    };
                };
            };
            RegisterUser: {
                type: string;
                properties: {
                    email: {
                        type: string;
                        format: string;
                    };
                    password: {
                        type: string;
                        minLength: number;
                    };
                    name: {
                        type: string;
                        minLength: number;
                    };
                };
                required: string[];
            };
            LoginUser: {
                type: string;
                properties: {
                    email: {
                        type: string;
                        format: string;
                    };
                    password: {
                        type: string;
                        minLength: number;
                    };
                };
                required: string[];
            };
            UpdateProfile: {
                type: string;
                properties: {
                    name: {
                        type: string;
                        minLength: number;
                    };
                    email: {
                        type: string;
                        format: string;
                    };
                };
            };
            Category: {
                type: string;
                properties: {
                    id: {
                        type: string;
                    };
                    name: {
                        type: string;
                    };
                    description: {
                        type: string;
                    };
                    image: {
                        type: string;
                    };
                    createdAt: {
                        type: string;
                        format: string;
                    };
                    updatedAt: {
                        type: string;
                        format: string;
                    };
                };
            };
            CreateCategory: {
                type: string;
                properties: {
                    name: {
                        type: string;
                        minLength: number;
                    };
                    description: {
                        type: string;
                    };
                    image: {
                        type: string;
                    };
                };
                required: string[];
            };
            UpdateCategory: {
                type: string;
                properties: {
                    name: {
                        type: string;
                        minLength: number;
                    };
                    description: {
                        type: string;
                    };
                    image: {
                        type: string;
                    };
                };
            };
            Product: {
                type: string;
                properties: {
                    id: {
                        type: string;
                    };
                    name: {
                        type: string;
                    };
                    description: {
                        type: string;
                    };
                    price: {
                        type: string;
                    };
                    image: {
                        type: string;
                    };
                    categoryId: {
                        type: string;
                    };
                    category: {
                        $ref: string;
                    };
                    createdAt: {
                        type: string;
                        format: string;
                    };
                    updatedAt: {
                        type: string;
                        format: string;
                    };
                };
            };
            CreateProduct: {
                type: string;
                properties: {
                    name: {
                        type: string;
                        minLength: number;
                    };
                    description: {
                        type: string;
                    };
                    price: {
                        type: string;
                        minimum: number;
                    };
                    categoryId: {
                        type: string;
                        minimum: number;
                    };
                    image: {
                        type: string;
                    };
                };
                required: string[];
            };
            UpdateProduct: {
                type: string;
                properties: {
                    name: {
                        type: string;
                        minLength: number;
                    };
                    description: {
                        type: string;
                    };
                    price: {
                        type: string;
                        minimum: number;
                    };
                    categoryId: {
                        type: string;
                        minimum: number;
                    };
                    image: {
                        type: string;
                    };
                };
            };
        };
    };
};
export default swaggerDefinition;
//# sourceMappingURL=swagger.d.ts.map