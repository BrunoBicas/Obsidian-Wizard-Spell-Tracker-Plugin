import { 
	App, 
	Plugin, 
	PluginSettingTab, 
	Setting, 
	WorkspaceLeaf, 
	View,
  TFile, 
	ItemView,
  Notice
} from 'obsidian';

const SPELLBOOK_VIEW_TYPE = 'dnd-spellbook-view';
const KNOWN_SPELLS_VIEW_TYPE = 'dnd-known-spells-view';
const UNKNOWN_SPELLS_VIEW_TYPE = 'dnd-unknown-spells-view';


interface SpellSlot {
  level: number;
  total: number;
  used: number;
  source?: string;
  autoScanned?: boolean; // Added for bonus slots auto-scan
}

interface DnDSpellbookSettings {
  characterClass: string;
  characterLevel: number;
  intelligenceModifier: number;
  spellSlots: SpellSlot[];
  bonusSpellSlots: SpellSlot[];
  knownSpells: Spell[];
  unknownSpells: Spell[];
  defaultSpellFolder?: string;
  importSpellsFromNotes: boolean;
  spellFolderPath: string;
  extraSpellUses: ExtraSpellUse[];
  cantripFolderPath: string;
  level1FolderPath: string;
  level2FolderPath: string;
  level3FolderPath: string;
  level4FolderPath: string;
  level5FolderPath: string;
  level6FolderPath: string;
  level7FolderPath: string;
  level8FolderPath: string;
  level9FolderPath: string;
}

interface Spell {
	id: string;
	name: string;
	level: number;
	description: string;
	prepared: boolean;
  path?: string;
}
interface ExtraSpellUse {
  spellName: string;
  uses: number;
  usesRemaining: number;
  source?: string;
}

const DEFAULT_SETTINGS: DnDSpellbookSettings = {
	characterClass: 'wizard',
	characterLevel: 1,
  intelligenceModifier: 0,
	spellSlots: [
		{ level: 1, total: 2, used: 0 },
		{ level: 2, total: 0, used: 0 },
		{ level: 3, total: 0, used: 0 },
		{ level: 4, total: 0, used: 0 },
		{ level: 5, total: 0, used: 0 },
    { level: 6, total: 0, used: 0 },
    { level: 7, total: 0, used: 0 },
    { level: 8, total: 0, used: 0 },
    { level: 9, total: 0, used: 0 }
	],
  defaultSpellFolder: 'Spells',
	knownSpells: [],
  unknownSpells: [],
  importSpellsFromNotes: false,
  spellFolderPath: '',
  extraSpellUses: [],
  cantripFolderPath: '',
  level1FolderPath: '',
  level2FolderPath: '',
  level3FolderPath: '',
  level4FolderPath: '',
  level5FolderPath: '',
  level6FolderPath: '',
  level7FolderPath: '',
  level8FolderPath: '',
  level9FolderPath: '',
  bonusSpellSlots: []
};

// Function to calculate spell slots based on class and level
function calculateSpellSlots(characterClass: string, level: number, bonusSlots: SpellSlot[]): SpellSlot[] {
  const slots: SpellSlot[] = [
    { level: 1, total: 0, used: 0 },
    { level: 2, total: 0, used: 0 },
    { level: 3, total: 0, used: 0 },
    { level: 4, total: 0, used: 0 },
    { level: 5, total: 0, used: 0 },
    { level: 6, total: 0, used: 0 },
    { level: 7, total: 0, used: 0 },
    { level: 8, total: 0, used: 0 },
    { level: 9, total: 0, used: 0 }
  ];

  // Full casters: wizard, cleric, druid
  if (characterClass === 'wizard' || characterClass === 'cleric' || characterClass === 'druid') {
    // Level 1
    if (level >= 1) {
      slots[0].total = 2;
    }
    // Level 2
    if (level >= 2) {
      slots[0].total = 3;
    }
    // Level 3
    if (level >= 3) {
      slots[0].total = 4;
      slots[1].total = 2;
    }
    // Level 4
    if (level >= 4) {
      slots[0].total = 4;
      slots[1].total = 3;
    }
    // Level 5
    if (level >= 5) {
      slots[0].total = 4;
      slots[1].total = 3;
      slots[2].total = 2;
    }
    // Level 6
    if (level >= 6) {
      slots[0].total = 4;
      slots[1].total = 3;
      slots[2].total = 3;
    }
    // Level 7
    if (level >= 7) {
      slots[0].total = 4;
      slots[1].total = 3;
      slots[2].total = 3;
      slots[3].total = 1;
    }
    // Level 8
    if (level >= 8) {
      slots[0].total = 4;
      slots[1].total = 3;
      slots[2].total = 3;
      slots[3].total = 2;
    }
    // Level 9
    if (level >= 9) {
      slots[0].total = 4;
      slots[1].total = 3;
      slots[2].total = 3;
      slots[3].total = 3;
      slots[4].total = 1;
    }
    // Level 10
    if (level >= 10) {
      slots[0].total = 4;
      slots[1].total = 3;
      slots[2].total = 3;
      slots[3].total = 3;
      slots[4].total = 2;
    }
    // Level 11
    if (level >= 11) {
      slots[0].total = 4;
      slots[1].total = 3;
      slots[2].total = 3;
      slots[3].total = 3;
      slots[4].total = 2;
      slots[5].total = 1;
    }
    // Level 12
    if (level >= 12) {
      slots[0].total = 4;
      slots[1].total = 3;
      slots[2].total = 3;
      slots[3].total = 3;
      slots[4].total = 2;
      slots[5].total = 1;
    }
    // Level 13
    if (level >= 13) {
      slots[0].total = 4;
      slots[1].total = 3;
      slots[2].total = 3;
      slots[3].total = 3;
      slots[4].total = 2;
      slots[5].total = 1;
      slots[6].total = 1;
    }
    // Level 14
    if (level >= 14) {
      slots[0].total = 4;
      slots[1].total = 3;
      slots[2].total = 3;
      slots[3].total = 3;
      slots[4].total = 2;
      slots[5].total = 1;
      slots[6].total = 1;
    }
    // Level 15
    if (level >= 15) {
      slots[0].total = 4;
      slots[1].total = 3;
      slots[2].total = 3;
      slots[3].total = 3;
      slots[4].total = 2;
      slots[5].total = 1;
      slots[6].total = 1;
      slots[7].total = 1;
    }
    // Level 16
    if (level >= 16) {
      slots[0].total = 4;
      slots[1].total = 3;
      slots[2].total = 3;
      slots[3].total = 3;
      slots[4].total = 2;
      slots[5].total = 1;
      slots[6].total = 1;
      slots[7].total = 1;
    }
    // Level 17
    if (level >= 17) {
      slots[0].total = 4;
      slots[1].total = 3;
      slots[2].total = 3;
      slots[3].total = 3;
      slots[4].total = 2;
      slots[5].total = 1;
      slots[6].total = 1;
      slots[7].total = 1;
      slots[8].total = 1;
    }
    // Level 18
    if (level >= 18) {
      slots[0].total = 4;
      slots[1].total = 3;
      slots[2].total = 3;
      slots[3].total = 3;
      slots[4].total = 3;
      slots[5].total = 1;
      slots[6].total = 1;
      slots[7].total = 1;
      slots[8].total = 1;
    }
    // Level 19
    if (level >= 19) {
      slots[0].total = 4;
      slots[1].total = 3;
      slots[2].total = 3;
      slots[3].total = 3;
      slots[4].total = 3;
      slots[5].total = 2;
      slots[6].total = 1;
      slots[7].total = 1;
      slots[8].total = 1;
    }
    // Level 20
    if (level >= 20) {
      slots[0].total = 4;
      slots[1].total = 3;
      slots[2].total = 3;
      slots[3].total = 3;
      slots[4].total = 3;
      slots[5].total = 2;
      slots[6].total = 2;
      slots[7].total = 1;
      slots[8].total = 1;
    }
  }
  // Half casters: paladin, ranger
  else if (characterClass === 'paladin' || characterClass === 'ranger') {
    // Half casters start getting spell slots at level 2
    if (level >= 2) {
      slots[0].total = 2;
    }
    if (level >= 3) {
      slots[0].total = 3;
    }
    if (level >= 5) {
      slots[0].total = 4;
      slots[1].total = 2;
    }
    if (level >= 7) {
      slots[0].total = 4;
      slots[1].total = 3;
    }
    if (level >= 9) {
      slots[0].total = 4;
      slots[1].total = 3;
      slots[2].total = 2;
    }
    if (level >= 11) {
      slots[0].total = 4;
      slots[1].total = 3;
      slots[2].total = 3;
    }
    if (level >= 13) {
      slots[0].total = 4;
      slots[1].total = 3;
      slots[2].total = 3;
      slots[3].total = 1;
    }
    if (level >= 15) {
      slots[0].total = 4;
      slots[1].total = 3;
      slots[2].total = 3;
      slots[3].total = 2;
    }
    if (level >= 17) {
      slots[0].total = 4;
      slots[1].total = 3;
      slots[2].total = 3;
      slots[3].total = 3;
      slots[4].total = 1;
    }
    if (level >= 19) {
      slots[0].total = 4;
      slots[1].total = 3;
      slots[2].total = 3;
      slots[3].total = 3;
      slots[4].total = 2;
    }
  }
  bonusSlots.forEach(bonus => {
    const slotIndex = slots.findIndex(s => s.level === bonus.level);
    if (slotIndex >= 0) {
      slots[slotIndex].total += bonus.total;
    }
  });

  return slots;
}

