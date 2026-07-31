import { prisma } from "../config/database.js"
import type { Commande, ElementCommande, CreationPersonnalisee, Utilisateur, Livreur, Produit, TailleCreation, StatutCommande, Prisma } from "@prisma/client"
import { logger } from '../config/logger.js';

export interface OrderListOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: StatutCommande;
  sortBy?: 'date' | 'total' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedOrders {
  items: CommandeWithRelations[];
  total: number;
}

export type CommandeWithRelations = Commande & {
  utilisateur: Utilisateur | null;
  elements: (ElementCommande & { produit: Produit })[];
  creationsPersonnalisees: (CreationPersonnalisee & {
    taille: TailleCreation;
    fruits: { fruit: { nom: string } }[];
    sauces: { sauce: { nom: string } }[];
    cereales: { cereale: { nom: string } }[];
  })[];
  livreur: Livreur | null;
}

interface CreateOrderData {
  numeroCommande: string;
  utilisateurId?: number;
  nomClient: string;
  telephoneClient: string;
  /** Email de contact saisi à la commande : sert au repli des notifications. */
  emailClient?: string | null;
  montantTotal: number;
  fraisLivraison?: number;
  notes?: string;
  livreurId?: number;
  elements: {
    produitId: number;
    quantite: number;
    prix: number;
  }[];
  creations?: {
    tailleId: number;
    quantite: number;
    prix: number;
    fruits?: { fruitId: number }[];
    sauces?: { sauceId: number }[];
    cereales?: { cerealeId: number }[];
  }[];
}

class OrderRepository {

    async create(data: CreateOrderData): Promise<CommandeWithRelations> {
      try {
        const order = await prisma.commande.create({
          data: {
            numeroCommande: data.numeroCommande,
            utilisateurId: data.utilisateurId,
            nomClient: data.nomClient,
            telephoneClient: data.telephoneClient,
            emailClient: data.emailClient ?? null,
            montantTotal: data.montantTotal,
            fraisLivraison: data.fraisLivraison || 0,
            notes: data.notes,
            livreurId: data.livreurId,
            elements: {
              create: data.elements
            },
            creationsPersonnalisees: data.creations ? {
              create: data.creations.map(creation => ({
                tailleId: creation.tailleId,
                quantite: creation.quantite,
                prix: creation.prix,
                fruits: creation.fruits ? {
                  create: creation.fruits
                } : undefined,
                sauces: creation.sauces ? {
                  create: creation.sauces
                } : undefined,
                cereales: creation.cereales ? {
                  create: creation.cereales
                } : undefined
              }))
            } : undefined
          },
          include: {
            elements: {
              include: {
                produit: true
              }
            },
            creationsPersonnalisees: {
              include: {
                taille: true,
                fruits: {
                  include: {
                    fruit: true
                  }
                },
                sauces: {
                  include: {
                    sauce: true
                  }
                },
                cereales: {
                  include: {
                    cereale: true
                  }
                }
              }
            },
            utilisateur: true,
            livreur: true
          }
        });
        return order;
      } catch (error) {
        logger.error({ err: error }, 'Erreur lors de la création de la commande:');
        throw new Error('Impossible de créer la commande');
      }
    }

    async findAll(options: OrderListOptions = {}): Promise<PaginatedOrders> {
        try {
            const { page, limit, search, status, sortBy = 'date', sortOrder = 'desc' } = options;

            const where: Prisma.CommandeWhereInput = {};
            if (status) {
              where.statut = status;
            }
            if (search) {
              where.OR = [
                { numeroCommande: { contains: search, mode: 'insensitive' } },
                { nomClient: { contains: search, mode: 'insensitive' } },
                { telephoneClient: { contains: search } },
                { emailClient: { contains: search, mode: 'insensitive' } },
                { utilisateur: { nomComplet: { contains: search, mode: 'insensitive' } } },
                { utilisateur: { telephone: { contains: search } } }
              ];
            }

            const orderByMap: Record<'date' | 'total' | 'status', Prisma.CommandeOrderByWithRelationInput> = {
              date: { creeLe: sortOrder },
              total: { montantTotal: sortOrder },
              status: { statut: sortOrder }
            };

            const isPaginated = page !== undefined && limit !== undefined;

            const [orders, total] = await Promise.all([
              prisma.commande.findMany({
                where,
                include: {
                  elements: {
                    include: {
                      produit: true
                    }
                  },
                  creationsPersonnalisees: {
                    include: {
                      taille: true,
                      fruits: {
                        include: {
                          fruit: true
                        }
                      },
                      sauces: {
                        include: {
                          sauce: true
                        }
                      },
                      cereales: {
                        include: {
                          cereale: true
                        }
                      }
                    }
                  },
                  utilisateur: true,
                  livreur: true
                },
                orderBy: orderByMap[sortBy],
                ...(isPaginated ? { skip: (page - 1) * limit, take: limit } : {})
              }),
              prisma.commande.count({ where })
            ]);

            return { items: orders, total };
        } catch (error) {
            logger.error({ err: error }, 'Erreur lors de la récupération des commandes:');
            throw new Error('Impossible de récupérer les commandes');
        }
    }

