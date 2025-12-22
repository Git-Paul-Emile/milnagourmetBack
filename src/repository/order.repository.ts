import { prisma } from "../config/database.js"
import type { Commande, ElementCommande, CreationPersonnalisee, Utilisateur, Livreur, Produit } from "@prisma/client"

export type CommandeWithRelations = Commande & {
  utilisateur: any;
  elements: (ElementCommande & { produit: Produit })[];
  creationsPersonnalisees: (CreationPersonnalisee & {
    taille: any;
    fruits: { fruit: { nom: string } }[];
    sauces: { sauce: { nom: string } }[];
    cereales: { cereale: { nom: string } }[];
  })[];
  livreur: Livreur | null;
}

interface CreateOrderData {
  utilisateurId?: number;
  nomClient: string;
  telephoneClient: string;
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
            utilisateurId: data.utilisateurId,
            nomClient: data.nomClient,
            telephoneClient: data.telephoneClient,
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
        console.error('Erreur lors de la création de la commande:', error);
        throw new Error('Impossible de créer la commande');
      }
    }

    async findAll(): Promise<CommandeWithRelations[]> {
        try {
            const orders = await prisma.commande.findMany({
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
            console.error('Erreur lors de la récupération des commandes:', error);
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
            console.error('Erreur lors de la récupération de la commande:', error);
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
            console.error('Erreur lors de la récupération des commandes de l\'utilisateur:', error);
            throw new Error('Impossible de récupérer les commandes de l\'utilisateur');
        }
    }

    async updateStatus(id: number, statut: string): Promise<CommandeWithRelations> {
        try {
            const order = await prisma.commande.update({
                where: { id },
                data: { statut: statut as any },
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
            console.error('Erreur lors de la mise à jour du statut de la commande:', error);
            throw new Error('Impossible de mettre à jour le statut de la commande');
        }
    }

}

export default new OrderRepository();