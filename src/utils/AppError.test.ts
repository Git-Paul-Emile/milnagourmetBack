import { describe, it, expect } from 'vitest';
import { StatusCodes } from 'http-status-codes';
import { AppError } from './AppError.js';

describe('AppError', () => {
  it('conserve le message et le code HTTP fournis', () => {
    const error = new AppError('Ressource introuvable', StatusCodes.NOT_FOUND);

    expect(error.message).toBe('Ressource introuvable');
    expect(error.statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(error.isOperational).toBe(true);
  });

  it('utilise 500 par défaut quand aucun code n\'est fourni', () => {
    const error = new AppError('Erreur interne');

    expect(error.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
  });

  it('reste une instance de Error et de AppError (chaîne de prototype préservée)', () => {
    const error = new AppError('Test', StatusCodes.BAD_REQUEST);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
  });

  it('permet de marquer une erreur comme non-opérationnelle', () => {
    const error = new AppError('Bug interne', StatusCodes.INTERNAL_SERVER_ERROR, false);

    expect(error.isOperational).toBe(false);
  });
});
