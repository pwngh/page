import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { generateComponentId } from '../src/node/api.js';

describe('generateComponentId', () => {
  it('starts at <type>-1 on an empty page', () => {
    assert.equal(generateComponentId('text', []), 'text-1');
  });

  it('increments past existing ids of the same type', () => {
    const components = [{ id: 'text-1' }, { id: 'text-2' }];
    assert.equal(generateComponentId('text', components), 'text-3');
  });

  it('reuses the lowest gap left by a removed component', () => {
    const components = [{ id: 'text-1' }, { id: 'text-3' }];
    assert.equal(generateComponentId('text', components), 'text-2');
  });

  it('counts each type independently', () => {
    const components = [{ id: 'title-1' }, { id: 'grid-1' }];
    assert.equal(generateComponentId('text', components), 'text-1');
  });

  it('handles multi-word types in the <type>-<n> format', () => {
    assert.equal(
      generateComponentId('aspect-ratio', [{ id: 'aspect-ratio-1' }]),
      'aspect-ratio-2'
    );
  });
});