class SpellbookView extends ItemView {
	plugin: DnDSpellbookPlugin;

	constructor(leaf: WorkspaceLeaf, plugin: DnDSpellbookPlugin) {
		super(leaf);
		this.plugin = plugin;
	}

	getViewType(): string {
		return SPELLBOOK_VIEW_TYPE;
	}

	getDisplayText(): string {
		return "D&D Spellbook";
	}

	getIcon(): string {
		return "book";
	}

	async onOpen(): Promise<void> {
		const container = this.containerEl.createDiv({ 
		  cls: 'dnd-spellbook-container modern-spellbook-layout' 
		});
		
		// Close button
		const closeButton = container.createEl('button', {
		  text: '✕ Close',
		  cls: 'close-spellbook-btn'
		});
		closeButton.addEventListener('click', () => {
		  this.app.workspace.detachLeavesOfType(SPELLBOOK_VIEW_TYPE);
		});
		
		// Navigation buttons
		const navButtons = container.createDiv({ cls: 'spellbook-nav-buttons' });
		
		const knownSpellsBtn = navButtons.createEl('button', {
		  text: 'View Known Spells',
		  cls: 'nav-btn'
		});
		knownSpellsBtn.addEventListener('click', () => {
		  this.plugin.activateKnownSpellsView();
		});
		
		// Add scrollable content wrapper
		const scrollContainer = container.createDiv({
		  cls: 'spellbook-scroll-container'
		});
    scrollContainer.style.maxHeight = '70vh';
    scrollContainer.style.overflowY = 'auto';
    scrollContainer.style.paddingRight = '10px';
		
		// Character Info Section
		const charInfoSection = scrollContainer.createDiv({ cls: 'character-info' });
		charInfoSection.createEl('h2', { text: 'Character Information' });
		charInfoSection.createEl('p', { 
		  text: `Class: ${this.plugin.settings.characterClass} | Level: ${this.plugin.settings.characterLevel}` 
		});
    // Spell Count Summary
    const known = this.plugin.settings.knownSpells.length;
    const unknown = this.plugin.settings.unknownSpells.length;
    const prepared = this.plugin.settings.knownSpells.filter(s => s.prepared).length;
    const maxPrepared = this.plugin.settings.characterLevel + this.plugin.settings.intelligenceModifier;
    
    charInfoSection.createEl('p', {
      text: `📘 Known: ${known} | ❓ Unknown: ${unknown} | ✅ Prepared: ${prepared} / ${maxPrepared}`
    });
	  
		// Spell Slots Section
		const spellSlotsSection = scrollContainer.createDiv({ cls: 'spell-slots-section' });
		spellSlotsSection.createEl('h2', { text: 'Spell Slots' });
		
		this.plugin.settings.spellSlots.forEach(slot => {
		  if (slot.total > 0) {
			const slotDiv = spellSlotsSection.createDiv({ cls: 'spell-slot' });
			slotDiv.createEl('span', { 
			  text: `Level ${slot.level}: ${slot.total - slot.used}/${slot.total}` 
			});
			
			const useButton = slotDiv.createEl('button', { 
			  text: 'Use Slot',
			  cls: 'use-slot-btn'
			});
			
			useButton.addEventListener('click', () => {
			  this.plugin.useSpellSlot(slot.level);
			  this.refresh();
			});
			
			const restoreButton = slotDiv.createEl('button', {
			  text: 'Restore',
			  cls: 'restore-slot-btn'
			});
			
			restoreButton.addEventListener('click', () => {
			  this.plugin.restoreSpellSlot(slot.level);
			  this.refresh();
			});
		  }
		});
	  
		// Add a "Long Rest" button to restore all spell slots
		const longRestBtn = scrollContainer.createEl('button', {
		  text: '🌙 Long Rest (Restore All Slots)',
		  cls: 'long-rest-btn'
		});
		longRestBtn.addEventListener('click', () => {
		  this.plugin.restoreAllSpellSlots();
		  this.refresh();
		  new Notice('All spell slots restored after a long rest!');
		});
	  
		// Add Spell Button
		const addSpellBtn = scrollContainer.createEl('button', { 
		  text: '+ Add New Spell',
		  cls: 'add-spell-btn'
		});
		addSpellBtn.addEventListener('click', () => this.openAddSpellModal());
	  
		// Prepared Spells Section
		const preparedSpellsSection = scrollContainer.createDiv({ cls: 'prepared-spells-section' });
		const preparedCount = this.plugin.settings.knownSpells.filter(spell => spell.prepared).length;
    preparedSpellsSection.createEl('h2', { 
      text: `Prepared Spells (${preparedCount} / ${maxPrepared})` 
    });
		this.renderPreparedSpells(preparedSpellsSection);
	  }

	renderPreparedSpells(container: HTMLElement) {
		container.empty();

		const preparedSpells = this.plugin.settings.knownSpells.filter(spell => spell.prepared);
		
		if (preparedSpells.length === 0) {
			container.createEl('p', { text: 'No spells prepared yet. Prepare spells from your Known Spells list.' });
			return;
		}

		preparedSpells.forEach(spell => {
			const spellDiv = container.createDiv({ cls: 'spell-card prepared' });
			
			// Spell Name and Level
			spellDiv.createEl('h3', { 
				text: `${spell.name} (Level ${spell.level})`,
				cls: 'spell-name'
			});

      // Add extra spell uses badge if available
const extraUse = this.plugin.settings.extraSpellUses.find(
  e => e.spellName.toLowerCase() === spell.name.toLowerCase() && e.usesRemaining > 0
);
if (extraUse) {
  const extraUsesBadge = spellDiv.createDiv({ cls: 'extra-uses-badge' });
  extraUsesBadge.createEl('span', { 
    text: `+${extraUse.usesRemaining} free uses` 
  });
  extraUsesBadge.setAttribute('title', `Extra uses from ${extraUse.source || 'unknown'}`);
}


			// Description toggle container
const descriptionContainer = spellDiv.createDiv({ cls: 'spell-description-container' });
const descriptionToggle = descriptionContainer.createEl('button', {
  text: 'Show Description',
  cls: 'description-toggle'
});
const descriptionDiv = descriptionContainer.createDiv({ 
  cls: 'spell-description hidden' 
});
descriptionDiv.createEl('p', { text: spell.description });

descriptionToggle.addEventListener('click', () => {
  if (descriptionDiv.classList.contains('hidden')) {
    descriptionDiv.classList.remove('hidden');
    descriptionToggle.textContent = 'Hide Description';
  } else {
    descriptionDiv.classList.add('hidden');
    descriptionToggle.textContent = 'Show Description';
  }
});

			// Unprepare Button
			const unprepareBtn = spellDiv.createEl('button', {
				text: 'Unprepare',
				cls: 'unprepare-btn'
			});
			unprepareBtn.addEventListener('click', () => {
				this.plugin.toggleSpellPreparation(spell.id);
				this.refresh();
			});
      const castBtn = spellDiv.createEl('button', {
          text: 'Cast',
          cls: 'cast-spell-btn'
      });
      castBtn.addEventListener('click', () => {
          this.plugin.castSpell(spell);
          this.refresh();
      });
		});
	}

