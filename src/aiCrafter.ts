import { Element, CraftingResult } from './types';

export class AICrafter {
  private cache: Map<string, Element> = new Map();

  async combineElements(element1: Element, element2: Element): Promise<CraftingResult> {
    try {
      // Create a cache key for this combination
      const cacheKey = this.createCacheKey(element1.name, element2.name);
      
      // Check cache first
      if (this.cache.has(cacheKey)) {
        return {
          success: true,
          element: this.cache.get(cacheKey)!
        };
      }

      // Use local AI logic for crafting
      const result = await this.craftWithLocalLogic(element1, element2);
      
      if (result.success && result.element) {
        // Cache the result
        this.cache.set(cacheKey, result.element);
      }
      
      return result;
    } catch (error) {
      console.error('Crafting error:', error);
      return {
        success: false,
        error: 'Failed to combine elements. Please try again.'
      };
    }
  }

  private async craftWithLocalLogic(element1: Element, element2: Element): Promise<CraftingResult> {
    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const combinations = this.getPredefinedCombinations();
    const key1 = this.createCacheKey(element1.name, element2.name);
    const key2 = this.createCacheKey(element2.name, element1.name);

    // Check predefined combinations
    if (combinations.has(key1)) {
      return { success: true, element: combinations.get(key1)! };
    }
    if (combinations.has(key2)) {
      return { success: true, element: combinations.get(key2)! };
    }

    // Generate creative combination using AI-like logic
    const newElement = this.generateCreativeCombination(element1, element2);
    return { success: true, element: newElement };
  }

  private getPredefinedCombinations(): Map<string, Element> {
    const combinations = new Map<string, Element>();

    // Basic combinations
    combinations.set('fire+water', {
      id: 'steam',
      name: 'Steam',
      emoji: '💨',
      description: 'Hot vapor rising from the union of fire and water',
      recipe: { element1: 'fire', element2: 'water' }
    });

    combinations.set('fire+earth', {
      id: 'lava',
      name: 'Lava',
      emoji: '🌋',
      description: 'Molten rock born from fire\'s passion and earth\'s strength',
      recipe: { element1: 'fire', element2: 'earth' }
    });

    combinations.set('water+earth', {
      id: 'mud',
      name: 'Mud',
      emoji: '🟫',
      description: 'The fertile mixture where life begins',
      recipe: { element1: 'water', element2: 'earth' }
    });

    combinations.set('fire+air', {
      id: 'energy',
      name: 'Energy',
      emoji: '⚡',
      description: 'Pure power crackling through the atmosphere',
      recipe: { element1: 'fire', element2: 'air' }
    });

    combinations.set('water+air', {
      id: 'cloud',
      name: 'Cloud',
      emoji: '☁️',
      description: 'Floating dreams made of water and wind',
      recipe: { element1: 'water', element2: 'air' }
    });

    combinations.set('earth+air', {
      id: 'dust',
      name: 'Dust',
      emoji: '🌪️',
      description: 'Tiny particles dancing in the breeze',
      recipe: { element1: 'earth', element2: 'air' }
    });

    // Advanced combinations
    combinations.set('steam+earth', {
      id: 'geyser',
      name: 'Geyser',
      emoji: '🌊',
      description: 'Earth\'s powerful breath shooting skyward',
      recipe: { element1: 'steam', element2: 'earth' }
    });

    combinations.set('lava+water', {
      id: 'obsidian',
      name: 'Obsidian',
      emoji: '⚫',
      description: 'Volcanic glass forged in fire and cooled by water',
      recipe: { element1: 'lava', element2: 'water' }
    });

    combinations.set('cloud+energy', {
      id: 'lightning',
      name: 'Lightning',
      emoji: '⚡',
      description: 'Nature\'s electric fury splitting the sky',
      recipe: { element1: 'cloud', element2: 'energy' }
    });

    combinations.set('mud+fire', {
      id: 'brick',
      name: 'Brick',
      emoji: '🧱',
      description: 'Hardened earth ready to build civilizations',
      recipe: { element1: 'mud', element2: 'fire' }
    });

    combinations.set('dust+water', {
      id: 'clay',
      name: 'Clay',
      emoji: '🏺',
      description: 'Malleable earth waiting to be shaped',
      recipe: { element1: 'dust', element2: 'water' }
    });

    combinations.set('energy+earth', {
      id: 'crystal',
      name: 'Crystal',
      emoji: '💎',
      description: 'Earth\'s energy crystallized into perfect form',
      recipe: { element1: 'energy', element2: 'earth' }
    });

    return combinations;
  }

  private generateCreativeCombination(element1: Element, element2: Element): Element {
    // AI-like creative combination generator
    const creativeCombinations = [
      {
        condition: (e1: string, e2: string) => 
          (e1.includes('fire') || e1.includes('hot')) && (e2.includes('cold') || e2.includes('ice')),
        result: () => ({
          id: 'balance',
          name: 'Balance',
          emoji: '⚖️',
          description: 'Perfect harmony between opposing forces'
        })
      },
      {
        condition: (e1: string, e2: string) => 
          (e1.includes('light') || e1.includes('sun')) && (e2.includes('dark') || e2.includes('shadow')),
        result: () => ({
          id: 'twilight',
          name: 'Twilight',
          emoji: '🌅',
          description: 'The magical moment between day and night'
        })
      },
      {
        condition: (e1: string, e2: string) => 
          e1.includes('metal') && e2.includes('magic'),
        result: () => ({
          id: 'enchanted-sword',
          name: 'Enchanted Sword',
          emoji: '⚔️',
          description: 'A blade infused with mystical power'
        })
      }
    ];

    // Check creative combinations
    for (const combo of creativeCombinations) {
      if (combo.condition(element1.name.toLowerCase(), element2.name.toLowerCase()) ||
          combo.condition(element2.name.toLowerCase(), element1.name.toLowerCase())) {
        return {
          ...combo.result(),
          recipe: { element1: element1.id, element2: element2.id }
        };
      }
    }

    // Generate a completely new element
    return this.generateRandomElement(element1, element2);
  }

  private generateRandomElement(element1: Element, element2: Element): Element {
    const prefixes = ['Super', 'Mega', 'Ultra', 'Mystic', 'Ancient', 'Cosmic', 'Divine', 'Ethereal'];
    const suffixes = ['Force', 'Essence', 'Spirit', 'Core', 'Fusion', 'Nexus', 'Vortex', 'Aura'];
    const emojis = ['✨', '🌟', '💫', '🔮', '🎭', '🎪', '🎨', '🎯', '🎲', '🎪', '🌈', '🦄', '🐉', '👑', '💍'];

    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];

    const name = `${prefix} ${suffix}`;
    const id = name.toLowerCase().replace(/\s+/g, '-');

    return {
      id,
      name,
      emoji,
      description: `A mysterious creation born from ${element1.name} and ${element2.name}`,
      recipe: { element1: element1.id, element2: element2.id }
    };
  }

  private createCacheKey(name1: string, name2: string): string {
    return [name1.toLowerCase(), name2.toLowerCase()].sort().join('+');
  }
}