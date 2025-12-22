import { prisma } from '../config/database.js';
import { AppError } from '../utils/AppError.js';
class CatalogService {
    async getCatalogSectionData() {
        try {
            const catalog = await prisma.sectionCatalogue.findFirst();
            if (!catalog) {
                throw new AppError('Données Catalogue non trouvées', 404);
            }
            return {
                title: catalog.titre,
                description: catalog.description,
                creationTitle: catalog.titreCreation,
                creationDescription: catalog.descriptionCreation,
                creationButtonText: catalog.boutonCreation,
                creationImage: catalog.imageCreation,
                emptyMessage: catalog.messageVide,
                emptySubMessage: catalog.messageVideSecondaire
            };
        }
        catch (error) {
            console.error('Erreur lors de la récupération des données Catalogue:', error);
            throw error;
        }
    }
    async updateCatalogSectionData(data) {
        try {
            const catalog = await prisma.sectionCatalogue.findFirst();
            if (!catalog) {
                throw new AppError('Données Catalogue non trouvées', 404);
            }
            const updatedCatalog = await prisma.sectionCatalogue.update({
                where: { id: catalog.id },
                data: {
                    titre: data.title,
                    description: data.description,
                    titreCreation: data.creationTitle,
                    descriptionCreation: data.creationDescription,
                    boutonCreation: data.creationButtonText,
                    imageCreation: data.creationImage,
                    messageVide: data.emptyMessage,
                    messageVideSecondaire: data.emptySubMessage
                }
            });
            return {
                title: updatedCatalog.titre,
                description: updatedCatalog.description,
                creationTitle: updatedCatalog.titreCreation,
                creationDescription: updatedCatalog.descriptionCreation,
                creationButtonText: updatedCatalog.boutonCreation,
                creationImage: updatedCatalog.imageCreation,
                emptyMessage: updatedCatalog.messageVide,
                emptySubMessage: updatedCatalog.messageVideSecondaire
            };
        }
        catch (error) {
            console.error('Erreur lors de la mise à jour des données Catalogue:', error);
            throw error;
        }
    }
}
export default new CatalogService();
//# sourceMappingURL=catalog.service.js.map