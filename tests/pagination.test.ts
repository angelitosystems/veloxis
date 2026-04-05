import { expect, test, describe } from 'bun:test';
import { createPaginator } from '../src';

describe('Veloxis Pagination Utility', () => {
  test('Offset-based pagination iterates', async () => {
    let callCount = 0;
    const paginator = createPaginator({
      type: 'offset',
      pageSize: 5,
      fetch: async (params) => {
        callCount++;
        return {
          items: Array.from({ length: 5 }, (_, i) => ({ id: i })),
          hasMore: callCount < 3
        };
      }
    });

    await paginator.next();
    expect(paginator.getState().currentPage).toBe(1);
    expect(paginator.hasNext()).toBe(true);

    await paginator.next();
    expect(paginator.getState().currentPage).toBe(2);
    expect(paginator.hasNext()).toBe(true);

    await paginator.next();
    expect(paginator.hasNext()).toBe(false);
  });

  test('Auto-pagination (all) works', async () => {
    let callCount = 0;
    const paginator = createPaginator({
      type: 'cursor',
      pageSize: 2,
      fetch: async () => {
        callCount++;
        const offset = (callCount - 1) * 2;
        return {
          items: [{ id: offset + 1 }, { id: offset + 2 }],
          hasMore: callCount < 2,
          nextCursor: callCount === 1 ? 'c1' : null
        };
      }
    });

    const items = await paginator.all();
    expect(items.length).toBe(4);
    expect(callCount).toBe(2);
  });
});