	openAddSpellModal() {
		const modalContainer = this.containerEl.createDiv({ cls: 'add-spell-modal' });
		modalContainer.createEl('h2', { text: 'Add New Spell' });

		const form = modalContainer.createEl('form');
		
		// Name Input
		form.createEl('label', { text: 'Spell Name' });
		const nameInput = form.createEl('input', { type: 'text' });
		
		// Level Input
		form.createEl('label', { text: 'Spell Level' });
		const levelInput = form.createEl('select');
		[0,1,2,3,4,5,6,7,8,9].forEach(level => {
			levelInput.createEl('option', { 
				text: `Level ${level}`, 
				value: level.toString() 
			});
		});

		// Description Input
		form.createEl('label', { text: 'Description' });
		const descInput = form.createEl('textarea');

		// Submit Button
		const submitBtn = form.createEl('button', { text: 'Add Spell' });
		submitBtn.addEventListener('click', (e) => {
			e.preventDefault();
			this.plugin.addSpell({
				id: Date.now().toString(),
				name: nameInput.value,
				level: parseInt(levelInput.value),
				description: descInput.value,
				prepared: false
			});
			modalContainer.remove();
			this.refresh();
		});
    
    // Cancel Button
    const cancelBtn = form.createEl('button', { 
      text: 'Cancel',
      cls: 'cancel-btn' 
    });
    cancelBtn.addEventListener('click', (e) => {
      e.preventDefault();
      modalContainer.remove();
    });
	}

	async onClose(): Promise<void> {
		this.containerEl.empty();
	}

	refresh() {
    // First make sure settings are saved
    this.plugin.saveSettings();
    
    // Do a complete refresh like the KnownSpellsView does
    this.containerEl.empty();
    this.onOpen();
  }
}

class KnownSpellsView extends ItemView {
  plugin: DnDSpellbookPlugin;

  constructor(leaf: WorkspaceLeaf, plugin: DnDSpellbookPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType(): string {
    return KNOWN_SPELLS_VIEW_TYPE;
  }

  getDisplayText(): string {
    return "D&D Known Spells";
  }

  getIcon(): string {
    return "book-open";
  }

  async onOpen(): Promise<void> {
    const container = this.containerEl.createDiv({ 
      cls: 'known-spells-container modern-spellbook-layout' 
    });
    
    // Add scrollable content wrapper
    const scrollContainer = container.createDiv({
      cls: 'spellbook-scroll-container'
    });
    
    // Add some basic CSS to enable scrolling
    scrollContainer.style.maxHeight = '70vh';
    scrollContainer.style.overflowY = 'auto';
    scrollContainer.style.paddingRight = '10px';
    
    // Header
    scrollContainer.createEl('h2', { text: 'Known Spells' });
    const known = this.plugin.settings.knownSpells.length;
const prepared = this.plugin.settings.knownSpells.filter(s => s.prepared).length;
const maxPrepared = this.plugin.settings.characterLevel + this.plugin.settings.intelligenceModifier;

scrollContainer.createEl('p', {
  text: `✅ Prepared: ${prepared} / ${maxPrepared} | 📘 Total Known Spells: ${known}`
});
    
    // Close button
    const closeButton = container.createEl('button', {
      text: '✕ Close',
      cls: 'close-spellbook-btn'
    });
    closeButton.addEventListener('click', () => {
      this.app.workspace.detachLeavesOfType(KNOWN_SPELLS_VIEW_TYPE);
    });
    
    // Navigation button to main spellbook
    const navButtons = container.createDiv({ cls: 'spellbook-nav-buttons' });
    
    const spellbookBtn = navButtons.createEl('button', {
      text: 'Back to Spellbook',
      cls: 'nav-btn'
    });
    spellbookBtn.addEventListener('click', () => {
      this.app.workspace.detachLeavesOfType(KNOWN_SPELLS_VIEW_TYPE);
      this.plugin.activateView();
    });
    
    // Add spell button
    const addSpellBtn = scrollContainer.createEl('button', { 
      text: '+ Add New Spell',
      cls: 'add-spell-btn'
    });

    //View Unknown Spells
    addSpellBtn.addEventListener('click', () => this.openAddSpellModal());
    const unknownSpellsBtn = navButtons.createEl('button', {
      text: 'View Unknown Spells',
      cls: 'nav-btn'
    });
    unknownSpellsBtn.addEventListener('click', () => {
      this.plugin.activateUnknownSpellsView();
    });
    
    // Filter controls
    const filterContainer = scrollContainer.createDiv({ cls: 'filter-container' });
    
    filterContainer.createEl('label', { text: 'Filter by level: ' });
    const levelFilter = filterContainer.createEl('select');
    levelFilter.createEl('option', { text: 'All Levels', value: 'all' });
    [0,1,2,3,4,5,6,7,8,9].forEach(level => {
      levelFilter.createEl('option', { 
        text: `Level ${level}`, 
        value: level.toString() 
      });
    });
    
    // Sort function for spells
    const sortByLevelName = (a: Spell, b: Spell) => {
      if (a.level !== b.level) {
        return a.level - b.level;
      }
      return a.name.localeCompare(b.name);
    };
    
    // Render all spells initially
    this.renderSpells(scrollContainer, this.plugin.settings.knownSpells.sort(sortByLevelName));
    
    // Add event listener for level filter
    levelFilter.addEventListener('change', () => {
      const value = levelFilter.value;
      let filteredSpells = [...this.plugin.settings.knownSpells];
      
      if (value !== 'all') {
        const levelNum = parseInt(value);
        filteredSpells = filteredSpells.filter(spell => spell.level === levelNum);
      }
      
      // Re-render with filtered list
      const spellsContainer = scrollContainer.querySelector('.spells-list-container');
      if (spellsContainer) {
        spellsContainer.remove();
      }
      
      this.renderSpells(scrollContainer, filteredSpells.sort(sortByLevelName));
    });
  }
  
  renderSpells(container: HTMLElement, spells: Spell[]) {
    // Create a dedicated container for the spells list
    const spellsContainer = container.createDiv({ cls: 'spells-list-container' });
    
    if (spells.length === 0) {
      spellsContainer.createEl('p', { text: 'No spells found. Add some spells to your spellbook!' });
      return;
    }
    
    // Group spells by level
    const spellsByLevel: {[key: number]: Spell[]} = {};
    
    spells.forEach(spell => {
      if (!spellsByLevel[spell.level]) {
        spellsByLevel[spell.level] = [];
      }
      spellsByLevel[spell.level].push(spell);
    });
    
    // Render spells by level groups
    Object.keys(spellsByLevel).sort((a, b) => parseInt(a) - parseInt(b)).forEach(level => {
      const levelNum = parseInt(level);
      const levelSpells = spellsByLevel[levelNum];
      
      const levelHeading = levelNum === 0 ? 'Cantrips' : `Level ${levelNum} Spells`;
      const levelSection = spellsContainer.createDiv({ cls: 'spell-level-section' });
      levelSection.createEl('h3', { text: levelHeading });
      
      levelSpells.forEach(spell => {
        const spellDiv = levelSection.createDiv({ 
          cls: `spell-card ${spell.prepared ? 'prepared' : ''}` 
        });
        
        const headerDiv = spellDiv.createDiv({ cls: 'spell-header' });
        headerDiv.createEl('span', { 
          text: spell.name,
          cls: 'spell-name'
        });
        // Show extra uses badge if available
        const extraUse = this.plugin.settings.extraSpellUses.find(
          e => e.spellName.toLowerCase() === spell.name.toLowerCase() && e.usesRemaining > 0
        );
        if (extraUse) {
          const extraUsesBadge = spellDiv.createDiv({ cls: 'extra-uses-badge' });
          extraUsesBadge.createEl('span', { 
            text: `+${extraUse.usesRemaining} free uses` 
          });
          extraUsesBadge.setAttribute('title', `Extra uses from ${extraUse.source || 'unknown'}`);
        }
        // Description with toggle
        const descriptionContainer = spellDiv.createDiv({ cls: 'spell-description-container' });
        const descriptionToggle = descriptionContainer.createEl('button', {
          text: 'Show Description',
          cls: 'description-toggle'
        });
        
        const descriptionDiv = descriptionContainer.createDiv({ 
          cls: 'spell-description hidden' 
        });
        descriptionDiv.createEl('p', { text: spell.description });
        if (spell.path) {
          const linkBtn = descriptionContainer.createEl('button', {
            text: '📄 Open Note',
            cls: 'open-note-btn'
          });
        
          linkBtn.addEventListener('click', () => {
            // Utiliza o "!" para afirmar que spell.path não é undefined
            const file = this.app.vault.getAbstractFileByPath(spell.path!) as TFile | null;
            // Verifica se file existe e é uma instância de TFile
            if (file && file instanceof TFile) {
              this.app.workspace.getLeaf().openFile(file);
            } else {
              new Notice("Spell note not found or is not a valid file.");
            }
          });
        }
        
        
        descriptionToggle.addEventListener('click', () => {
          if (descriptionDiv.classList.contains('hidden')) {
            descriptionDiv.classList.remove('hidden');
            descriptionToggle.textContent = 'Hide Description';
          } else {
            descriptionDiv.classList.add('hidden');
            descriptionToggle.textContent = 'Show Description';
          }
        });
        
        // Control buttons
        const buttonContainer = spellDiv.createDiv({ cls: 'spell-buttons' });
        
        // Prepare/Unprepare Toggle
        const prepareBtn = buttonContainer.createEl('button', {
          text: spell.prepared ? 'Unprepare' : 'Prepare',
          cls: spell.prepared ? 'unprepare-btn' : 'prepare-btn'
        });
        prepareBtn.addEventListener('click', () => {
          this.plugin.toggleSpellPreparation(spell.id);
          this.refresh();
        });

        if (spell.prepared) {
          const castBtn = buttonContainer.createEl('button', {
              text: 'Cast',
              cls: 'cast-btn'
          });
          castBtn.addEventListener('click', () => {
              this.plugin.castSpell(spell);
              this.refresh();
          });
      }
        
        // Delete Spell Button
        const deleteBtn = buttonContainer.createEl('button', {
          text: 'Delete',
          cls: 'delete-btn'
        });
        deleteBtn.addEventListener('click', () => {
          if (confirm(`Are you sure you want to move "${spell.name}" to Unknown Spells?`)) {
            this.plugin.moveSpellToUnknown(spell.id);
            this.refresh();
          }
        });
      });
    });
  }
  
  openAddSpellModal() {
    const modalContainer = this.containerEl.createDiv({ cls: 'add-spell-modal' });
    modalContainer.createEl('h2', { text: 'Add New Spell' });

    const form = modalContainer.createEl('form');
    
    // Name Input
    form.createEl('label', { text: 'Spell Name' });
    const nameInput = form.createEl('input', { type: 'text' });
    
    // Level Input
    form.createEl('label', { text: 'Spell Level' });
    const levelInput = form.createEl('select');
    [0,1,2,3,4,5,6,7,8,9].forEach(level => {
      levelInput.createEl('option', { 
        text: `Level ${level}`, 
        value: level.toString() 
      });
    });

    // Description Input
    form.createEl('label', { text: 'Description' });
    const descInput = form.createEl('textarea');

    // Submit Button
    const submitBtn = form.createEl('button', { text: 'Add Spell' });
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.plugin.addSpell({
        id: Date.now().toString(),
        name: nameInput.value,
        level: parseInt(levelInput.value),
        description: descInput.value,
        prepared: false
      });
      modalContainer.remove();
      this.refresh();
    });
    
