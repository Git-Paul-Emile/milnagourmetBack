import { prisma } from "../config/database.js";
class OrderRepository {
    async create(data) {
        try {
            const order = await prisma.commande.create({
                data: {
                    numeroCommande: data.numeroCommande,
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
        }
        catch (error) {
            console.error('Erreur lors de la création de la commande:', error);
            throw new Error('Impossible de créer la commande');
        }
    }
    async findAll(options = {}) {
        try {
            const { page, limit, search, status, sortBy = 'date', sortOrder = 'desc' } = options;
            const where = {};
            if (status) {
                where.statut = status;
            }
            if (search) {
                where.OR = [
                    { numeroCommande: { contains: search, mode: 'insensitive' } },
                    { nomClient: { contains: search, mode: 'insensitive' } },
                    { telephoneClient: { contains: search } },
                    { utilisateur: { nomComplet: { contains: search, mode: 'insensitive' } } },
                    { utilisateur: { telephone: { contains: search } } }
                ];
            }
            const orderByMap = {
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
        }
        catch (error) {
            console.error('Erreur lors de la récupération des commandes:', error);
            throw new Error('Impossible de récupérer les commandes');
        }
    }
    async findById(id) {
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
        }
        catch (error) {
            console.error('Erreur lors de la récupération de la commande:', error);
            throw new Error('Impossible de récupérer la commande');
        }
    }
    async findByUserId(utilisateurId) {
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
        }
        catch (error) {
            console.error('Erreur lors de la récupération des commandes de l\'utilisateur:', error);
            throw new Error('Impossible de récupérer les commandes de l\'utilisateur');
        }
    }
    async updateStatus(id, statut) {
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
        }
        catch (error) {
            console.error('Erreur lors de la mise à jour du statut de la commande:', error);
            throw error;
        }
    }
    async assignDeliveryPerson(id, livreurId) {
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
        }
        catch (error) {
            console.error('Erreur lors de l\'assignation du livreur à la commande:', error);
            throw error;
        }
    }
}
export default new OrderRepository();
//# sourceMappingURL=order.repository.js.map