    async findById(id: number): Promise<CommandeWithRelations | null> {
        try {
            const order = await prisma.commande.findUnique({
                where: { id },
                include: {
                  elements: {
                    include: {
                      produit: true
                    }
                  },
                  creationsPersonnalisees: {
                    include: {
                      taille: true,
                      fruits: {
                        include: {
                          fruit: true
                        }
                      },
                      sauces: {
                        include: {
                          sauce: true
                        }
                      },
                      cereales: {
                        include: {
                          cereale: true
                        }
                      }
                    }
                  },
                  utilisateur: true,
                  livreur: true
                }
            });
            return order;
        } catch (error) {
            logger.error({ err: error }, 'Erreur lors de la récupération de la commande:');
            throw new Error('Impossible de récupérer la commande');
        }
    }

    async findByUserId(utilisateurId: number): Promise<CommandeWithRelations[]> {
        try {
            const orders = await prisma.commande.findMany({
                where: { utilisateurId },
                include: {
                  elements: {
                    include: {
                      produit: true
                    }
                  },
                  creationsPersonnalisees: {
                    include: {
                      taille: true,
                      fruits: {
                        include: {
                          fruit: true
                        }
                      },
                      sauces: {
                        include: {
                          sauce: true
                        }
                      },
                      cereales: {
                        include: {
                          cereale: true
                        }
                      }
                    }
                  },
                  utilisateur: true,
                  livreur: true
                },
                orderBy: {
                  creeLe: 'desc'
                }
            });
            return orders;
        } catch (error) {
            logger.error({ err: error }, 'Erreur lors de la récupération des commandes de l\'utilisateur:');
            throw new Error('Impossible de récupérer les commandes de l\'utilisateur');
        }
    }

    async updateStatus(id: number, statut: StatutCommande): Promise<CommandeWithRelations> {
        try {
            const order = await prisma.commande.update({
                where: { id },
                data: { statut },
                include: {
                  elements: {
                    include: {
                      produit: true
                    }
                  },
                  creationsPersonnalisees: {
                    include: {
                      taille: true,
                      fruits: {
                        include: {
                          fruit: true
                        }
                      },
                      sauces: {
                        include: {
                          sauce: true
                        }
                      },
                      cereales: {
                        include: {
                          cereale: true
                        }
                      }
                    }
                  },
                  utilisateur: true,
                  livreur: true
                }
            });
            return order;
        } catch (error) {
            logger.error({ err: error }, 'Erreur lors de la mise à jour du statut de la commande:');
            throw error;
        }
    }

    async assignDeliveryPerson(id: number, livreurId: number | null): Promise<CommandeWithRelations> {
        try {
            const order = await prisma.commande.update({
                where: { id },
                data: { livreurId },
                include: {
                  elements: {
                    include: {
                      produit: true
                    }
                  },
                  creationsPersonnalisees: {
                    include: {
                      taille: true,
                      fruits: {
                        include: {
                          fruit: true
                        }
                      },
                      sauces: {
                        include: {
                          sauce: true
                        }
                      },
                      cereales: {
                        include: {
                          cereale: true
                        }
                      }
                    }
                  },
                  utilisateur: true,
                  livreur: true
                }
            });
            return order;
        } catch (error) {
            logger.error({ err: error }, 'Erreur lors de l\'assignation du livreur à la commande:');
            throw error;
        }
    }

}

export default new OrderRepository();