    // Cancel Button
    const cancelBtn = form.createEl('button', { 
      text: 'Cancel',
      cls: 'cancel-btn' 
    });
    cancelBtn.addEventListener('click', (e) => {
      e.preventDefault();
      modalContainer.remove();
    });
  }

  async onClose(): Promise<void> {
    this.containerEl.empty();
  }

  refresh() {
    this.containerEl.empty();
    this.onOpen();
  }
}

class UnknownSpellsView extends ItemView {
  plugin: DnDSpellbookPlugin;

  constructor(leaf: WorkspaceLeaf, plugin: DnDSpellbookPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType(): string {
    return UNKNOWN_SPELLS_VIEW_TYPE;
  }

  getDisplayText(): string {
    return "D&D Unknown Spells";
  }

  getIcon(): string {
    return "question-mark"; // change icon as desired
  }

  async onOpen(): Promise<void> {
    // Create the main container with navigation
    const container = this.containerEl.createDiv({ cls: 'unknown-spells-container modern-spellbook-layout' });
    
    // Navigation buttons container
    const navButtons = container.createDiv({ cls: 'spellbook-nav-buttons' });
    // "Back to Spellbook" button:
    const backButton = navButtons.createEl('button', {
      text: 'Back to Spellbook',
      cls: 'nav-btn'
    });
    backButton.addEventListener('click', () => {
      this.plugin.activateView();
    });
    
    // Create a filter control to choose a level (1-9) or All Levels
    const filterContainer = container.createDiv({ cls: 'filter-container' });
    filterContainer.createEl('label', { text: 'Filter by level: ' });
    const levelFilter = filterContainer.createEl('select');
    levelFilter.createEl('option', { text: 'All Levels', value: 'all' });
    for (let i = 1; i <= 9; i++) {
      levelFilter.createEl('option', { text: `Level ${i}`, value: i.toString() });
    }
    
    // Add scrollable content wrapper
    const scrollContainer = container.createDiv({ cls: 'spellbook-scroll-container' });
    scrollContainer.style.maxHeight = '70vh';
    scrollContainer.style.overflowY = 'auto';
    scrollContainer.style.paddingRight = '10px';
    
    // Header for the view
    scrollContainer.createEl('h2', { text: 'Unknown Spells' });
    
    // Function to render unknown spells with an optional level filter.
    const renderUnknownSpells = (filterLevel: string) => {
      // Remove any previously rendered groups
      scrollContainer.querySelectorAll('.unknown-spell-group').forEach(e => e.remove());
      
      // Get all unknown spells from settings
      let spells = this.plugin.settings.unknownSpells || [];
      // If filtering, only keep spells with the chosen level.
      if (filterLevel !== 'all') {
        const levelNum = parseInt(filterLevel);
        spells = spells.filter(s => s.level === levelNum);
      }
      // Sort the spells by level (ascending)
      spells = spells.sort((a, b) => a.level - b.level);
      
      // Group spells by level (levels 1 to 9)
      // Explicitly type the grouping object as a Record mapping number keys to arrays of Spell
const spellsByLevel: { [key: number]: Spell[] } = {};

// Also provide an explicit type for the callback parameter 'spell'
spells.forEach((spell: Spell) => {
  const lvl = spell.level;
  if (!spellsByLevel[lvl]) {
    spellsByLevel[lvl] = [];
  }
  spellsByLevel[lvl].push(spell);
});

      
      // Render groups for levels 1 to 9 in order.
      for (let level = 1; level <= 9; level++) {
        if (spellsByLevel[level] && spellsByLevel[level].length > 0) {
          const levelSection = scrollContainer.createDiv({ cls: 'unknown-spell-group' });
          levelSection.createEl('h3', { text: `Level ${level} Spells` });
          
          spellsByLevel[level].forEach(spell => {
            const spellDiv = levelSection.createDiv({ cls: 'spell-card unknown' });
            
            // Create a header with the spell name and level
            const headerDiv = spellDiv.createDiv({ cls: 'spell-header' });
            headerDiv.createEl('h4', { text: spell.name, cls: 'spell-name' });
            headerDiv.createEl('span', { text: `Level ${spell.level}`, cls: 'spell-level' });
            
            // Add the description (if available)
            if (spell.description) {
              spellDiv.createEl('p', { text: spell.description, cls: 'spell-description' });
            }
            
            // Button to "Learn" the spell (moves it from unknown to known)
            const learnBtn = spellDiv.createEl('button', { text: 'Learn Spell', cls: 'learn-spell-btn' });
            learnBtn.addEventListener('click', () => {
              this.plugin.learnSpell(spell.id);
              // Immediately refresh the view so the spell is removed from unknowns
              this.refresh();
            });
          });
        }
      }
    };
  
    // Initially render all unknown spells.
    renderUnknownSpells('all');
  
    // Update the view when the filter is changed.
    levelFilter.addEventListener('change', () => {
      renderUnknownSpells(levelFilter.value);
    });
  }
  
  

  async onClose(): Promise<void> {
    this.containerEl.empty();
  }

  refresh() {
    this.containerEl.empty();
    this.onOpen();
  }
}


export default class DnDSpellbookPlugin extends Plugin {
	settings: DnDSpellbookSettings & {
    spellFolderPath?: string;
  };

