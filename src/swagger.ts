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
    },
    {
      url: 'https://milnagourmetback.onrender.com',
      description: 'Serveur de production'
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
    },
    '/api/config': {
      get: {
        summary: 'Récupérer toutes les configurations',
        tags: ['Configurations'],
        responses: {
          200: {
            description: 'Configurations récupérées avec succès',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Config' }
              }
            }
          }
        }
      }
    },
    '/api/config/order-statuses': {
      get: {
        summary: 'Récupérer les configurations de statuts de commande',
        tags: ['Configurations'],
        responses: {
          200: {
            description: 'Configurations de statuts récupérées avec succès',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/OrderStatus' }
                }
              }
            }
          }
        }
      }
    },
    '/api/config/category-translations': {
      get: {
        summary: 'Récupérer les traductions de catégories',
        tags: ['Configurations'],
        responses: {
          200: {
            description: 'Traductions de catégories récupérées avec succès',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/CategoryTranslation' }
                }
              }
            }
          }
        }
      }
    },
    '/api/config/size-translations': {
      get: {
        summary: 'Récupérer les traductions de tailles',
        tags: ['Configurations'],
        responses: {
          200: {
            description: 'Traductions de tailles récupérées avec succès',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/SizeTranslation' }
                }
              }
            }
          }
        }
      }
    },
    '/api/cart': {
      get: {
        summary: 'Récupérer le panier de l\'utilisateur',
        tags: ['Panier'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Panier récupéré avec succès',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Cart' }
              }
            }
          },
          401: {
            description: 'Non autorisé'
          }
        }
      },
      post: {
        summary: 'Ajouter un produit au panier',
        tags: ['Panier'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AddToCart' }
            }
          }
        },
        responses: {
          200: {
            description: 'Produit ajouté au panier avec succès'
          },
          401: {
            description: 'Non autorisé'
          }
        }
      },
      put: {
        summary: 'Mettre à jour la quantité d\'un produit dans le panier',
        tags: ['Panier'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateCartItem' }
            }
          }
        },
        responses: {
          200: {
            description: 'Quantité mise à jour avec succès'
          },
          401: {
            description: 'Non autorisé'
          }
        }
      },
      delete: {
        summary: 'Vider le panier',
        tags: ['Panier'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Panier vidé avec succès'
          },
          401: {
            description: 'Non autorisé'
          }
        }
      }
    },
    '/api/cart/{productId}': {
      delete: {
        summary: 'Supprimer un produit du panier',
        tags: ['Panier'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'productId',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: {
            description: 'Produit supprimé du panier avec succès'
          },
          401: {
            description: 'Non autorisé'
          }
        }
      }
    },
    '/api/cart/custom': {
      post: {
        summary: 'Ajouter une création personnalisée au panier',
        tags: ['Panier'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AddCustomCreation' }
            }
          }
        },
        responses: {
          200: {
            description: 'Création personnalisée ajoutée au panier avec succès'
          },
          401: {
            description: 'Non autorisé'
          }
        }
      },
      put: {
        summary: 'Mettre à jour une création personnalisée dans le panier',
        tags: ['Panier'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateCustomCreation' }
            }
          }
        },
        responses: {
          200: {
            description: 'Création personnalisée mise à jour avec succès'
          },
          401: {
            description: 'Non autorisé'
          }
        }
      }
    },
    '/api/cart/custom/{creationId}': {
      delete: {
        summary: 'Supprimer une création personnalisée du panier',
        tags: ['Panier'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'creationId',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: {
            description: 'Création personnalisée supprimée du panier avec succès'
          },
          401: {
            description: 'Non autorisé'
          }
        }
      }
    },
    '/api/cart/checkout': {
      post: {
        summary: 'Procéder au checkout du panier',
        tags: ['Panier'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Commande créée avec succès',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CheckoutResult' }
              }
            }
          },
          401: {
            description: 'Non autorisé'
          }
        }
      }
    },
    '/api/users': {
      get: {
        summary: 'Récupérer tous les utilisateurs',
        tags: ['Utilisateurs'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Liste des utilisateurs',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/User' }
                }
              }
            }
          },
          401: {
            description: 'Non autorisé'
          }
        }
      }
    },
    '/api/users/{id}': {
      put: {
        summary: 'Mettre à jour un utilisateur',
        tags: ['Utilisateurs'],
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
              schema: { $ref: '#/components/schemas/UpdateUser' }
            }
          }
        },
        responses: {
          200: {
            description: 'Utilisateur mis à jour',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' }
              }
            }
          },
          401: {
            description: 'Non autorisé'
          },
          404: {
            description: 'Utilisateur non trouvé'
          }
        }
      },
      delete: {
        summary: 'Supprimer un utilisateur',
        tags: ['Utilisateurs'],
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
            description: 'Utilisateur supprimé'
          },
          401: {
            description: 'Non autorisé'
          },
          404: {
            description: 'Utilisateur non trouvé'
          }
        }
      }
    },
    '/api/orders': {
      post: {
        summary: 'Créer une nouvelle commande',
        tags: ['Commandes'],
        responses: {
          201: {
            description: 'Commande créée',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Order' }
              }
            }
          }
        }
      },
      get: {
        summary: 'Récupérer toutes les commandes',
        tags: ['Commandes'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Liste des commandes',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Order' }
                }
              }
            }
          },
          401: {
            description: 'Non autorisé'
          }
        }
      }
    },
    '/api/orders/my-orders': {
      get: {
        summary: 'Récupérer les commandes de l\'utilisateur connecté',
        tags: ['Commandes'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Commandes de l\'utilisateur',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Order' }
                }
              }
            }
          },
          401: {
            description: 'Non autorisé'
          }
        }
      }
    },
    '/api/orders/{id}': {
      get: {
        summary: 'Récupérer une commande par ID',
        tags: ['Commandes'],
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
          200: {
            description: 'Commande trouvée',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Order' }
              }
            }
          },
          401: {
            description: 'Non autorisé'
          },
          404: {
            description: 'Commande non trouvée'
          }
        }
      }
    },
    '/api/orders/{id}/status': {
      put: {
        summary: 'Mettre à jour le statut d\'une commande',
        tags: ['Commandes'],
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
              schema: { $ref: '#/components/schemas/UpdateOrderStatus' }
            }
          }
        },
        responses: {
          200: {
            description: 'Statut mis à jour',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Order' }
              }
            }
          },
          401: {
            description: 'Non autorisé'
          },
          404: {
            description: 'Commande non trouvée'
          }
        }
      }
    },
    '/api/upload/product-image': {
      post: {
        summary: 'Uploader une image de produit',
        tags: ['Upload'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  image: {
                    type: 'string',
                    format: 'binary',
                    description: 'Fichier image'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Image uploadée avec succès'
          },
          401: {
            description: 'Non autorisé'
          }
        }
      }
    },
    '/api/upload/logo-image': {
      post: {
        summary: 'Uploader une image de logo',
        tags: ['Upload'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  image: {
                    type: 'string',
                    format: 'binary',
                    description: 'Fichier image'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Image uploadée avec succès'
          },
          401: {
            description: 'Non autorisé'
          }
        }
      }
    },
    '/api/upload/banner-image': {
      post: {
        summary: 'Uploader une image de bannière',
        tags: ['Upload'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  image: {
                    type: 'string',
                    format: 'binary',
                    description: 'Fichier image'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Image uploadée avec succès'
          },
          401: {
            description: 'Non autorisé'
          }
        }
      }
    },
    '/api/upload/testimonial-image': {
      post: {
        summary: 'Uploader une image de témoignage',
        tags: ['Upload'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  image: {
                    type: 'string',
                    format: 'binary',
                    description: 'Fichier image'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Image uploadée avec succès'
          },
          401: {
            description: 'Non autorisé'
          }
        }
      }
    },
    '/api/upload/category-image': {
      post: {
        summary: 'Uploader une image de catégorie',
        tags: ['Upload'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  image: {
                    type: 'string',
                    format: 'binary',
                    description: 'Fichier image'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Image uploadée avec succès'
          },
          401: {
            description: 'Non autorisé'
          }
        }
      }
    },
    '/api/upload/fruit-image': {
      post: {
        summary: 'Uploader une image de fruit',
        tags: ['Upload'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  image: {
                    type: 'string',
                    format: 'binary',
                    description: 'Fichier image'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Image uploadée avec succès'
          },
          401: {
            description: 'Non autorisé'
          }
        }
      }
    },
    '/api/upload/sauce-image': {
      post: {
        summary: 'Uploader une image de sauce',
        tags: ['Upload'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  image: {
                    type: 'string',
                    format: 'binary',
                    description: 'Fichier image'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Image uploadée avec succès'
          },
          401: {
            description: 'Non autorisé'
          }
        }
      }
    },
    '/api/upload/cereale-image': {
      post: {
        summary: 'Uploader une image de céréale',
        tags: ['Upload'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  image: {
                    type: 'string',
                    format: 'binary',
                    description: 'Fichier image'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Image uploadée avec succès'
          },
          401: {
            description: 'Non autorisé'
          }
        }
      }
    },
    '/api/upload/avatar-toast-image': {
      post: {
        summary: 'Uploader une image d\'avatar pour les toasts',
        tags: ['Upload'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  image: {
                    type: 'string',
                    format: 'binary',
                    description: 'Fichier image'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Image uploadée avec succès'
          },
          401: {
            description: 'Non autorisé'
          }
        }
      }
    },
    '/api/upload/images': {
      get: {
        summary: 'Lister les images disponibles',
        tags: ['Upload'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Liste des images'
          },
          401: {
            description: 'Non autorisé'
          }
        }
      }
    },
    '/api/upload/used-images': {
      get: {
        summary: 'Récupérer les images utilisées',
        tags: ['Upload'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Images utilisées'
          },
          401: {
            description: 'Non autorisé'
          }
        }
      }
    },
    '/api/upload/images/{folder}/{filename}': {
      delete: {
        summary: 'Supprimer une image',
        tags: ['Upload'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'folder',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          },
          {
            name: 'filename',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: {
            description: 'Image supprimée'
          },
          401: {
            description: 'Non autorisé'
          }
        }
      }
    },
    '/api/site/branding': {
      get: {
        summary: 'Récupérer les informations de branding',
        tags: ['Site'],
        responses: {
          200: {
            description: 'Informations de branding'
          }
        }
      },
      put: {
        summary: 'Mettre à jour les informations de branding',
        tags: ['Site'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Branding' }
            }
          }
        },
        responses: {
          200: {
            description: 'Branding mis à jour'
          },
          401: {
            description: 'Non autorisé'
          }
        }
      }
    },
    '/api/site/avatar-toast': {
      get: {
        summary: 'Récupérer les informations d\'avatar toast',
        tags: ['Site'],
        responses: {
          200: {
            description: 'Informations d\'avatar toast'
          }
        }
      },
      put: {
        summary: 'Mettre à jour les informations d\'avatar toast',
        tags: ['Site'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AvatarToast' }
            }
          }
        },
        responses: {
          200: {
            description: 'Avatar toast mis à jour'
          },
          401: {
            description: 'Non autorisé'
          }
        }
      }
    },
    '/api/site/contact': {
      get: {
        summary: 'Récupérer les informations de contact',
        tags: ['Site'],
        responses: {
          200: {
            description: 'Informations de contact'
          }
        }
      },
      put: {
        summary: 'Mettre à jour les informations de contact',
        tags: ['Site'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Contact' }
            }
          }
        },
        responses: {
          200: {
            description: 'Contact mis à jour'
          },
          401: {
            description: 'Non autorisé'
          }
        }
      }
    },
    '/api/site/social-media': {
      get: {
        summary: 'Récupérer les liens des réseaux sociaux',
        tags: ['Site'],
        responses: {
          200: {
            description: 'Liens des réseaux sociaux'
          }
        }
      },
      put: {
        summary: 'Mettre à jour les liens des réseaux sociaux',
        tags: ['Site'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SocialMedia' }
            }
          }
        },
        responses: {
          200: {
            description: 'Réseaux sociaux mis à jour'
          },
          401: {
            description: 'Non autorisé'
          }
        }
      }
    },
    '/api/site/testimonials': {
      get: {
        summary: 'Récupérer les témoignages actifs',
        tags: ['Site'],
        responses: {
          200: {
            description: 'Témoignages actifs'
          }
        }
      },
      post: {
        summary: 'Créer un nouveau témoignage',
        tags: ['Site'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateTestimonial' }
            }
          }
        },
        responses: {
          201: {
            description: 'Témoignage créé'
          },
          401: {
            description: 'Non autorisé'
          }
        }
      }
    },
    '/api/site/testimonials/all': {
      get: {
        summary: 'Récupérer tous les témoignages',
        tags: ['Site'],
        responses: {
          200: {
            description: 'Tous les témoignages'
          }
        }
      }
    },
    '/api/site/testimonials/{id}': {
      put: {
        summary: 'Mettre à jour un témoignage',
        tags: ['Site'],
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
              schema: { $ref: '#/components/schemas/UpdateTestimonial' }
            }
          }
        },
        responses: {
          200: {
            description: 'Témoignage mis à jour'
          },
          401: {
            description: 'Non autorisé'
          },
          404: {
            description: 'Témoignage non trouvé'
          }
        }
      },
      delete: {
        summary: 'Supprimer un témoignage',
        tags: ['Site'],
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
            description: 'Témoignage supprimé'
          },
          401: {
            description: 'Non autorisé'
          },
          404: {
            description: 'Témoignage non trouvé'
          }
        }
      }
    },
    '/api/site/hero': {
      get: {
        summary: 'Récupérer les informations du hero',
        tags: ['Site'],
        responses: {
          200: {
            description: 'Informations du hero'
          }
        }
      },
      put: {
        summary: 'Mettre à jour les informations du hero',
        tags: ['Site'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Hero' }
            }
          }
        },
        responses: {
          200: {
            description: 'Hero mis à jour'
          },
          401: {
            description: 'Non autorisé'
          }
        }
      }
    },
    '/api/site/contact-section': {
      get: {
        summary: 'Récupérer les informations de la section contact',
        tags: ['Site'],
        responses: {
          200: {
            description: 'Informations de la section contact'
          }
        }
      }
    },
    '/api/site/catalog-section': {
      get: {
        summary: 'Récupérer les informations de la section catalogue',
        tags: ['Site'],
        responses: {
          200: {
            description: 'Informations de la section catalogue'
          }
        }
      },
      put: {
        summary: 'Mettre à jour les informations de la section catalogue',
        tags: ['Site'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CatalogSection' }
            }
          }
        },
        responses: {
          200: {
            description: 'Section catalogue mise à jour'
          },
          401: {
            description: 'Non autorisé'
          }
        }
      }
    },
    '/api/site/navigation': {
      get: {
        summary: 'Récupérer les informations de navigation',
        tags: ['Site'],
        responses: {
          200: {
            description: 'Informations de navigation'
          }
        }
      }
    },
    '/api/site/store-hours': {
      get: {
        summary: 'Récupérer les horaires d\'ouverture',
        tags: ['Site'],
        responses: {
          200: {
            description: 'Horaires d\'ouverture'
          }
        }
      },
      put: {
        summary: 'Mettre à jour les horaires d\'ouverture',
        tags: ['Site'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/StoreHours' }
            }
          }
        },
        responses: {
          200: {
            description: 'Horaires mis à jour'
          },
          401: {
            description: 'Non autorisé'
          }
        }
      }
    },
    '/api/creation/fruits': {
      get: {
        summary: 'Récupérer tous les fruits',
        tags: ['Création'],
        responses: {
          200: {
            description: 'Liste des fruits',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Fruit' }
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Créer un fruit',
        tags: ['Création'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateFruit' }
            }
          }
        },
        responses: {
          201: {
            description: 'Fruit créé',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Fruit' }
              }
            }
          },
          401: {
            description: 'Non autorisé'
          }
        }
      }
    },
    '/api/creation/fruits/{id}': {
      get: {
        summary: 'Récupérer un fruit par ID',
        tags: ['Création'],
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
            description: 'Fruit trouvé',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Fruit' }
              }
            }
          },
          404: {
            description: 'Fruit non trouvé'
          }
        }
      },
      put: {
        summary: 'Mettre à jour un fruit',
        tags: ['Création'],
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
              schema: { $ref: '#/components/schemas/UpdateFruit' }
            }
          }
        },
        responses: {
          200: {
            description: 'Fruit mis à jour',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Fruit' }
              }
            }
          },
          401: {
            description: 'Non autorisé'
          },
          404: {
            description: 'Fruit non trouvé'
          }
        }
      },
      delete: {
        summary: 'Supprimer un fruit',
        tags: ['Création'],
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
            description: 'Fruit supprimé'
          },
          401: {
            description: 'Non autorisé'
          },
          404: {
            description: 'Fruit non trouvé'
          }
        }
      }
    },
    '/api/creation/sauces': {
      get: {
        summary: 'Récupérer toutes les sauces',
        tags: ['Création'],
        responses: {
          200: {
            description: 'Liste des sauces',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Sauce' }
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Créer une sauce',
        tags: ['Création'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateSauce' }
            }
          }
        },
        responses: {
          201: {
            description: 'Sauce créée',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Sauce' }
              }
            }
          },
          401: {
            description: 'Non autorisé'
          }
        }
      }
    },
    '/api/creation/sauces/{id}': {
      get: {
        summary: 'Récupérer une sauce par ID',
        tags: ['Création'],
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
            description: 'Sauce trouvée',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Sauce' }
              }
            }
          },
          404: {
            description: 'Sauce non trouvée'
          }
        }
      },
      put: {
        summary: 'Mettre à jour une sauce',
        tags: ['Création'],
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
              schema: { $ref: '#/components/schemas/UpdateSauce' }
            }
          }
        },
        responses: {
          200: {
            description: 'Sauce mise à jour',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Sauce' }
              }
            }
          },
          401: {
            description: 'Non autorisé'
          },
          404: {
            description: 'Sauce non trouvée'
          }
        }
      },
      delete: {
        summary: 'Supprimer une sauce',
        tags: ['Création'],
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
            description: 'Sauce supprimée'
          },
          401: {
            description: 'Non autorisé'
          },
          404: {
            description: 'Sauce non trouvée'
          }
        }
      }
    },
    '/api/creation/cereales': {
      get: {
        summary: 'Récupérer toutes les céréales',
        tags: ['Création'],
        responses: {
          200: {
            description: 'Liste des céréales',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Cereale' }
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Créer une céréale',
        tags: ['Création'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateCereale' }
            }
          }
        },
        responses: {
          201: {
            description: 'Céréale créée',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Cereale' }
              }
            }
          },
          401: {
            description: 'Non autorisé'
          }
        }
      }
    },
    '/api/creation/cereales/{id}': {
      get: {
        summary: 'Récupérer une céréale par ID',
        tags: ['Création'],
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
            description: 'Céréale trouvée',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Cereale' }
              }
            }
          },
          404: {
            description: 'Céréale non trouvée'
          }
        }
      },
      put: {
        summary: 'Mettre à jour une céréale',
        tags: ['Création'],
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
              schema: { $ref: '#/components/schemas/UpdateCereale' }
            }
          }
        },
        responses: {
          200: {
            description: 'Céréale mise à jour',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Cereale' }
              }
            }
          },
          401: {
            description: 'Non autorisé'
          },
          404: {
            description: 'Céréale non trouvée'
          }
        }
      },
      delete: {
        summary: 'Supprimer une céréale',
        tags: ['Création'],
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
            description: 'Céréale supprimée'
          },
          401: {
            description: 'Non autorisé'
          },
          404: {
            description: 'Céréale non trouvée'
          }
        }
      }
    },
    '/api/creation/tailles': {
      get: {
        summary: 'Récupérer toutes les tailles',
        tags: ['Création'],
        responses: {
          200: {
            description: 'Liste des tailles',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Size' }
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Créer une taille',
        tags: ['Création'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateSize' }
            }
          }
        },
        responses: {
          201: {
            description: 'Taille créée',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Size' }
              }
            }
          },
          401: {
            description: 'Non autorisé'
          }
        }
      }
    },
    '/api/creation/tailles/{id}': {
      get: {
        summary: 'Récupérer une taille par ID',
        tags: ['Création'],
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
            description: 'Taille trouvée',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Size' }
              }
            }
          },
          404: {
            description: 'Taille non trouvée'
          }
        }
      },
      put: {
        summary: 'Mettre à jour une taille',
        tags: ['Création'],
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
              schema: { $ref: '#/components/schemas/UpdateSize' }
            }
          }
        },
        responses: {
          200: {
            description: 'Taille mise à jour',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Size' }
              }
            }
          },
          401: {
            description: 'Non autorisé'
          },
          404: {
            description: 'Taille non trouvée'
          }
        }
      },
      delete: {
        summary: 'Supprimer une taille',
        tags: ['Création'],
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
            description: 'Taille supprimée'
          },
          401: {
            description: 'Non autorisé'
          },
          404: {
            description: 'Taille non trouvée'
          }
        }
      }
    },
    '/api/delivery-persons': {
      get: {
        summary: 'Récupérer tous les livreurs',
        tags: ['Livreurs'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Liste des livreurs',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/DeliveryPerson' }
                }
              }
            }
          },
          401: {
            description: 'Non autorisé'
          }
        }
      },
      post: {
        summary: 'Créer un livreur',
        tags: ['Livreurs'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateDeliveryPerson' }
            }
          }
        },
        responses: {
          201: {
            description: 'Livreur créé',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/DeliveryPerson' }
              }
            }
          },
          401: {
            description: 'Non autorisé'
          }
        }
      }
    },
    '/api/delivery-persons/{id}': {
      get: {
        summary: 'Récupérer un livreur par ID',
        tags: ['Livreurs'],
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
          200: {
            description: 'Livreur trouvé',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/DeliveryPerson' }
              }
            }
          },
          401: {
            description: 'Non autorisé'
          },
          404: {
            description: 'Livreur non trouvé'
          }
        }
      },
      put: {
        summary: 'Mettre à jour un livreur',
        tags: ['Livreurs'],
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
              schema: { $ref: '#/components/schemas/UpdateDeliveryPerson' }
            }
          }
        },
        responses: {
          200: {
            description: 'Livreur mis à jour',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/DeliveryPerson' }
              }
            }
          },
          401: {
            description: 'Non autorisé'
          },
          404: {
            description: 'Livreur non trouvé'
          }
        }
      },
      delete: {
        summary: 'Supprimer un livreur',
        tags: ['Livreurs'],
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
            description: 'Livreur supprimé'
          },
          401: {
            description: 'Non autorisé'
          },
          404: {
            description: 'Livreur non trouvé'
          }
        }
      }
    },
    '/api/delivery-zones': {
      get: {
        summary: 'Récupérer toutes les zones de livraison',
        tags: ['Zones de livraison'],
        responses: {
          200: {
            description: 'Liste des zones de livraison',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/DeliveryZone' }
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Créer une zone de livraison',
        tags: ['Zones de livraison'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateDeliveryZone' }
            }
          }
        },
        responses: {
          201: {
            description: 'Zone de livraison créée',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/DeliveryZone' }
              }
            }
          },
          401: {
            description: 'Non autorisé'
          }
        }
      }
    },
    '/api/delivery-zones/active': {
      get: {
        summary: 'Récupérer les zones de livraison actives',
        tags: ['Zones de livraison'],
        responses: {
          200: {
            description: 'Zones de livraison actives',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/DeliveryZone' }
                }
              }
            }
          }
        }
      }
    },
    '/api/delivery-zones/with-orders': {
      get: {
        summary: 'Récupérer les zones de livraison avec nombre de commandes',
        tags: ['Zones de livraison'],
        responses: {
          200: {
            description: 'Zones de livraison avec nombre de commandes'
          }
        }
      }
    },
    '/api/delivery-zones/{id}': {
      get: {
        summary: 'Récupérer une zone de livraison par ID',
        tags: ['Zones de livraison'],
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
            description: 'Zone de livraison trouvée',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/DeliveryZone' }
              }
            }
          },
          404: {
            description: 'Zone de livraison non trouvée'
          }
        }
      },
      put: {
        summary: 'Mettre à jour une zone de livraison',
        tags: ['Zones de livraison'],
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
              schema: { $ref: '#/components/schemas/UpdateDeliveryZone' }
            }
          }
        },
        responses: {
          200: {
            description: 'Zone de livraison mise à jour',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/DeliveryZone' }
              }
            }
          },
          401: {
            description: 'Non autorisé'
          },
          404: {
            description: 'Zone de livraison non trouvée'
          }
        }
      },
      delete: {
        summary: 'Supprimer une zone de livraison',
        tags: ['Zones de livraison'],
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
            description: 'Zone de livraison supprimée'
          },
          401: {
            description: 'Non autorisé'
          },
          404: {
            description: 'Zone de livraison non trouvée'
          }
        }
      }
    },
    '/api/themes': {
      get: {
        summary: 'Récupérer tous les thèmes',
        tags: ['Thèmes'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Liste des thèmes',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Theme' }
                }
              }
            }
          },
          401: {
            description: 'Non autorisé'
          }
        }
      },
      post: {
        summary: 'Créer un thème',
        tags: ['Thèmes'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateTheme' }
            }
          }
        },
        responses: {
          201: {
            description: 'Thème créé',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Theme' }
              }
            }
          },
          401: {
            description: 'Non autorisé'
          }
        }
      }
    },
    '/api/themes/active': {
      get: {
        summary: 'Récupérer le thème actif',
        tags: ['Thèmes'],
        responses: {
          200: {
            description: 'Thème actif',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Theme' }
              }
            }
          }
        }
      }
    },
    '/api/themes/{id}': {
      get: {
        summary: 'Récupérer un thème par ID',
        tags: ['Thèmes'],
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
          200: {
            description: 'Thème trouvé',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Theme' }
              }
            }
          },
          401: {
            description: 'Non autorisé'
          },
          404: {
            description: 'Thème non trouvé'
          }
        }
      },
      put: {
        summary: 'Mettre à jour un thème',
        tags: ['Thèmes'],
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
              schema: { $ref: '#/components/schemas/UpdateTheme' }
            }
          }
        },
        responses: {
          200: {
            description: 'Thème mis à jour',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Theme' }
              }
            }
          },
          401: {
            description: 'Non autorisé'
          },
          404: {
            description: 'Thème non trouvé'
          }
        }
      },
      delete: {
        summary: 'Supprimer un thème',
        tags: ['Thèmes'],
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
            description: 'Thème supprimé'
          },
          401: {
            description: 'Non autorisé'
          },
          404: {
            description: 'Thème non trouvé'
          }
        }
      }
    },
    '/api/themes/{id}/active': {
      patch: {
        summary: 'Définir un thème comme actif',
        tags: ['Thèmes'],
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
          200: {
            description: 'Thème défini comme actif'
          },
          401: {
            description: 'Non autorisé'
          }
        }
      }
    },
    '/api/themes/{id}/default': {
      patch: {
        summary: 'Définir un thème comme défaut',
        tags: ['Thèmes'],
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
          200: {
            description: 'Thème défini comme défaut'
          },
          401: {
            description: 'Non autorisé'
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
      },
      Config: {
        type: 'object',
        properties: {
          orderStatuses: {
            type: 'array',
            items: { $ref: '#/components/schemas/OrderStatus' }
          },
          categoryTranslations: {
            type: 'array',
            items: { $ref: '#/components/schemas/CategoryTranslation' }
          },
          sizeTranslations: {
            type: 'array',
            items: { $ref: '#/components/schemas/SizeTranslation' }
          }
        }
      },
      OrderStatus: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          statut: { type: 'string' },
          libelleFr: { type: 'string' },
          couleurBg: { type: 'string' },
          couleurText: { type: 'string' },
          icone: { type: 'string' },
          ordre: { type: 'integer' },
          creeLe: { type: 'string', format: 'date-time' },
          modifieLe: { type: 'string', format: 'date-time' }
        }
      },
      CategoryTranslation: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          categorieId: { type: 'integer' },
          code: { type: 'string' },
          libelleFr: { type: 'string' },
          creeLe: { type: 'string', format: 'date-time' },
          modifieLe: { type: 'string', format: 'date-time' },
          categorie: { $ref: '#/components/schemas/Category' }
        }
      },
      SizeTranslation: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          tailleId: { type: 'integer' },
          code: { type: 'string' },
          libelleFr: { type: 'string' },
          creeLe: { type: 'string', format: 'date-time' },
          modifieLe: { type: 'string', format: 'date-time' },
          taille: { $ref: '#/components/schemas/Size' }
        }
      },
      Size: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          nom: { type: 'string' },
          prix: { type: 'number' },
          maxFruits: { type: 'integer' },
          maxSauces: { type: 'integer' },
          cerealesAutorise: { type: 'boolean' },
          active: { type: 'boolean' },
          ordreAffichage: { type: 'integer' },
          creeLe: { type: 'string', format: 'date-time' },
          modifieLe: { type: 'string', format: 'date-time' }
        }
      },
      Cart: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          userId: { type: 'string' },
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/CartItem' }
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      CartItem: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number' },
          quantity: { type: 'integer' },
          image: { type: 'string' },
          customCreation: { $ref: '#/components/schemas/CustomCreation' }
        }
      },
      CustomCreation: {
        type: 'object',
        properties: {
          size: { $ref: '#/components/schemas/Size' },
          selectedFruits: {
            type: 'array',
            items: { type: 'string' }
          },
          selectedSauces: {
            type: 'array',
            items: { type: 'string' }
          },
          selectedCereales: {
            type: 'array',
            items: { type: 'string' }
          },
          totalPrice: { type: 'number' }
        }
      },
      AddToCart: {
        type: 'object',
        properties: {
          productId: { type: 'integer' },
          quantity: { type: 'integer', minimum: 1 }
        },
        required: ['productId', 'quantity']
      },
      UpdateCartItem: {
        type: 'object',
        properties: {
          productId: { type: 'integer' },
          quantity: { type: 'integer', minimum: 0 }
        },
        required: ['productId', 'quantity']
      },
      AddCustomCreation: {
        type: 'object',
        properties: {
          tailleId: { type: 'integer' },
          quantity: { type: 'integer', minimum: 1 },
          price: { type: 'number', minimum: 0 },
          fruits: {
            type: 'array',
            items: { type: 'string' }
          },
          sauces: {
            type: 'array',
            items: { type: 'string' }
          },
          cereales: {
            type: 'array',
            items: { type: 'string' }
          }
        },
        required: ['tailleId', 'quantity', 'price']
      },
      UpdateCustomCreation: {
        type: 'object',
        properties: {
          creationId: { type: 'integer' },
          quantity: { type: 'integer', minimum: 1 },
          price: { type: 'number', minimum: 0 },
          fruits: {
            type: 'array',
            items: { type: 'string' }
          },
          sauces: {
            type: 'array',
            items: { type: 'string' }
          },
          cereales: {
            type: 'array',
            items: { type: 'string' }
          }
        },
        required: ['creationId']
      },
      CheckoutResult: {
        type: 'object',
        properties: {
          orderId: { type: 'integer' },
          totalAmount: { type: 'number' }
        }
      },
      UpdateUser: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: { type: 'string', enum: ['USER', 'ADMIN'] }
        }
      },
      Order: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          userId: { type: 'integer' },
          status: { type: 'string' },
          totalAmount: { type: 'number' },
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/OrderItem' }
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      OrderItem: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          productId: { type: 'integer' },
          quantity: { type: 'integer' },
          price: { type: 'number' },
          product: { $ref: '#/components/schemas/Product' }
        }
      },
      UpdateOrderStatus: {
        type: 'object',
        properties: {
          status: { type: 'string' }
        },
        required: ['status']
      },
      Branding: {
        type: 'object',
        properties: {
          logo: { type: 'string' },
          primaryColor: { type: 'string' },
          secondaryColor: { type: 'string' },
          name: { type: 'string' }
        }
      },
      AvatarToast: {
        type: 'object',
        properties: {
          image: { type: 'string' },
          message: { type: 'string' },
          isActive: { type: 'boolean' }
        }
      },
      Contact: {
        type: 'object',
        properties: {
          address: { type: 'string' },
          phone: { type: 'string' },
          email: { type: 'string', format: 'email' }
        }
      },
      SocialMedia: {
        type: 'object',
        properties: {
          facebook: { type: 'string' },
          instagram: { type: 'string' },
          twitter: { type: 'string' }
        }
      },
      Testimonial: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          message: { type: 'string' },
          image: { type: 'string' },
          rating: { type: 'integer' },
          isActive: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      CreateTestimonial: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          message: { type: 'string' },
          image: { type: 'string' },
          rating: { type: 'integer', minimum: 1, maximum: 5 }
        },
        required: ['name', 'message', 'rating']
      },
      UpdateTestimonial: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          message: { type: 'string' },
          image: { type: 'string' },
          rating: { type: 'integer', minimum: 1, maximum: 5 },
          isActive: { type: 'boolean' }
        }
      },
      Hero: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          subtitle: { type: 'string' },
          backgroundImage: { type: 'string' },
          ctaText: { type: 'string' },
          ctaLink: { type: 'string' }
        }
      },
      CatalogSection: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          isActive: { type: 'boolean' }
        }
      },
      StoreHours: {
        type: 'object',
        properties: {
          monday: { type: 'string' },
          tuesday: { type: 'string' },
          wednesday: { type: 'string' },
          thursday: { type: 'string' },
          friday: { type: 'string' },
          saturday: { type: 'string' },
          sunday: { type: 'string' }
        }
      },
      Fruit: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          nom: { type: 'string' },
          image: { type: 'string' },
          prix: { type: 'number' },
          active: { type: 'boolean' },
          ordreAffichage: { type: 'integer' },
          creeLe: { type: 'string', format: 'date-time' },
          modifieLe: { type: 'string', format: 'date-time' }
        }
      },
      CreateFruit: {
        type: 'object',
        properties: {
          nom: { type: 'string' },
          image: { type: 'string' },
          prix: { type: 'number', minimum: 0 },
          active: { type: 'boolean' },
          ordreAffichage: { type: 'integer' }
        },
        required: ['nom', 'prix']
      },
      UpdateFruit: {
        type: 'object',
        properties: {
          nom: { type: 'string' },
          image: { type: 'string' },
          prix: { type: 'number', minimum: 0 },
          active: { type: 'boolean' },
          ordreAffichage: { type: 'integer' }
        }
      },
      Sauce: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          nom: { type: 'string' },
          image: { type: 'string' },
          prix: { type: 'number' },
          active: { type: 'boolean' },
          ordreAffichage: { type: 'integer' },
          creeLe: { type: 'string', format: 'date-time' },
          modifieLe: { type: 'string', format: 'date-time' }
        }
      },
      CreateSauce: {
        type: 'object',
        properties: {
          nom: { type: 'string' },
          image: { type: 'string' },
          prix: { type: 'number', minimum: 0 },
          active: { type: 'boolean' },
          ordreAffichage: { type: 'integer' }
        },
        required: ['nom', 'prix']
      },
      UpdateSauce: {
        type: 'object',
        properties: {
          nom: { type: 'string' },
          image: { type: 'string' },
          prix: { type: 'number', minimum: 0 },
          active: { type: 'boolean' },
          ordreAffichage: { type: 'integer' }
        }
      },
      Cereale: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          nom: { type: 'string' },
          image: { type: 'string' },
          prix: { type: 'number' },
          active: { type: 'boolean' },
          ordreAffichage: { type: 'integer' },
          creeLe: { type: 'string', format: 'date-time' },
          modifieLe: { type: 'string', format: 'date-time' }
        }
      },
      CreateCereale: {
        type: 'object',
        properties: {
          nom: { type: 'string' },
          image: { type: 'string' },
          prix: { type: 'number', minimum: 0 },
          active: { type: 'boolean' },
          ordreAffichage: { type: 'integer' }
        },
        required: ['nom', 'prix']
      },
      UpdateCereale: {
        type: 'object',
        properties: {
          nom: { type: 'string' },
          image: { type: 'string' },
          prix: { type: 'number', minimum: 0 },
          active: { type: 'boolean' },
          ordreAffichage: { type: 'integer' }
        }
      },
      CreateSize: {
        type: 'object',
        properties: {
          nom: { type: 'string' },
          prix: { type: 'number', minimum: 0 },
          maxFruits: { type: 'integer', minimum: 0 },
          maxSauces: { type: 'integer', minimum: 0 },
          cerealesAutorise: { type: 'boolean' },
          active: { type: 'boolean' },
          ordreAffichage: { type: 'integer' }
        },
        required: ['nom', 'prix', 'maxFruits', 'maxSauces']
      },
      UpdateSize: {
        type: 'object',
        properties: {
          nom: { type: 'string' },
          prix: { type: 'number', minimum: 0 },
          maxFruits: { type: 'integer', minimum: 0 },
          maxSauces: { type: 'integer', minimum: 0 },
          cerealesAutorise: { type: 'boolean' },
          active: { type: 'boolean' },
          ordreAffichage: { type: 'integer' }
        }
      },
      DeliveryPerson: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          nom: { type: 'string' },
          prenom: { type: 'string' },
          telephone: { type: 'string' },
          email: { type: 'string', format: 'email' },
          active: { type: 'boolean' },
          creeLe: { type: 'string', format: 'date-time' },
          modifieLe: { type: 'string', format: 'date-time' }
        }
      },
      CreateDeliveryPerson: {
        type: 'object',
        properties: {
          nom: { type: 'string' },
          prenom: { type: 'string' },
          telephone: { type: 'string' },
          email: { type: 'string', format: 'email' },
          active: { type: 'boolean' }
        },
        required: ['nom', 'prenom', 'telephone', 'email']
      },
      UpdateDeliveryPerson: {
        type: 'object',
        properties: {
          nom: { type: 'string' },
          prenom: { type: 'string' },
          telephone: { type: 'string' },
          email: { type: 'string', format: 'email' },
          active: { type: 'boolean' }
        }
      },
      DeliveryZone: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          nom: { type: 'string' },
          description: { type: 'string' },
          fraisLivraison: { type: 'number' },
          active: { type: 'boolean' },
          creeLe: { type: 'string', format: 'date-time' },
          modifieLe: { type: 'string', format: 'date-time' }
        }
      },
      CreateDeliveryZone: {
        type: 'object',
        properties: {
          nom: { type: 'string' },
          description: { type: 'string' },
          fraisLivraison: { type: 'number', minimum: 0 },
          active: { type: 'boolean' }
        },
        required: ['nom', 'fraisLivraison']
      },
      UpdateDeliveryZone: {
        type: 'object',
        properties: {
          nom: { type: 'string' },
          description: { type: 'string' },
          fraisLivraison: { type: 'number', minimum: 0 },
          active: { type: 'boolean' }
        }
      },
      Theme: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          nom: { type: 'string' },
          description: { type: 'string' },
          configuration: { type: 'object' },
          actif: { type: 'boolean' },
          defaut: { type: 'boolean' },
          creeLe: { type: 'string', format: 'date-time' },
          modifieLe: { type: 'string', format: 'date-time' }
        }
      },
      CreateTheme: {
        type: 'object',
        properties: {
          nom: { type: 'string' },
          description: { type: 'string' },
          configuration: { type: 'object' },
          actif: { type: 'boolean' },
          defaut: { type: 'boolean' }
        },
        required: ['nom']
      },
      UpdateTheme: {
        type: 'object',
        properties: {
          nom: { type: 'string' },
          description: { type: 'string' },
          configuration: { type: 'object' },
          actif: { type: 'boolean' },
          defaut: { type: 'boolean' }
        }
      }
    }
  }
};

export default swaggerDefinition;