import { Element } from './types';
import { GameStateManager } from './gameState';

export class UIManager {
  private gameState: GameStateManager;
  private elementsGrid: HTMLElement;
  private slot1: HTMLElement;
  private slot2: HTMLElement;
  private combineBtn: HTMLElement;
  private resultArea: HTMLElement;
  private discoveryCount: HTMLElement;
  private discoveriesList: HTMLElement;

  constructor(gameState: GameStateManager) {
    this.gameState = gameState;
    
    this.elementsGrid = document.getElementById('elementsGrid')!;
    this.slot1 = document.getElementById('slot1')!;
    this.slot2 = document.getElementById('slot2')!;
    this.combineBtn = document.getElementById('combineBtn')!;
    this.resultArea = document.getElementById('resultArea')!;
    this.discoveryCount = document.getElementById('discoveryCount')!;
    this.discoveriesList = document.getElementById('discoveriesList')!;
    
    this.setupEventListeners();
    this.render();
    
    // Subscribe to state changes
    this.gameState.subscribe(() => this.render());
  }

  private setupEventListeners() {
    // Make slots droppable
    [this.slot1, this.slot2].forEach(slot => {
      slot.addEventListener('dragover', (e) => {
        e.preventDefault();
        slot.classList.add('drag-over');
      });
      
      slot.addEventListener('dragleave', () => {
        slot.classList.remove('drag-over');
      });
      
      slot.addEventListener('drop', (e) => {
        e.preventDefault();
        slot.classList.remove('drag-over');
        
        const elementId = e.dataTransfer?.getData('text/plain');
        if (elementId) {
          const element = this.gameState.getDiscoveredElements().find(e => e.id === elementId);
          if (element) {
            if (slot === this.slot1) {
              this.gameState.setSlot1(element);
            } else {
              this.gameState.setSlot2(element);
            }
          }
        }
      });
      
      // Click to clear slot
      slot.addEventListener('click', () => {
        if (slot === this.slot1) {
          this.gameState.setSlot1(null);
        } else {
          this.gameState.setSlot2(null);
        }
      });
    });
  }

  private render() {
    this.renderElements();
    this.renderSlots();
    this.renderCombineButton();
    this.renderDiscoveries();
  }

  private renderElements() {
    const elements = this.gameState.getDiscoveredElements();
    
    this.elementsGrid.innerHTML = elements.map(element => `
      <div class="element ${element.isNew ? 'new' : ''}" 
           draggable="true" 
           data-element-id="${element.id}">
        <div class="element-emoji">${element.emoji}</div>
        <div class="element-name">${element.name}</div>
      </div>
    `).join('');
    
    // Add drag event listeners
    this.elementsGrid.querySelectorAll('.element').forEach(elementDiv => {
      elementDiv.addEventListener('dragstart', (e) => {
        const elementId = (e.target as HTMLElement).dataset.elementId;
        if (elementId) {
          (e as DragEvent).dataTransfer?.setData('text/plain', elementId);
        }
      });
    });
  }

  private renderSlots() {
    const state = this.gameState.getState();
    
    this.renderSlot(this.slot1, state.selectedSlot1);
    this.renderSlot(this.slot2, state.selectedSlot2);
  }

  private renderSlot(slot: HTMLElement, element: Element | null) {
    if (element) {
      slot.innerHTML = `
        <div class="selected-element">
          <div class="element-emoji">${element.emoji}</div>
          <div class="element-name">${element.name}</div>
        </div>
      `;
      slot.classList.add('filled');
    } else {
      slot.innerHTML = '<div class="slot-placeholder">Drop element here</div>';
      slot.classList.remove('filled');
    }
  }

  private renderCombineButton() {
    const state = this.gameState.getState();
    const canCombine = this.gameState.canCombine();
    
    this.combineBtn.disabled = !canCombine;
    
    if (state.isLoading) {
      this.combineBtn.classList.add('loading');
      this.combineBtn.textContent = 'Combining...';
    } else {
      this.combineBtn.classList.remove('loading');
      this.combineBtn.textContent = 'Combine Elements';
    }
  }

  private renderDiscoveries() {
    const state = this.gameState.getState();
    
    // Update discovery count
    this.discoveryCount.textContent = `${state.discoveredElements.length} discovered`;
    
    // Render recent discoveries
    if (state.recentDiscoveries.length === 0) {
      this.discoveriesList.innerHTML = '<p style="color: #a0aec0; text-align: center; font-style: italic;">No discoveries yet. Start combining elements!</p>';
    } else {
      this.discoveriesList.innerHTML = state.recentDiscoveries.map(element => `
        <div class="discovery-item">
          <div class="element-emoji">${element.emoji}</div>
          <div class="discovery-info">
            <div class="discovery-name">${element.name}</div>
            <div class="discovery-recipe">
              ${element.recipe ? `${this.getElementName(element.recipe.element1)} + ${this.getElementName(element.recipe.element2)}` : 'Starting element'}
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  private getElementName(elementId: string): string {
    const element = this.gameState.getDiscoveredElements().find(e => e.id === elementId);
    return element ? element.name : elementId;
  }

  showResult(element: Element) {
    this.resultArea.innerHTML = `
      <div class="result-content">
        <div class="result-element">
          <div class="element-emoji">${element.emoji}</div>
          <div class="element-name">${element.name}</div>
        </div>
        <div class="result-description">${element.description || 'A new discovery!'}</div>
      </div>
    `;
  }

  showError(message: string) {
    this.resultArea.innerHTML = `
      <div class="result-content">
        <div style="color: #e53e3e; text-align: center;">
          <div style="font-size: 2rem; margin-bottom: 10px;">❌</div>
          <div>${message}</div>
        </div>
      </div>
    `;
  }

  clearResult() {
    this.resultArea.innerHTML = '<div class="result-placeholder">Combine two elements to see what you create!</div>';
  }
}