	async onload() {
		await this.loadSettings();
    if (!this.settings.hasOwnProperty('spellFolderPath')) {
      this.settings.spellFolderPath = '';
      await this.saveSettings();
    }
    if (!this.settings.hasOwnProperty('cantripFolderPath')) {
      this.settings.cantripFolderPath = '';
      await this.saveSettings();
    }
    if (!this.settings.hasOwnProperty('level1FolderPath')) {
      this.settings.level1FolderPath = '';
      await this.saveSettings();
    }
    // defaults:
    // ... continue for levels 2-9 ...
    if (!this.settings.hasOwnProperty('level2FolderPath')) {
      this.settings.level2FolderPath = '';
      await this.saveSettings();
    }
    if (!this.settings.hasOwnProperty('level3FolderPath')) {
      this.settings.level3FolderPath = '';
      await this.saveSettings();
    }
    if (!this.settings.hasOwnProperty('level4FolderPath')) {
      this.settings.level4FolderPath = '';
      await this.saveSettings();
    }
    if (!this.settings.hasOwnProperty('level5FolderPath')) {
      this.settings.level5FolderPath = '';
      await this.saveSettings();
    }
    if (!this.settings.hasOwnProperty('level6FolderPath')) {
      this.settings.level6FolderPath = '';
      await this.saveSettings();
    }
    if (!this.settings.hasOwnProperty('level7FolderPath')) {
      this.settings.level7FolderPath = '';
      await this.saveSettings();
    }
    if (!this.settings.hasOwnProperty('level8FolderPath')) {
      this.settings.level8FolderPath = '';
      await this.saveSettings();
    }
    if (!this.settings.hasOwnProperty('level9FolderPath')) {
      this.settings.level9FolderPath = '';
      await this.saveSettings();
    }
  
  // Initialize spell slots based on current class/level when plugin loads
  this.settings.spellSlots = calculateSpellSlots(
    this.settings.characterClass,
    this.settings.characterLevel,
    this.settings.bonusSpellSlots
  );
  await this.saveSettings();
  // Register custom views
  this.registerView(
    SPELLBOOK_VIEW_TYPE, 
    (leaf) => new SpellbookView(leaf, this)
  );
  this.registerView(
    KNOWN_SPELLS_VIEW_TYPE,
    (leaf) => new KnownSpellsView(leaf, this)
  );
  this.registerView(
    UNKNOWN_SPELLS_VIEW_TYPE,
    (leaf) => new UnknownSpellsView(leaf, this)
  );
  
    
		// Add ribbon icon to open spellbook
		this.addRibbonIcon('book', 'D&D Spellbook', async () => {
			await this.activateView();
		});

		// Add settings tab
		this.addSettingTab(new SpellbookSettingTab(this.app, this));
    
    // Add CSS to document head
    this.loadStyles();
	}
  
	loadStyles() {
		const styleElement = document.createElement('link');
		styleElement.rel = 'stylesheet';
		styleElement.href = 'obsidian://css/plugins/dnd-spellbook/styles.css';
		document.head.appendChild(styleElement);
	  }

    async learnSpell(spellId: string) {
      // Find the unknown spell by its ID.
      const index = this.settings.unknownSpells.findIndex(s => s.id === spellId);
      if (index !== -1) {
        const spell = this.settings.unknownSpells.splice(index, 1)[0];
      
        // Remove any other spells with the same name (case-insensitive)
        this.settings.unknownSpells = this.settings.unknownSpells.filter(
          s => s.name.toLowerCase() !== spell.name.toLowerCase()
        );
      
        await this.createSpellWithNote(spell);
        this.saveSettings();
        new Notice(`Learned spell: ${spell.name}`);
      }
    }

