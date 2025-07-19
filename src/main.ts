import { GameStateManager } from './gameState';
import { AICrafter } from './aiCrafter';
import { UIManager } from './ui';

class InfiniCraftGame {
  private gameState: GameStateManager;
  private aiCrafter: AICrafter;
  private ui: UIManager;

  constructor() {
    this.gameState = new GameStateManager();
    this.aiCrafter = new AICrafter();
    this.ui = new UIManager(this.gameState);
    
    this.setupCombineButton();
  }

  private setupCombineButton() {
    const combineBtn = document.getElementById('combineBtn')!;
    
    combineBtn.addEventListener('click', async () => {
      await this.handleCombine();
    });
  }

  private async handleCombine() {
    const state = this.gameState.getState();
    
    if (!state.selectedSlot1 || !state.selectedSlot2) {
      return;
    }

    this.gameState.setLoading(true);
    this.ui.clearResult();

    try {
      const result = await this.aiCrafter.combineElements(
        state.selectedSlot1,
        state.selectedSlot2
      );

      if (result.success && result.element) {
        this.gameState.addElement(result.element);
        this.ui.showResult(result.element);
        
        // Clear slots after successful combination
        setTimeout(() => {
          this.gameState.clearSlots();
        }, 2000);
      } else {
        this.ui.showError(result.error || 'Failed to combine elements');
      }
    } catch (error) {
      console.error('Combination failed:', error);
      this.ui.showError('Something went wrong. Please try again.');
    } finally {
      this.gameState.setLoading(false);
    }
  }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
  new InfiniCraftGame();
});