import temoinageRepository from '../repository/temoinage.repository.js';
import type { Temoinage } from '@prisma/client';

class TemoinageService {
  private temoinageRepository = temoinageRepository;

  async getAllTestimonials(includeInactive: boolean = false): Promise<any[]> {
    try {
      const testimonials = includeInactive
        ? await this.temoinageRepository.findAll()
        : await this.temoinageRepository.findAllActive();

      // Convertir vers le format attendu par l'API
      return testimonials.map((testimonial: Temoinage) => ({
        id: testimonial.id,
        name: testimonial.nom,
        location: testimonial.lieu,
        rating: testimonial.note,
        comment: testimonial.commentaire,
        avatar: testimonial.avatar && testimonial.avatar.startsWith('/uploads/') ? `https://milnagourmetback.onrender.com${testimonial.avatar}` : testimonial.avatar,
        date: testimonial.date.toISOString().split('T')[0], // Format YYYY-MM-DD
        active: includeInactive ? testimonial.active : undefined
      }));
    } catch (error) {
      console.error('Erreur dans le service lors de la récupération des témoignages:', error);
      throw error;
    }
  }

  async createTestimonial(data: {
    name: string;
    location: string;
    rating: number;
    comment: string;
    avatar?: string;
  }): Promise<Temoinage> {
    try {
      const testimonial = await this.temoinageRepository.create({
        nom: data.name,
        lieu: data.location,
        note: data.rating,
        commentaire: data.comment,
        avatar: data.avatar || null,
        date: new Date(),
        active: false
      });

      return testimonial;
    } catch (error) {
      console.error('Erreur dans le service lors de la création du témoignage:', error);
      throw error;
    }
  }

  async updateTestimonial(id: number, data: Partial<{
    name: string;
    location: string;
    rating: number;
    comment: string;
    avatar?: string;
    active: boolean;
  }>): Promise<Temoinage> {
    try {
      const updateData: Partial<Temoinage> = {};

      if (data.name !== undefined) updateData.nom = data.name;
      if (data.location !== undefined) updateData.lieu = data.location;
      if (data.rating !== undefined) updateData.note = data.rating;
      if (data.comment !== undefined) updateData.commentaire = data.comment;
      if (data.avatar !== undefined) updateData.avatar = data.avatar;
      if (data.active !== undefined) updateData.active = data.active;

      const testimonial = await this.temoinageRepository.update(id, updateData);
      return testimonial;
    } catch (error) {
      console.error('Erreur dans le service lors de la mise à jour du témoignage:', error);
      throw error;
    }
  }

  async deleteTestimonial(id: number): Promise<void> {
    try {
      await this.temoinageRepository.delete(id);
    } catch (error) {
      console.error('Erreur dans le service lors de la suppression du témoignage:', error);
      throw error;
    }
  }
}

export default new TemoinageService();