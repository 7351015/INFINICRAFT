import { Element, GameState } from './types';

export class GameStateManager {
  private state: GameState;
  private listeners: (() => void)[] = [];

  constructor() {
    this.state = {
      discoveredElements: this.getStartingElements(),
      selectedSlot1: null,
      selectedSlot2: null,
      recentDiscoveries: [],
      isLoading: false
    };
  }

  private getStartingElements(): Element[] {
    return [
      {
        id: 'fire',
        name: 'Fire',
        emoji: '🔥',
        description: 'The fundamental force of heat and energy'
      },
      {
        id: 'water',
        name: 'Water',
        emoji: '💧',
        description: 'The essence of life and fluidity'
      },
      {
        id: 'earth',
        name: 'Earth',
        emoji: '🌍',
        description: 'The solid foundation of all matter'
      },
      {
        id: 'air',
        name: 'Air',
        emoji: '💨',
        description: 'The invisible breath of existence'
      }
    ];
  }

  getState(): GameState {
    return { ...this.state };
  }

  getDiscoveredElements(): Element[] {
    return [...this.state.discoveredElements];
  }

  setSlot1(element: Element | null): void {
    this.state.selectedSlot1 = element;
    this.notifyListeners();
  }

  setSlot2(element: Element | null): void {
    this.state.selectedSlot2 = element;
    this.notifyListeners();
  }

  setLoading(loading: boolean): void {
    this.state.isLoading = loading;
    this.notifyListeners();
  }

  addElement(element: Element): void {
    // Check if element already exists
    const exists = this.state.discoveredElements.some(e => e.id === element.id);
    if (!exists) {
      element.isNew = true;
      element.discoveredAt = new Date();
      this.state.discoveredElements.push(element);
      this.state.recentDiscoveries.unshift(element);
      
      // Keep only last 10 discoveries
      if (this.state.recentDiscoveries.length > 10) {
        this.state.recentDiscoveries = this.state.recentDiscoveries.slice(0, 10);
      }
      
      // Remove new flag after animation
      setTimeout(() => {
        element.isNew = false;
        this.notifyListeners();
      }, 1000);
    }
    this.notifyListeners();
  }

  canCombine(): boolean {
    return this.state.selectedSlot1 !== null && 
           this.state.selectedSlot2 !== null && 
           !this.state.isLoading;
  }

  clearSlots(): void {
    this.state.selectedSlot1 = null;
    this.state.selectedSlot2 = null;
    this.notifyListeners();
  }

  subscribe(listener: () => void): void {
    this.listeners.push(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }
}