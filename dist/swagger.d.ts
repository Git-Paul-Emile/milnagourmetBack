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
        '/api/config': {
            get: {
                summary: string;
                tags: string[];
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
                };
            };
        };
        '/api/config/order-statuses': {
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
        };
        '/api/config/category-translations': {
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
        };
        '/api/config/size-translations': {
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
        };
        '/api/cart': {
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
                    200: {
                        description: string;
                    };
                    401: {
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
                    };
                    401: {
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
        '/api/cart/{productId}': {
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
                    200: {
                        description: string;
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
        '/api/cart/custom': {
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
                    200: {
                        description: string;
                    };
                    401: {
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
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
        '/api/cart/custom/{creationId}': {
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
                    200: {
                        description: string;
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
        '/api/cart/checkout': {
            post: {
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
        '/api/users': {
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
                                    type: string;
                                    items: {
                                        $ref: string;
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
        '/api/users/{id}': {
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
        '/api/orders': {
            post: {
                summary: string;
                tags: string[];
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
                };
            };
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
                                    type: string;
                                    items: {
                                        $ref: string;
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
        '/api/orders/my-orders': {
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
                                    type: string;
                                    items: {
                                        $ref: string;
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
        '/api/orders/{id}': {
            get: {
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
        };
        '/api/orders/{id}/status': {
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
        };
        '/api/upload/product-image': {
            post: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: string;
                                properties: {
                                    image: {
                                        type: string;
                                        format: string;
                                        description: string;
                                    };
                                };
                            };
                        };
                    };
                };
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
        '/api/upload/logo-image': {
            post: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: string;
                                properties: {
                                    image: {
                                        type: string;
                                        format: string;
                                        description: string;
                                    };
                                };
                            };
                        };
                    };
                };
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
        '/api/upload/banner-image': {
            post: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: string;
                                properties: {
                                    image: {
                                        type: string;
                                        format: string;
                                        description: string;
                                    };
                                };
                            };
                        };
                    };
                };
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
        '/api/upload/testimonial-image': {
            post: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: string;
                                properties: {
                                    image: {
                                        type: string;
                                        format: string;
                                        description: string;
                                    };
                                };
                            };
                        };
                    };
                };
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
        '/api/upload/category-image': {
            post: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: string;
                                properties: {
                                    image: {
                                        type: string;
                                        format: string;
                                        description: string;
                                    };
                                };
                            };
                        };
                    };
                };
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
        '/api/upload/fruit-image': {
            post: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: string;
                                properties: {
                                    image: {
                                        type: string;
                                        format: string;
                                        description: string;
                                    };
                                };
                            };
                        };
                    };
                };
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
        '/api/upload/sauce-image': {
            post: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: string;
                                properties: {
                                    image: {
                                        type: string;
                                        format: string;
                                        description: string;
                                    };
                                };
                            };
                        };
                    };
                };
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
        '/api/upload/cereale-image': {
            post: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: string;
                                properties: {
                                    image: {
                                        type: string;
                                        format: string;
                                        description: string;
                                    };
                                };
                            };
                        };
                    };
                };
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
        '/api/upload/avatar-toast-image': {
            post: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: string;
                                properties: {
                                    image: {
                                        type: string;
                                        format: string;
                                        description: string;
                                    };
                                };
                            };
                        };
                    };
                };
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
        '/api/upload/images': {
            get: {
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
        '/api/upload/used-images': {
            get: {
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
        '/api/upload/images/{folder}/{filename}': {
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
                    200: {
                        description: string;
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
        '/api/site/branding': {
            get: {
                summary: string;
                tags: string[];
                responses: {
                    200: {
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
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
        '/api/site/avatar-toast': {
            get: {
                summary: string;
                tags: string[];
                responses: {
                    200: {
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
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
        '/api/site/contact': {
            get: {
                summary: string;
                tags: string[];
                responses: {
                    200: {
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
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
        '/api/site/social-media': {
            get: {
                summary: string;
                tags: string[];
                responses: {
                    200: {
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
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
        '/api/site/testimonials': {
            get: {
                summary: string;
                tags: string[];
                responses: {
                    200: {
                        description: string;
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
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
        '/api/site/testimonials/all': {
            get: {
                summary: string;
                tags: string[];
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/api/site/testimonials/{id}': {
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
        '/api/site/hero': {
            get: {
                summary: string;
                tags: string[];
                responses: {
                    200: {
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
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
        '/api/site/contact-section': {
            get: {
                summary: string;
                tags: string[];
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/api/site/catalog-section': {
            get: {
                summary: string;
                tags: string[];
                responses: {
                    200: {
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
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
        '/api/site/navigation': {
            get: {
                summary: string;
                tags: string[];
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/api/site/store-hours': {
            get: {
                summary: string;
                tags: string[];
                responses: {
                    200: {
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
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
        '/api/creation/fruits': {
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
        '/api/creation/fruits/{id}': {
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
        '/api/creation/sauces': {
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
        '/api/creation/sauces/{id}': {
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
        '/api/creation/cereales': {
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
        '/api/creation/cereales/{id}': {
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
        '/api/creation/tailles': {
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
        '/api/creation/tailles/{id}': {
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
        '/api/delivery-persons': {
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
                                    type: string;
                                    items: {
                                        $ref: string;
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
        '/api/delivery-persons/{id}': {
            get: {
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
        '/api/delivery-zones': {
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
        '/api/delivery-zones/active': {
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
        };
        '/api/delivery-zones/with-orders': {
            get: {
                summary: string;
                tags: string[];
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/api/delivery-zones/{id}': {
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
        '/api/themes': {
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
                                    type: string;
                                    items: {
                                        $ref: string;
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
        '/api/themes/active': {
            get: {
                summary: string;
                tags: string[];
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
                };
            };
        };
        '/api/themes/{id}': {
            get: {
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
        '/api/themes/{id}/active': {
            patch: {
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
                    200: {
                        description: string;
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
        '/api/themes/{id}/default': {
            patch: {
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
                    200: {
                        description: string;
                    };
                    401: {
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
            Config: {
                type: string;
                properties: {
                    orderStatuses: {
                        type: string;
                        items: {
                            $ref: string;
                        };
                    };
                    categoryTranslations: {
                        type: string;
                        items: {
                            $ref: string;
                        };
                    };
                    sizeTranslations: {
                        type: string;
                        items: {
                            $ref: string;
                        };
                    };
                };
            };
            OrderStatus: {
                type: string;
                properties: {
                    id: {
                        type: string;
                    };
                    statut: {
                        type: string;
                    };
                    libelleFr: {
                        type: string;
                    };
                    couleurBg: {
                        type: string;
                    };
                    couleurText: {
                        type: string;
                    };
                    icone: {
                        type: string;
                    };
                    ordre: {
                        type: string;
                    };
                    creeLe: {
                        type: string;
                        format: string;
                    };
                    modifieLe: {
                        type: string;
                        format: string;
                    };
                };
            };
            CategoryTranslation: {
                type: string;
                properties: {
                    id: {
                        type: string;
                    };
                    categorieId: {
                        type: string;
                    };
                    code: {
                        type: string;
                    };
                    libelleFr: {
                        type: string;
                    };
                    creeLe: {
                        type: string;
                        format: string;
                    };
                    modifieLe: {
                        type: string;
                        format: string;
                    };
                    categorie: {
                        $ref: string;
                    };
                };
            };
            SizeTranslation: {
                type: string;
                properties: {
                    id: {
                        type: string;
                    };
                    tailleId: {
                        type: string;
                    };
                    code: {
                        type: string;
                    };
                    libelleFr: {
                        type: string;
                    };
                    creeLe: {
                        type: string;
                        format: string;
                    };
                    modifieLe: {
                        type: string;
                        format: string;
                    };
                    taille: {
                        $ref: string;
                    };
                };
            };
            Size: {
                type: string;
                properties: {
                    id: {
                        type: string;
                    };
                    nom: {
                        type: string;
                    };
                    prix: {
                        type: string;
                    };
                    maxFruits: {
                        type: string;
                    };
                    maxSauces: {
                        type: string;
                    };
                    cerealesAutorise: {
                        type: string;
                    };
                    active: {
                        type: string;
                    };
                    ordreAffichage: {
                        type: string;
                    };
                    creeLe: {
                        type: string;
                        format: string;
                    };
                    modifieLe: {
                        type: string;
                        format: string;
                    };
                };
            };
            Cart: {
                type: string;
                properties: {
                    id: {
                        type: string;
                    };
                    userId: {
                        type: string;
                    };
                    items: {
                        type: string;
                        items: {
                            $ref: string;
                        };
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
            CartItem: {
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
                    quantity: {
                        type: string;
                    };
                    image: {
                        type: string;
                    };
                    customCreation: {
                        $ref: string;
                    };
                };
            };
            CustomCreation: {
                type: string;
                properties: {
                    size: {
                        $ref: string;
                    };
                    selectedFruits: {
                        type: string;
                        items: {
                            type: string;
                        };
                    };
                    selectedSauces: {
                        type: string;
                        items: {
                            type: string;
                        };
                    };
                    selectedCereales: {
                        type: string;
                        items: {
                            type: string;
                        };
                    };
                    totalPrice: {
                        type: string;
                    };
                };
            };
            AddToCart: {
                type: string;
                properties: {
                    productId: {
                        type: string;
                    };
                    quantity: {
                        type: string;
                        minimum: number;
                    };
                };
                required: string[];
            };
            UpdateCartItem: {
                type: string;
                properties: {
                    productId: {
                        type: string;
                    };
                    quantity: {
                        type: string;
                        minimum: number;
                    };
                };
                required: string[];
            };
            AddCustomCreation: {
                type: string;
                properties: {
                    tailleId: {
                        type: string;
                    };
                    quantity: {
                        type: string;
                        minimum: number;
                    };
                    price: {
                        type: string;
                        minimum: number;
                    };
                    fruits: {
                        type: string;
                        items: {
                            type: string;
                        };
                    };
                    sauces: {
                        type: string;
                        items: {
                            type: string;
                        };
                    };
                    cereales: {
                        type: string;
                        items: {
                            type: string;
                        };
                    };
                };
                required: string[];
            };
            UpdateCustomCreation: {
                type: string;
                properties: {
                    creationId: {
                        type: string;
                    };
                    quantity: {
                        type: string;
                        minimum: number;
                    };
                    price: {
                        type: string;
                        minimum: number;
                    };
                    fruits: {
                        type: string;
                        items: {
                            type: string;
                        };
                    };
                    sauces: {
                        type: string;
                        items: {
                            type: string;
                        };
                    };
                    cereales: {
                        type: string;
                        items: {
                            type: string;
                        };
                    };
                };
                required: string[];
            };
            CheckoutResult: {
                type: string;
                properties: {
                    orderId: {
                        type: string;
                    };
                    totalAmount: {
                        type: string;
                    };
                };
            };
            UpdateUser: {
                type: string;
                properties: {
                    name: {
                        type: string;
                    };
                    email: {
                        type: string;
                        format: string;
                    };
                    role: {
                        type: string;
                        enum: string[];
                    };
                };
            };
            Order: {
                type: string;
                properties: {
                    id: {
                        type: string;
                    };
                    userId: {
                        type: string;
                    };
                    status: {
                        type: string;
                    };
                    totalAmount: {
                        type: string;
                    };
                    items: {
                        type: string;
                        items: {
                            $ref: string;
                        };
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
            OrderItem: {
                type: string;
                properties: {
                    id: {
                        type: string;
                    };
                    productId: {
                        type: string;
                    };
                    quantity: {
                        type: string;
                    };
                    price: {
                        type: string;
                    };
                    product: {
                        $ref: string;
                    };
                };
            };
            UpdateOrderStatus: {
                type: string;
                properties: {
                    status: {
                        type: string;
                    };
                };
                required: string[];
            };
            Branding: {
                type: string;
                properties: {
                    logo: {
                        type: string;
                    };
                    primaryColor: {
                        type: string;
                    };
                    secondaryColor: {
                        type: string;
                    };
                    name: {
                        type: string;
                    };
                };
            };
            AvatarToast: {
                type: string;
                properties: {
                    image: {
                        type: string;
                    };
                    message: {
                        type: string;
                    };
                    isActive: {
                        type: string;
                    };
                };
            };
            Contact: {
                type: string;
                properties: {
                    address: {
                        type: string;
                    };
                    phone: {
                        type: string;
                    };
                    email: {
                        type: string;
                        format: string;
                    };
                };
            };
            SocialMedia: {
                type: string;
                properties: {
                    facebook: {
                        type: string;
                    };
                    instagram: {
                        type: string;
                    };
                    twitter: {
                        type: string;
                    };
                };
            };
            Testimonial: {
                type: string;
                properties: {
                    id: {
                        type: string;
                    };
                    name: {
                        type: string;
                    };
                    message: {
                        type: string;
                    };
                    image: {
                        type: string;
                    };
                    rating: {
                        type: string;
                    };
                    isActive: {
                        type: string;
                    };
                    createdAt: {
                        type: string;
                        format: string;
                    };
                };
            };
            CreateTestimonial: {
                type: string;
                properties: {
                    name: {
                        type: string;
                    };
                    message: {
                        type: string;
                    };
                    image: {
                        type: string;
                    };
                    rating: {
                        type: string;
                        minimum: number;
                        maximum: number;
                    };
                };
                required: string[];
            };
            UpdateTestimonial: {
                type: string;
                properties: {
                    name: {
                        type: string;
                    };
                    message: {
                        type: string;
                    };
                    image: {
                        type: string;
                    };
                    rating: {
                        type: string;
                        minimum: number;
                        maximum: number;
                    };
                    isActive: {
                        type: string;
                    };
                };
            };
            Hero: {
                type: string;
                properties: {
                    title: {
                        type: string;
                    };
                    subtitle: {
                        type: string;
                    };
                    backgroundImage: {
                        type: string;
                    };
                    ctaText: {
                        type: string;
                    };
                    ctaLink: {
                        type: string;
                    };
                };
            };
            CatalogSection: {
                type: string;
                properties: {
                    title: {
                        type: string;
                    };
                    description: {
                        type: string;
                    };
                    isActive: {
                        type: string;
                    };
                };
            };
            StoreHours: {
                type: string;
                properties: {
                    monday: {
                        type: string;
                    };
                    tuesday: {
                        type: string;
                    };
                    wednesday: {
                        type: string;
                    };
                    thursday: {
                        type: string;
                    };
                    friday: {
                        type: string;
                    };
                    saturday: {
                        type: string;
                    };
                    sunday: {
                        type: string;
                    };
                };
            };
            Fruit: {
                type: string;
                properties: {
                    id: {
                        type: string;
                    };
                    nom: {
                        type: string;
                    };
                    image: {
                        type: string;
                    };
                    prix: {
                        type: string;
                    };
                    active: {
                        type: string;
                    };
                    ordreAffichage: {
                        type: string;
                    };
                    creeLe: {
                        type: string;
                        format: string;
                    };
                    modifieLe: {
                        type: string;
                        format: string;
                    };
                };
            };
            CreateFruit: {
                type: string;
                properties: {
                    nom: {
                        type: string;
                    };
                    image: {
                        type: string;
                    };
                    prix: {
                        type: string;
                        minimum: number;
                    };
                    active: {
                        type: string;
                    };
                    ordreAffichage: {
                        type: string;
                    };
                };
                required: string[];
            };
            UpdateFruit: {
                type: string;
                properties: {
                    nom: {
                        type: string;
                    };
                    image: {
                        type: string;
                    };
                    prix: {
                        type: string;
                        minimum: number;
                    };
                    active: {
                        type: string;
                    };
                    ordreAffichage: {
                        type: string;
                    };
                };
            };
            Sauce: {
                type: string;
                properties: {
                    id: {
                        type: string;
                    };
                    nom: {
                        type: string;
                    };
                    image: {
                        type: string;
                    };
                    prix: {
                        type: string;
                    };
                    active: {
                        type: string;
                    };
                    ordreAffichage: {
                        type: string;
                    };
                    creeLe: {
                        type: string;
                        format: string;
                    };
                    modifieLe: {
                        type: string;
                        format: string;
                    };
                };
            };
            CreateSauce: {
                type: string;
                properties: {
                    nom: {
                        type: string;
                    };
                    image: {
                        type: string;
                    };
                    prix: {
                        type: string;
                        minimum: number;
                    };
                    active: {
                        type: string;
                    };
                    ordreAffichage: {
                        type: string;
                    };
                };
                required: string[];
            };
            UpdateSauce: {
                type: string;
                properties: {
                    nom: {
                        type: string;
                    };
                    image: {
                        type: string;
                    };
                    prix: {
                        type: string;
                        minimum: number;
                    };
                    active: {
                        type: string;
                    };
                    ordreAffichage: {
                        type: string;
                    };
                };
            };
            Cereale: {
                type: string;
                properties: {
                    id: {
                        type: string;
                    };
                    nom: {
                        type: string;
                    };
                    image: {
                        type: string;
                    };
                    prix: {
                        type: string;
                    };
                    active: {
                        type: string;
                    };
                    ordreAffichage: {
                        type: string;
                    };
                    creeLe: {
                        type: string;
                        format: string;
                    };
                    modifieLe: {
                        type: string;
                        format: string;
                    };
                };
            };
            CreateCereale: {
                type: string;
                properties: {
                    nom: {
                        type: string;
                    };
                    image: {
                        type: string;
                    };
                    prix: {
                        type: string;
                        minimum: number;
                    };
                    active: {
                        type: string;
                    };
                    ordreAffichage: {
                        type: string;
                    };
                };
                required: string[];
            };
            UpdateCereale: {
                type: string;
                properties: {
                    nom: {
                        type: string;
                    };
                    image: {
                        type: string;
                    };
                    prix: {
                        type: string;
                        minimum: number;
                    };
                    active: {
                        type: string;
                    };
                    ordreAffichage: {
                        type: string;
                    };
                };
            };
            CreateSize: {
                type: string;
                properties: {
                    nom: {
                        type: string;
                    };
                    prix: {
                        type: string;
                        minimum: number;
                    };
                    maxFruits: {
                        type: string;
                        minimum: number;
                    };
                    maxSauces: {
                        type: string;
                        minimum: number;
                    };
                    cerealesAutorise: {
                        type: string;
                    };
                    active: {
                        type: string;
                    };
                    ordreAffichage: {
                        type: string;
                    };
                };
                required: string[];
            };
            UpdateSize: {
                type: string;
                properties: {
                    nom: {
                        type: string;
                    };
                    prix: {
                        type: string;
                        minimum: number;
                    };
                    maxFruits: {
                        type: string;
                        minimum: number;
                    };
                    maxSauces: {
                        type: string;
                        minimum: number;
                    };
                    cerealesAutorise: {
                        type: string;
                    };
                    active: {
                        type: string;
                    };
                    ordreAffichage: {
                        type: string;
                    };
                };
            };
            DeliveryPerson: {
                type: string;
                properties: {
                    id: {
                        type: string;
                    };
                    nom: {
                        type: string;
                    };
                    prenom: {
                        type: string;
                    };
                    telephone: {
                        type: string;
                    };
                    email: {
                        type: string;
                        format: string;
                    };
                    active: {
                        type: string;
                    };
                    creeLe: {
                        type: string;
                        format: string;
                    };
                    modifieLe: {
                        type: string;
                        format: string;
                    };
                };
            };
            CreateDeliveryPerson: {
                type: string;
                properties: {
                    nom: {
                        type: string;
                    };
                    prenom: {
                        type: string;
                    };
                    telephone: {
                        type: string;
                    };
                    email: {
                        type: string;
                        format: string;
                    };
                    active: {
                        type: string;
                    };
                };
                required: string[];
            };
            UpdateDeliveryPerson: {
                type: string;
                properties: {
                    nom: {
                        type: string;
                    };
                    prenom: {
                        type: string;
                    };
                    telephone: {
                        type: string;
                    };
                    email: {
                        type: string;
                        format: string;
                    };
                    active: {
                        type: string;
                    };
                };
            };
            DeliveryZone: {
                type: string;
                properties: {
                    id: {
                        type: string;
                    };
                    nom: {
                        type: string;
                    };
                    description: {
                        type: string;
                    };
                    fraisLivraison: {
                        type: string;
                    };
                    active: {
                        type: string;
                    };
                    creeLe: {
                        type: string;
                        format: string;
                    };
                    modifieLe: {
                        type: string;
                        format: string;
                    };
                };
            };
            CreateDeliveryZone: {
                type: string;
                properties: {
                    nom: {
                        type: string;
                    };
                    description: {
                        type: string;
                    };
                    fraisLivraison: {
                        type: string;
                        minimum: number;
                    };
                    active: {
                        type: string;
                    };
                };
                required: string[];
            };
            UpdateDeliveryZone: {
                type: string;
                properties: {
                    nom: {
                        type: string;
                    };
                    description: {
                        type: string;
                    };
                    fraisLivraison: {
                        type: string;
                        minimum: number;
                    };
                    active: {
                        type: string;
                    };
                };
            };
            Theme: {
                type: string;
                properties: {
                    id: {
                        type: string;
                    };
                    nom: {
                        type: string;
                    };
                    description: {
                        type: string;
                    };
                    configuration: {
                        type: string;
                    };
                    actif: {
                        type: string;
                    };
                    defaut: {
                        type: string;
                    };
                    creeLe: {
                        type: string;
                        format: string;
                    };
                    modifieLe: {
                        type: string;
                        format: string;
                    };
                };
            };
            CreateTheme: {
                type: string;
                properties: {
                    nom: {
                        type: string;
                    };
                    description: {
                        type: string;
                    };
                    configuration: {
                        type: string;
                    };
                    actif: {
                        type: string;
                    };
                    defaut: {
                        type: string;
                    };
                };
                required: string[];
            };
            UpdateTheme: {
                type: string;
                properties: {
                    nom: {
                        type: string;
                    };
                    description: {
                        type: string;
                    };
                    configuration: {
                        type: string;
                    };
                    actif: {
                        type: string;
                    };
                    defaut: {
                        type: string;
                    };
                };
            };
        };
    };
};
export default swaggerDefinition;
//# sourceMappingURL=swagger.d.ts.map