    async scanNotesForTaggedSpells() {
      const files = this.app.vault.getMarkdownFiles();
      let importCount = 0;
      
      // Clear previous extra spell uses so that a re‐scan won't add duplicates
      this.settings.extraSpellUses = [];
      
      for (const file of files) {
        const content = await this.app.vault.read(file);
        
        // Look for tags in the format #NspellName (e.g., #1fireball, #3magicMissile)
        const tagMatches = content.matchAll(/#(\d+)([a-zA-Z_]+)/g);
        
        for (const match of tagMatches) {
          const uses = parseInt(match[1]);
          const rawSpellName = match[2];
          const spellName = rawSpellName.replace(/_/g, ' ');

          
          // Check if this spell exists in the known spells
          const knownSpell = this.settings.knownSpells.find(
            s => s.name.toLowerCase() === spellName.toLowerCase()
          );
          
          if (knownSpell) {
            // Look for an extra use entry for this spell
            const existingExtraUse = this.settings.extraSpellUses.find(
              e => e.spellName.toLowerCase() === spellName.toLowerCase()
            );
            
            if (existingExtraUse) {
              // Add new uses from this file to the already collected uses.
              existingExtraUse.uses += uses;
              existingExtraUse.usesRemaining += uses;
              // Optionally, append the source name
              existingExtraUse.source = existingExtraUse.source 
                ? `${existingExtraUse.source}, ${file.basename}`
                : file.basename;
            } else {
              // Create a new extra spell use entry
              this.settings.extraSpellUses.push({
                spellName: knownSpell.name,
                uses: uses,
                usesRemaining: uses,
                source: file.basename
              });
              importCount++;
            }
          }
        }
      }
      
      await this.saveSettings();
      return importCount;
    }
    async scanNotesForBonusSpellSlots() {
      const files = this.app.vault.getMarkdownFiles();
      let importCount = 0;
    
      // Remove previously auto-scanned bonus slots, but keep manually added ones.
      // We mark auto-generated bonus slots with a property: autoScanned: true.
      this.settings.bonusSpellSlots = this.settings.bonusSpellSlots.filter(slot => !slot.autoScanned);
    
      // Define a regex to capture tags in the format: #<amount>_spellSlot_<level>
      // For example, "#1_spellSlot_3" adds 1 bonus slot at level 3.
      const bonusTagRegex = /#(\d+)[_]?spell[_]?slot[_]?(\d+)/gi;
    
      for (const file of files) {
        const content = await this.app.vault.read(file);
        const bonusTagMatches = content.matchAll(bonusTagRegex);
        for (const match of bonusTagMatches) {
          const slotsToAdd = parseInt(match[1]);
          const slotLevel = parseInt(match[2]);
    
          // Look for an existing bonus slot entry for this level that was auto-scanned
          let existingBonusSlot = this.settings.bonusSpellSlots.find(slot => slot.level === slotLevel && slot.autoScanned);
          if (existingBonusSlot) {
            // Accumulate the bonus slots if the tag is found in another file
            existingBonusSlot.total += slotsToAdd;
            // Optionally, concatenate source names if desired:
            existingBonusSlot.source = existingBonusSlot.source 
              ? `${existingBonusSlot.source}, ${file.basename}` 
              : file.basename;
          } else {
            // Create a new bonus slot entry from the scan
            this.settings.bonusSpellSlots.push({
              level: slotLevel,
              total: slotsToAdd,
              used: 0,
              source: file.basename,
              autoScanned: true
            });
            importCount++;
          }
        }
      }
    
      await this.saveSettings();
      return importCount;
    }
    

  async activateView() {
    this.updateSpellSlots();
    
    const { workspace } = this.app;

    const leaves = workspace.getLeavesOfType(SPELLBOOK_VIEW_TYPE);

    let leaf: WorkspaceLeaf | null = null;
    if (leaves.length > 0) {
        // If view already exists, activate it
        leaf = leaves[0];
    } else {
        // Create new leaf if not exists
        leaf = workspace.getRightLeaf(false);
    }

    // Null check before setting view state
    if (leaf) {
        await leaf.setViewState({
            type: SPELLBOOK_VIEW_TYPE,
            active: true
        });

        // Ensure the leaf is activated
        workspace.revealLeaf(leaf);
    } else {
        // Fallback error handling
        console.error('Could not create or find a leaf for the Spellbook view');
    }
  }
  
  async activateKnownSpellsView() {
    const { workspace } = this.app;

    const leaves = workspace.getLeavesOfType(KNOWN_SPELLS_VIEW_TYPE);

    let leaf: WorkspaceLeaf | null = null;
    if (leaves.length > 0) {
        // If view already exists, activate it
        leaf = leaves[0];
    } else {
        // Create new leaf if not exists
        leaf = workspace.getRightLeaf(false);
    }

    // Null check before setting view state
    if (leaf) {
        await leaf.setViewState({
            type: KNOWN_SPELLS_VIEW_TYPE,
            active: true
        });

        // Ensure the leaf is activated
        workspace.revealLeaf(leaf);
    } else {
        // Fallback error handling
        console.error('Could not create or find a leaf for the Known Spells view');
    }
  }
  async createSpellWithNote(spell: Spell) {
    const fileName = `${spell.name}.md`;
    const folderPath = this.settings.defaultSpellFolder || "Spells";
    const fullPath = `${folderPath}/${fileName}`;
  
    await this.app.vault.createFolder(folderPath).catch(() => {});
  
    const fileContent = `# ${spell.name}\n\n- **Level:** ${spell.level}\n\n${spell.description}`;
  
    try {
      const file = await this.app.vault.create(fullPath, fileContent);
      spell.path = file.path;
      // (opcional) abrir o arquivo
      // await this.app.workspace.getLeaf().openFile(file);
    } catch (e) {
      console.error("Erro criando nota:", e);
      new Notice("Erro ao criar a nota da magia.");
    }
  
    this.settings.knownSpells.push(spell);
await this.saveSettings();
new Notice(`Magia "${spell.name}" criada com sucesso.`);
  }
  
  async activateUnknownSpellsView() {
    const { workspace } = this.app;
  
    const leaves = workspace.getLeavesOfType(UNKNOWN_SPELLS_VIEW_TYPE);
  
    let leaf: WorkspaceLeaf | null = null;
    if (leaves.length > 0) {
      leaf = leaves[0];
    } else {
      leaf = workspace.getRightLeaf(false);
    }
  
    if (leaf) {
      await leaf.setViewState({
        type: UNKNOWN_SPELLS_VIEW_TYPE,
        active: true
      });
      workspace.revealLeaf(leaf);
    } else {
      console.error('Could not create or find a leaf for the Unknown Spells view');
    }
  }  

  async loadSettings() {
	this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	
  if (!this.settings.bonusSpellSlots) {
    this.settings.bonusSpellSlots = [];
  }
	// Ensure spell slots match character class and level
	if (this.settings.characterClass && this.settings.characterLevel) {
	  const newSlots = calculateSpellSlots(
		this.settings.characterClass,
		this.settings.characterLevel,
    this.settings.bonusSpellSlots 
	  );
	  
	  // Create a mapping of used slots from current settings
	  const usedSlotsMap: Record<number, number> = {};
	  this.settings.spellSlots.forEach(slot => {
		usedSlotsMap[slot.level] = slot.used;
	  });
	  
	  // Apply used slots to new configuration
	  newSlots.forEach(slot => {
		if (usedSlotsMap[slot.level] !== undefined) {
		  slot.used = Math.min(usedSlotsMap[slot.level], slot.total);
		}
	  });
	  
	  this.settings.spellSlots = newSlots;
	  await this.saveSettings();
	}
  }

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async addSpell(spell: Spell) {
    await this.createSpellWithNote(spell);
    this.saveSettings();
  }

	deleteSpell(spellId: string) {
		this.settings.knownSpells = this.settings.knownSpells.filter(spell => spell.id !== spellId);
		this.saveSettings();
	}
  moveSpellToUnknown(spellId: string) {
    const index = this.settings.knownSpells.findIndex(s => s.id === spellId);
    if (index !== -1) {
      const spell = this.settings.knownSpells.splice(index, 1)[0];
  
      // Evita duplicatas na lista de unknown spells
      const alreadyInUnknown = this.settings.unknownSpells.some(
        s => s.name.toLowerCase() === spell.name.toLowerCase()
      );
  
      if (!alreadyInUnknown) {
        this.settings.unknownSpells.push({
          ...spell,
          prepared: false // Garante que ela não fique como preparada
        });
      }
  
      this.saveSettings();
      new Notice(`Moved "${spell.name}" to Unknown Spells.`);
    }
  }
  

	toggleSpellPreparation(spellId: string) {
    const spell = this.settings.knownSpells.find(s => s.id === spellId);
    if (spell) {
      // If trying to prepare a spell (i.e., it is currently unprepared)
      if (!spell.prepared) {
        // Count how many spells are already prepared
        const preparedCount = this.settings.knownSpells.filter(s => s.prepared).length;
        // Maximum allowed is characterLevel + intelligenceModifier
        const maxPrepared = this.settings.characterLevel + this.settings.intelligenceModifier;
        if (preparedCount >= maxPrepared) {
          new Notice(`You can only prepare ${maxPrepared} spells.`);
          return; // Do not toggle preparation
        }
      }
      // Toggle the spell's preparation state
      spell.prepared = !spell.prepared;
      this.saveSettings();
    }
  }
  

	useSpellSlot(level: number) {
    const slot = this.settings.spellSlots.find(s => s.level === level);
    if (slot && slot.used < slot.total) {
      slot.used++;
      new Notice(`Used a level ${level} spell slot. Remaining: ${slot.total - slot.used}/${slot.total}`);
      this.saveSettings();
      this.updateSpellSlots();
    } else {
      new Notice(`No available level ${level} spell slots!`);
    }
  }
  
  restoreSpellSlot(level: number) {
    const slot = this.settings.spellSlots.find(s => s.level === level);
    if (slot && slot.used > 0) {
      slot.used--;
      this.saveSettings();
      this.updateSpellSlots();
    }
  }

  removeDuplicateUnknownSpells() {
    const seen = new Set<string>();
    this.settings.unknownSpells = this.settings.unknownSpells.filter(spell => {
      const key = spell.name.toLowerCase();
      if (seen.has(key)) {
        return false; // duplicate
      }
      seen.add(key);
      return true;
    });
    this.saveSettings();
    new Notice("Removed duplicate unknown spells.");
  }
  
  restoreAllSpellSlots() {
    this.settings.spellSlots.forEach(slot => {
      slot.used = 0;
    });
    // Restore all extra spell uses too
    this.settings.extraSpellUses.forEach(extraUse => {
      extraUse.usesRemaining = extraUse.uses;
  });
  
  this.saveSettings();
}

  //cast spells
  castSpell(spell: Spell) {
    // First check if we have an extra use available
    const extraUse = this.settings.extraSpellUses.find(
        e => e.spellName.toLowerCase() === spell.name.toLowerCase() && e.usesRemaining > 0
    );
    
    if (extraUse) {
        extraUse.usesRemaining--;
        this.saveSettings();
        new Notice(`Cast ${spell.name} using extra use from ${extraUse.source || 'unknown source'} (${extraUse.usesRemaining}/${extraUse.uses} remaining)`);
        return;
    }
    
    // Original spell casting logic
    if (spell.level === 0) {
        new Notice(`Cast ${spell.name} (Cantrip)`);
        return;
    }
    
    const slot = this.settings.spellSlots.find(s => s.level === spell.level);
    if (slot && slot.total > 0 && slot.used < slot.total) {
        slot.used++;
        this.saveSettings();
        new Notice(`Cast ${spell.name} using a level ${spell.level} spell slot`);
        this.updateSpellSlots();
    } else {
        // Try to find higher level slots
        const availableSlots = this.settings.spellSlots
            .filter(s => s.level > spell.level && s.total > 0 && s.used < s.total)
            .sort((a, b) => a.level - b.level);
        
        if (availableSlots.length > 0) {
            const higherSlot = availableSlots[0];
            higherSlot.used++;
            this.saveSettings();
            new Notice(`Cast ${spell.name} using a level ${higherSlot.level} spell slot (upcast)`);
            this.updateSpellSlots();
        } else {
            new Notice(`No available spell slots to cast ${spell.name}!`);
        }
    }
}

async importSpellsFromNotes(): Promise<number> {
	const files = this.app.vault.getMarkdownFiles();
	let importCount = 0;
  
	const levelFolders = [
	  { level: 0, path: this.settings.cantripFolderPath },
	  { level: 1, path: this.settings.level1FolderPath },
	  { level: 2, path: this.settings.level2FolderPath },
	  { level: 3, path: this.settings.level3FolderPath },
	  { level: 4, path: this.settings.level4FolderPath },
	  { level: 5, path: this.settings.level5FolderPath },
	  { level: 6, path: this.settings.level6FolderPath },
	  { level: 7, path: this.settings.level7FolderPath },
	  { level: 8, path: this.settings.level8FolderPath },
	  { level: 9, path: this.settings.level9FolderPath }
	];
  
	// Adiciona pasta global se existir
	if (this.settings.spellFolderPath) {
	  levelFolders.push({ level: -1, path: this.settings.spellFolderPath });
	}
  
	for (const { level, path } of levelFolders) {
	  if (!path) continue;
  
	  const spellFiles = files.filter(file => file.path.startsWith(path));
  
	  for (const file of spellFiles) {
		const spellName = file.basename.trim();
		const normalizedName = spellName.toLowerCase();
  
		const alreadyKnown = this.settings.knownSpells.some(s => s.name.toLowerCase().trim() === normalizedName);
		const alreadyUnknown = this.settings.unknownSpells.some(s => s.name.toLowerCase().trim() === normalizedName);
		if (alreadyKnown || alreadyUnknown) continue;
  
		const content = await this.app.vault.read(file);
		let spellLevel = level;
  
		if (level === -1) {
		  const levelMatch = spellName.match(/\((\d+)\)$/) || spellName.match(/level\s*(\d+)/i);
		  if (levelMatch) {
			spellLevel = parseInt(levelMatch[1]);
		  } else {
			const contentLevelMatch =
			  content.match(/level\s*(\d+)/i) ||
			  content.match(/(\d+)\w{0,2}\s*level/i) ||
			  content.match(/(\d+)(?:st|nd|rd|th)[-\s]level/i);
  
			if (contentLevelMatch) {
			  spellLevel = parseInt(contentLevelMatch[1]);
			}
  
			if (/cantrip/i.test(content)) {
			  spellLevel = 0;
			}
		  }
		}
  
		this.settings.unknownSpells.push({
		  id: Date.now().toString(),
		  name: spellName,
		  level: spellLevel,
		  description: content,
		  prepared: false,
		  path: file.path
		});
  
		importCount++;
	  }
	}
  
	await this.saveSettings();
  
	// ✅ Chama o método agora com segurança
	this.updateSpellSlots();
  
	return importCount;
  }
  
  
  // Update spell slots when class/level changes
  updateSpellSlots() {
    const newSlots = calculateSpellSlots(
      this.settings.characterClass, 
      this.settings.characterLevel,
      this.settings.bonusSpellSlots
    );
    
    // Create a mapping of used slots from current settings
    const usedSlotsMap: Record<number, number> = {};
    this.settings.spellSlots.forEach(slot => {
      usedSlotsMap[slot.level] = slot.used;
    });
    
    // Apply used slots to new configuration where possible
    newSlots.forEach(slot => {
      if (usedSlotsMap[slot.level] !== undefined) {
        slot.used = Math.min(usedSlotsMap[slot.level], slot.total);
      }
    });
    
    this.settings.spellSlots = newSlots;
    this.saveSettings();
    
    // Refresh views if they're open
    const spellbookLeaves = this.app.workspace.getLeavesOfType(SPELLBOOK_VIEW_TYPE);
    if (spellbookLeaves.length > 0) {
      const view = spellbookLeaves[0].view as SpellbookView;
      if (view && view.refresh) {
        view.refresh();
      }
    }
    
    // Also refresh the known spells view if open
    const knownSpellsLeaves = this.app.workspace.getLeavesOfType(KNOWN_SPELLS_VIEW_TYPE);
    if (knownSpellsLeaves.length > 0) {
      const view = knownSpellsLeaves[0].view as KnownSpellsView;
      if (view && view.refresh) {
        view.refresh();
      }
    }
  }
}
class SpellbookSettingTab extends PluginSettingTab {
	plugin: DnDSpellbookPlugin;

