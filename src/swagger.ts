const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Milna Gourmet API',
    version: '1.0.0',
    description: 'API pour l\'application Milna Gourmet'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Serveur de développement'
    }
  ],
  paths: {
    '/api/auth/register': {
      post: {
        summary: 'Inscription d\'un nouvel utilisateur',
        tags: ['Authentification'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterUser' }
            }
          }
        },
        responses: {
          201: {
            description: 'Utilisateur inscrit avec succès',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' }
              }
            }
          },
          400: {
            description: 'Requête invalide'
          }
        }
      }
    },
    '/api/auth/login': {
      post: {
        summary: 'Connexion d\'un utilisateur',
        tags: ['Authentification'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginUser' }
            }
          }
        },
        responses: {
          200: {
            description: 'Connexion réussie',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' }
              }
            }
          },
          401: {
            description: 'Identifiants invalides'
          }
        }
      }
    },
    '/api/auth/refresh': {
      post: {
        summary: 'Rafraîchir le token d\'accès',
        tags: ['Authentification'],
        responses: {
          200: {
            description: 'Token rafraîchi',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { token: { type: 'string' } } }
              }
            }
          },
          401: {
            description: 'Token invalide'
          }
        }
      }
    },
    '/api/auth/logout': {
      post: {
        summary: 'Déconnexion',
        tags: ['Authentification'],
        responses: {
          200: {
            description: 'Déconnexion réussie'
          }
        }
      }
    },
    '/api/auth/logout-all': {
      post: {
        summary: 'Déconnexion de tous les appareils',
        tags: ['Authentification'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Déconnexion de tous les appareils réussie'
          },
          401: {
            description: 'Non autorisé'
          }
        }
      }
    },
    '/api/auth/me': {
      get: {
        summary: 'Récupérer le profil de l\'utilisateur connecté',
        tags: ['Authentification'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Profil utilisateur',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' }
              }
            }
          },
          401: {
            description: 'Non autorisé'
          }
        }
      }
    },
    '/api/auth/profile': {
      put: {
        summary: 'Mettre à jour le profil de l\'utilisateur connecté',
        tags: ['Authentification'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateProfile' }
            }
          }
        },
        responses: {
          200: {
            description: 'Profil mis à jour',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' }
              }
            }
          },
          401: {
            description: 'Non autorisé'
          }
        }
      }
    },
    '/api/auth/account': {
      delete: {
        summary: 'Supprimer le compte de l\'utilisateur connecté',
        tags: ['Authentification'],
        security: [{ bearerAuth: [] }],
        responses: {
          204: {
            description: 'Compte supprimé'
          },
          401: {
            description: 'Non autorisé'
          }
        }
      }
    },
    '/api/categories': {
      get: {
        summary: 'Récupérer toutes les catégories',
        tags: ['Catégories'],
        responses: {
          200: {
            description: 'Liste des catégories',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Category' }
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Créer une catégorie',
        tags: ['Catégories'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateCategory' }
            }
          }
        },
        responses: {
          201: {
            description: 'Catégorie créée',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Category' }
              }
            }
          },
          401: {
            description: 'Non autorisé'
          }
        }
      }
    },
    '/api/categories/{id}': {
      get: {
        summary: 'Récupérer une catégorie par ID',
        tags: ['Catégories'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: {
            description: 'Catégorie trouvée',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Category' }
              }
            }
          },
          404: {
            description: 'Catégorie non trouvée'
          }
        }
      },
      put: {
        summary: 'Mettre à jour une catégorie',
        tags: ['Catégories'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateCategory' }
            }
          }
        },
        responses: {
          200: {
            description: 'Catégorie mise à jour',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Category' }
              }
            }
          },
          401: {
            description: 'Non autorisé'
          },
          404: {
            description: 'Catégorie non trouvée'
          }
        }
      },
      delete: {
        summary: 'Supprimer une catégorie',
        tags: ['Catégories'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          204: {
            description: 'Catégorie supprimée'
          },
          401: {
            description: 'Non autorisé'
          },
          404: {
            description: 'Catégorie non trouvée'
          }
        }
      }
    },
    '/api/products': {
      get: {
        summary: 'Récupérer tous les produits',
        tags: ['Produits'],
        responses: {
          200: {
            description: 'Liste des produits',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Product' }
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Créer un produit',
        tags: ['Produits'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateProduct' }
            }
          }
        },
        responses: {
          201: {
            description: 'Produit créé',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Product' }
              }
            }
          },
          401: {
            description: 'Non autorisé'
          }
        }
      }
    },
    '/api/products/{id}': {
      get: {
        summary: 'Récupérer un produit par ID',
        tags: ['Produits'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: {
            description: 'Produit trouvé',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Product' }
              }
            }
          },
          404: {
            description: 'Produit non trouvé'
          }
        }
      },
      put: {
        summary: 'Mettre à jour un produit',
        tags: ['Produits'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateProduct' }
            }
          }
        },
        responses: {
          200: {
            description: 'Produit mis à jour',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Product' }
              }
            }
          },
          401: {
            description: 'Non autorisé'
          },
          404: {
            description: 'Produit non trouvé'
          }
        }
      },
      delete: {
        summary: 'Supprimer un produit',
        tags: ['Produits'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          204: {
            description: 'Produit supprimé'
          },
          401: {
            description: 'Non autorisé'
          },
          404: {
            description: 'Produit non trouvé'
          }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          email: { type: 'string', format: 'email' },
          name: { type: 'string' },
          role: { type: 'string', enum: ['USER', 'ADMIN'] },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      RegisterUser: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
          name: { type: 'string', minLength: 1 }
        },
        required: ['email', 'password', 'name']
      },
      LoginUser: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 1 }
        },
        required: ['email', 'password']
      },
      UpdateProfile: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1 },
          email: { type: 'string', format: 'email' }
        }
      },
      Category: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          description: { type: 'string' },
          image: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      CreateCategory: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1 },
          description: { type: 'string' },
          image: { type: 'string' }
        },
        required: ['name']
      },
      UpdateCategory: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1 },
          description: { type: 'string' },
          image: { type: 'string' }
        }
      },
      Product: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number' },
          image: { type: 'string' },
          categoryId: { type: 'integer' },
          category: { $ref: '#/components/schemas/Category' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      CreateProduct: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1 },
          description: { type: 'string' },
          price: { type: 'number', minimum: 0 },
          categoryId: { type: 'integer', minimum: 1 },
          image: { type: 'string' }
        },
        required: ['name', 'price', 'categoryId']
      },
      UpdateProduct: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1 },
          description: { type: 'string' },
          price: { type: 'number', minimum: 0 },
          categoryId: { type: 'integer', minimum: 1 },
          image: { type: 'string' }
        }
      }
    }
  }
};

export default swaggerDefinition;