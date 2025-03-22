import { 
	App, 
	Plugin, 
	PluginSettingTab, 
	Setting, 
	WorkspaceLeaf, 
	View, 
	ItemView,
  Notice
} from 'obsidian';

const SPELLBOOK_VIEW_TYPE = 'dnd-spellbook-view';
const KNOWN_SPELLS_VIEW_TYPE = 'dnd-known-spells-view';

interface SpellSlot {
	level: number;
	total: number;
	used: number;
}

interface DnDSpellbookSettings {
  characterClass: string;
  characterLevel: number;
  spellSlots: SpellSlot[];
  knownSpells: Spell[];
  importSpellsFromNotes: boolean;
  spellFolderPath: string;
}

interface Spell {
	id: string;
	name: string;
	level: number;
	description: string;
	prepared: boolean;
}

const DEFAULT_SETTINGS: DnDSpellbookSettings = {
	characterClass: 'wizard',
	characterLevel: 1,
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
	knownSpells: [],
  importSpellsFromNotes: false,
  spellFolderPath: ''
};

// Function to calculate spell slots based on class and level
function calculateSpellSlots(characterClass: string, level: number): SpellSlot[] {
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
		preparedSpellsSection.createEl('h2', { text: 'Prepared Spells' });
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

			// Description
			spellDiv.createEl('p', { 
				text: spell.description,
				cls: 'spell-description'
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
    addSpellBtn.addEventListener('click', () => this.openAddSpellModal());
    
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
          if (confirm(`Are you sure you want to delete "${spell.name}"?`)) {
            this.plugin.deleteSpell(spell.id);
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
  
  // Initialize spell slots based on current class/level when plugin loads
  this.settings.spellSlots = calculateSpellSlots(
    this.settings.characterClass,
    this.settings.characterLevel
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

  async loadSettings() {
	this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	
	// Ensure spell slots match character class and level
	if (this.settings.characterClass && this.settings.characterLevel) {
	  const newSlots = calculateSpellSlots(
		this.settings.characterClass,
		this.settings.characterLevel
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

	addSpell(spell: Spell) {
		this.settings.knownSpells.push(spell);
		this.saveSettings();
	}

	deleteSpell(spellId: string) {
		this.settings.knownSpells = this.settings.knownSpells.filter(spell => spell.id !== spellId);
		this.saveSettings();
	}

	toggleSpellPreparation(spellId: string) {
		const spell = this.settings.knownSpells.find(s => s.id === spellId);
		if (spell) {
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
  
  restoreAllSpellSlots() {
    this.settings.spellSlots.forEach(slot => {
      slot.used = 0;
    });
    this.saveSettings();
  }

  //cast spells
  castSpell(spell: Spell) {
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

async importSpellsFromNotes() {
  const files = this.app.vault.getMarkdownFiles();
  const spellFolderPath = this.settings.spellFolderPath || "";
  
  // Filter files by folder path if specified
  const spellFiles = spellFolderPath 
    ? files.filter(file => file.path.startsWith(spellFolderPath))
    : files;
  
  let importCount = 0;
  
  for (const file of spellFiles) {
    // Check if spell already exists
    const spellName = file.basename;
    const existingSpell = this.settings.knownSpells.find(s => s.name === spellName);
    
    // Read file content to use as description
    const content = await this.app.vault.read(file);
    
    if (existingSpell) {
      // Update existing spell description
      existingSpell.description = content;
      importCount++;
    } else {
      // Try to determine spell level from filename or content
      let spellLevel = 0;
      
      // Check if filename contains level (e.g., "Fireball (3)" or "Fireball - Level 3")
      const levelMatch = spellName.match(/\((\d+)\)$/) || spellName.match(/level\s*(\d+)/i);
      if (levelMatch) {
        spellLevel = parseInt(levelMatch[1]);
      }
      
      // If level wasn't found in filename, try to find it in content with broader pattern matching
      if (spellLevel === 0) {
        const contentLevelMatch = content.match(/level\s*(\d+)/i) || 
                                 content.match(/(\d+)\w{0,2}\s*level/i) ||
                                 content.match(/(\d+)(?:st|nd|rd|th)[-\s]level/i);
        if (contentLevelMatch) {
          spellLevel = parseInt(contentLevelMatch[1]);
        }
        
        // Check for "cantrip" or "level 0" mentions
        if (content.match(/cantrip/i)) {
          spellLevel = 0;
        }
      }
      
      // Add the new spell
      this.addSpell({
        id: Date.now().toString(),
        name: spellName,
        level: spellLevel,
        description: content,
        prepared: false
      });
      importCount++;
    }
  }
  
  new Notice(`Imported ${importCount} spells from notes`);
}
  
  // Update spell slots when class/level changes
  updateSpellSlots() {
    const newSlots = calculateSpellSlots(
      this.settings.characterClass, 
      this.settings.characterLevel
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

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

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
      .setName('Import Now')
      .setDesc('Import spells from notes based on the settings above')
      .addButton(button => button
        .setButtonText('Import Spells')
        .onClick(async () => {
          await this.plugin.importSpellsFromNotes();
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
	}
}