	constructor(app: App, plugin: DnDSpellbookPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}
  // Add this method to fix the first error
  getSourceName(bonus: SpellSlot): string {
    return bonus.source || "Unknown Source";
}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
    containerEl.createEl('h3', { text: 'Bonus Spell Slots' });
    containerEl.createEl('p', { text: 'Add extra spell slots from feats, magic items, or other sources' });
    const bonusContainer = containerEl.createDiv({ cls: 'bonus-slots-container' });

// Display existing bonus slots
this.plugin.settings.bonusSpellSlots.forEach((bonus, index) => {
  const bonusDiv = bonusContainer.createDiv({ cls: 'bonus-slot-item' });
  bonusDiv.createEl('span', { 
    text: `Level ${bonus.level}: +${bonus.total} slots (${this.getSourceName(bonus)})`
  });
  
  const removeBtn = bonusDiv.createEl('button', {
    text: 'Remove',
    cls: 'remove-bonus-btn'
  });
  removeBtn.addEventListener('click', async () => {
    this.plugin.settings.bonusSpellSlots.splice(index, 1);
    await this.plugin.saveSettings();
    this.plugin.updateSpellSlots();
    this.display(); // Refresh the settings page
  });
});
new Setting(containerEl)
  .setName('Scan for Bonus Spell Slots')
  .setDesc('Scan notes for bonus spell slot tags (e.g., "#1_spellSlot_3") and update auto-scanned bonus slots.')
  .addButton(button => button
    .setButtonText('Scan Bonus Slots')
    .onClick(async () => {
      const count = await this.plugin.scanNotesForBonusSpellSlots();
      new Notice(`Scanned and added bonus slots from ${count} tag occurrences.`);
      this.display(); // Refresh the settings page
    })
  );
new Setting(containerEl)
  .setName('Add Bonus Spell Slot')
  .addDropdown(dropdown => {
    for (let i = 1; i <= 9; i++) {
      dropdown.addOption(i.toString(), `Level ${i}`);
    }
    dropdown.setValue("1");
    dropdown.selectEl.addClass('add-bonus-dropdown');
    return dropdown;
  })
  .addText(text => {
    text.setPlaceholder("Source (e.g., 'Ring of Spell Storing')");
    text.inputEl.addClass('add-bonus-text');
    return text;
  })
  .addButton(button => {
    button.setButtonText('Add');
    button.onClick(async () => {
      const dropdownElement = document.querySelector('.add-bonus-dropdown') as HTMLSelectElement;
      const level = parseInt(dropdownElement?.value || "1");
      const textElement = document.querySelector('.add-bonus-text') as HTMLInputElement;
      const source = textElement?.value || "Unknown Source";    

      // Add new bonus slot
      this.plugin.settings.bonusSpellSlots.push({
        level,
        total: 1,
        used: 0,
        source // Add a source property to track where the slot comes from
      });
      
      await this.plugin.saveSettings();
      this.plugin.updateSpellSlots();
      this.display(); // Refresh the settings page
    });
  });
  
		new Setting(containerEl)
			.setName('Character Class')
			.setDesc('Select your character\'s class')
			.addDropdown(dropdown => dropdown
				.addOption('wizard', 'Wizard')
				.addOption('cleric', 'Cleric')
				.addOption('druid', 'Druid')
				.addOption('paladin', 'Paladin')
				.addOption('ranger', 'Ranger')
				.setValue(this.plugin.settings.characterClass)
				.onChange(async (value) => {
					this.plugin.settings.characterClass = value;
          // Update spell slots when class changes
          this.plugin.updateSpellSlots();
					await this.plugin.saveSettings();
          
          // Show notice about spell slots
          new Notice('Spell slots updated based on character class');
				})
			);
      
      new Setting(containerEl)
  .setName('Learn Unknown Spells')
  .setDesc('Select a spell from the Unknown Spells list to learn it.')
  .addDropdown(dropdown => {
    dropdown.addOption('', 'Select a spell...');
    // Populate the dropdown with unknown spells
    this.plugin.settings.unknownSpells.forEach(spell => {
      dropdown.addOption(spell.id, spell.name);
    });
    dropdown.onChange(async (value: string) => {
      if (value) {
        this.plugin.learnSpell(value);
        // Refresh the settings view to update the lists.
        this.display();
      }
    });
  });
  
  new Setting(containerEl)
  .setName("Default Folder for New Spell Notes")
  .setDesc("The folder where new spell notes will be created.")
  .addText(text =>
    text
      .setPlaceholder("Spells")
      .setValue(this.plugin.settings.defaultSpellFolder || "")
      .onChange(async (value) => {
        this.plugin.settings.defaultSpellFolder = value.trim() || "Spells";
        await this.plugin.saveSettings();
      })
  );


      
      new Setting(containerEl)
      .setName('Import Spells from Notes')
      .setDesc('Specify a folder path to import spells from, or leave blank to scan all notes')
      .addText(text => text
        .setPlaceholder('Spells folder path (optional)')
        .setValue(this.plugin.settings.spellFolderPath || '')
        .onChange(async (value) => {
          this.plugin.settings.spellFolderPath = value;
          await this.plugin.saveSettings();
        })
      );

		new Setting(containerEl)
			.setName('Character Level')
			.setDesc('Set your character\'s current level (1-20)')
			.addSlider(slider => slider
				.setLimits(1, 20, 1)
				.setValue(this.plugin.settings.characterLevel)
				.setDynamicTooltip()
				.onChange(async (value) => {
					this.plugin.settings.characterLevel = value;
          // Update spell slots when level changes
          this.plugin.updateSpellSlots();
					await this.plugin.saveSettings();
          
          // Show notice about spell slots
          new Notice('Spell slots updated based on character level');
				})
			);

