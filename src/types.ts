export interface Element {
  id: string;
  name: string;
  emoji: string;
  description?: string;
  isNew?: boolean;
  discoveredAt?: Date;
  recipe?: {
    element1: string;
    element2: string;
  };
}

export interface GameState {
  discoveredElements: Element[];
  selectedSlot1: Element | null;
  selectedSlot2: Element | null;
  recentDiscoveries: Element[];
  isLoading: boolean;
}

export interface CraftingResult {
  success: boolean;
  element?: Element;
  error?: string;
}