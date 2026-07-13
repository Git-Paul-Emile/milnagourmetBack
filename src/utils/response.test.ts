import { describe, it, expect } from 'vitest';
import { jsonResponse, buildPaginationMeta } from './response.js';

describe('jsonResponse', () => {
  it('n\'inclut pas "meta" quand aucune pagination n\'est fournie', () => {
    const result = jsonResponse({ status: 'success', message: 'ok', data: { id: 1 } });

    expect(result).toEqual({ status: 'success', message: 'ok', data: { id: 1 } });
    expect(result).not.toHaveProperty('meta');
  });

  it('inclut "meta" quand une pagination est fournie', () => {
    const meta = buildPaginationMeta(1, 10, 25);
    const result = jsonResponse({ status: 'success', message: 'ok', data: [], meta });

    expect(result).toEqual({ status: 'success', message: 'ok', data: [], meta });
  });

  it('utilise null comme donnée par défaut', () => {
    const result = jsonResponse({ status: 'error', message: 'échec' });

    expect(result.data).toBeNull();
  });
});

describe('buildPaginationMeta', () => {
  it('calcule correctement le nombre total de pages', () => {
    expect(buildPaginationMeta(1, 10, 25)).toEqual({ page: 1, limit: 10, total: 25, totalPages: 3 });
  });

  it('retourne au moins 1 page même quand le total est nul', () => {
    expect(buildPaginationMeta(1, 10, 0)).toEqual({ page: 1, limit: 10, total: 0, totalPages: 1 });
  });

  it('gère un total exactement divisible par la limite', () => {
    expect(buildPaginationMeta(2, 5, 20)).toEqual({ page: 2, limit: 5, total: 20, totalPages: 4 });
  });
});