      new Setting(containerEl)
    .setName('Global Spell Folder')
    .setDesc('Optional: Specify a folder path to import spells from (will attempt to detect spell level)')
    .addText(text => text
      .setPlaceholder('Spells folder path (optional)')
      .setValue(this.plugin.settings.spellFolderPath || '')
      .onChange(async (value) => {
        this.plugin.settings.spellFolderPath = value;
        await this.plugin.saveSettings();
      })
    );
  
  // Cantrip folder
  new Setting(containerEl)
    .setName('Cantrips Folder')
    .setDesc('Folder path for cantrips (level 0 spells)')
    .addText(text => text
      .setPlaceholder('Cantrips folder path')
      .setValue(this.plugin.settings.cantripFolderPath || '')
      .onChange(async (value) => {
        this.plugin.settings.cantripFolderPath = value;
        await this.plugin.saveSettings();
      })
    );
    
  // Level 1 spells
  new Setting(containerEl)
    .setName('Level 1 Spells Folder')
    .setDesc('Folder path for level 1 spells')
    .addText(text => text
      .setPlaceholder('Level 1 spells folder path')
      .setValue(this.plugin.settings.level1FolderPath || '')
      .onChange(async (value) => {
        this.plugin.settings.level1FolderPath = value;
        await this.plugin.saveSettings();
      })
    );
    // Continue with settings for levels 2-9...
  // defaults:
  // Level 2 spells
new Setting(containerEl)
.setName('Level 2 Spells Folder')
.setDesc('Folder path for level 2 spells')
.addText(text => text
  .setPlaceholder('Level 2 spells folder path')
  .setValue(this.plugin.settings.level2FolderPath || '')
  .onChange(async (value) => {
    this.plugin.settings.level2FolderPath = value;
    await this.plugin.saveSettings();
  })
);

// Level 3 spells
new Setting(containerEl)
.setName('Level 3 Spells Folder')
.setDesc('Folder path for level 3 spells')
.addText(text => text
  .setPlaceholder('Level 3 spells folder path')
  .setValue(this.plugin.settings.level3FolderPath || '')
  .onChange(async (value) => {
    this.plugin.settings.level3FolderPath = value;
    await this.plugin.saveSettings();
  })
);

// Level 4 spells
new Setting(containerEl)
.setName('Level 4 Spells Folder')
.setDesc('Folder path for level 4 spells')
.addText(text => text
  .setPlaceholder('Level 4 spells folder path')
  .setValue(this.plugin.settings.level4FolderPath || '')
  .onChange(async (value) => {
    this.plugin.settings.level4FolderPath = value;
    await this.plugin.saveSettings();
  })
);

// Level 5 spells
new Setting(containerEl)
.setName('Level 5 Spells Folder')
.setDesc('Folder path for level 5 spells')
.addText(text => text
  .setPlaceholder('Level 5 spells folder path')
  .setValue(this.plugin.settings.level5FolderPath || '')
  .onChange(async (value) => {
    this.plugin.settings.level5FolderPath = value;
    await this.plugin.saveSettings();
  })
);

// Level 6 spells
new Setting(containerEl)
.setName('Level 6 Spells Folder')
.setDesc('Folder path for level 6 spells')
.addText(text => text
  .setPlaceholder('Level 6 spells folder path')
  .setValue(this.plugin.settings.level6FolderPath || '')
  .onChange(async (value) => {
    this.plugin.settings.level6FolderPath = value;
    await this.plugin.saveSettings();
  })
);

// Level 7 spells
new Setting(containerEl)
.setName('Level 7 Spells Folder')
.setDesc('Folder path for level 7 spells')
.addText(text => text
  .setPlaceholder('Level 7 spells folder path')
  .setValue(this.plugin.settings.level7FolderPath || '')
  .onChange(async (value) => {
    this.plugin.settings.level7FolderPath = value;
    await this.plugin.saveSettings();
  })
);

// Level 8 spells
new Setting(containerEl)
.setName('Level 8 Spells Folder')
.setDesc('Folder path for level 8 spells')
.addText(text => text
  .setPlaceholder('Level 8 spells folder path')
  .setValue(this.plugin.settings.level8FolderPath || '')
  .onChange(async (value) => {
    this.plugin.settings.level8FolderPath = value;
    await this.plugin.saveSettings();
  })
);

// Level 9 spells
new Setting(containerEl)
.setName('Level 9 Spells Folder')
.setDesc('Folder path for level 9 spells')
.addText(text => text
  .setPlaceholder('Level 9 spells folder path')
  .setValue(this.plugin.settings.level9FolderPath || '')
  .onChange(async (value) => {
    this.plugin.settings.level9FolderPath = value;
    await this.plugin.saveSettings();
  })
);
new Setting(containerEl)
      .setName('Import Now')
      .setDesc('Import spells from notes based on the folder settings above')
      .addButton(button => button
        .setButtonText('Import Spells')
        .onClick(async () => {
          const count = await this.plugin.importSpellsFromNotes();
          new Notice(`Imported ${count} spells from configured folders`);
        })
      );

      new Setting(containerEl)
  .setName('Remove Duplicate Unknown Spells')
  .setDesc('Clean up duplicates from older scans')
  .addButton(button => 
    button.setButtonText('Clean Now')
      .onClick(() => {
        this.plugin.removeDuplicateUnknownSpells();
        this.display(); // Refresh UI
      })
  );
// Extra Spell Uses section
containerEl.createEl('h3', { text: 'Extra Spell Uses (from Tags)' });
containerEl.createEl('p', { 
  text: 'Spells with extra uses from tags like #1fireball' 
});

const extraUsesContainer = containerEl.createDiv({ cls: 'extra-uses-container' });

// Display existing extra spell uses
this.plugin.settings.extraSpellUses.forEach((extraUse, index) => {
  const extraUseDiv = extraUsesContainer.createDiv({ cls: 'extra-use-item' });
  extraUseDiv.createEl('span', { 
    text: `${extraUse.spellName}: ${extraUse.usesRemaining}/${extraUse.uses} uses (from ${extraUse.source || 'unknown'})` 
  });
  
  const removeBtn = extraUseDiv.createEl('button', {
    text: 'Remove',
    cls: 'remove-extra-use-btn'
  });
  removeBtn.addEventListener('click', async () => {
    this.plugin.settings.extraSpellUses.splice(index, 1);
    await this.plugin.saveSettings();
    this.display(); // Refresh the settings page
  });
});

new Setting(containerEl)
  .setName('Scan Notes for Tagged Spells')
  .setDesc('Look for tags like #1fireball in your notes to find extra spell uses')
  .addButton(button => button
    .setButtonText('Scan Now')
    .onClick(async () => {
      const count = await this.plugin.scanNotesForTaggedSpells();
      new Notice(`Found ${count} tagged spells with extra uses`);
      this.display(); // Refresh the settings page
    })
  );

    // Add a button to reset all spell slots
    new Setting(containerEl)
      .setName('Reset Spell Slots')
      .setDesc('Restore all spell slots (as if after a long rest)')
      .addButton(button => button
        .setButtonText('Long Rest')
        .onClick(async () => {
          this.plugin.restoreAllSpellSlots();
          new Notice('All spell slots restored after a long rest!');
        })
      );
      
    // Add information about known spells
    containerEl.createEl('h3', { text: 'Known Spells' });
    
    const spellCount = this.plugin.settings.knownSpells.length;
    const preparedCount = this.plugin.settings.knownSpells.filter(s => s.prepared).length;
    
    containerEl.createEl('p', { 
      text: `You currently know ${spellCount} spells and have ${preparedCount} prepared.` 
    });
    
    
    new Setting(containerEl)
      .setName('Manage Spells')
      .setDesc('Open the spellbook to add, remove, or prepare spells')
      .addButton(button => button
        .setButtonText('Open Spellbook')
        .onClick(async () => {
          await this.plugin.activateView();
        })
      );
      new Setting(containerEl)
  .setName('Unknown Spells')
  .setDesc('View and manage unknown spells.')
  .addButton(button => button
    .setButtonText('Open Unknown Spells')
    .onClick(async () => {
      await this.plugin.activateUnknownSpellsView();
    })
  );

  new Setting(containerEl)
  .setName('Intelligence Modifier')
  .setDesc('Set your character’s Intelligence modifier (affects the number of prepared spells).')
  .addSlider(slider => slider
    .setLimits(-5, 10, 1)
    .setValue(this.plugin.settings.intelligenceModifier)
    .setDynamicTooltip()
    .onChange(async (value) => {
      this.plugin.settings.intelligenceModifier = value;
      await this.plugin.saveSettings();
      new Notice('Intelligence Modifier updated.');
    })
  );

	}
}