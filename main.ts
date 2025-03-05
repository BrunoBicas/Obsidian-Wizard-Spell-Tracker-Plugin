import { 
	App, 
	Plugin, 
	PluginSettingTab, 
	Setting, 
	WorkspaceLeaf, 
	View, 
	ItemView 
} from 'obsidian';

const SPELLBOOK_VIEW_TYPE = 'dnd-spellbook-view';

interface SpellSlot {
	level: number;
	total: number;
	used: number;
}

interface Spell {
	id: string;
	name: string;
	level: number;
	description: string;
	prepared: boolean;
}

interface DnDSpellbookSettings {
	characterClass: string;
	characterLevel: number;
	spellSlots: SpellSlot[];
	knownSpells: Spell[];
}

const DEFAULT_SETTINGS: DnDSpellbookSettings = {
	characterClass: 'wizard',
	characterLevel: 1,
	spellSlots: [
		{ level: 1, total: 2, used: 0 },
		{ level: 2, total: 0, used: 0 },
		{ level: 3, total: 0, used: 0 },
		{ level: 4, total: 0, used: 0 },
		{ level: 5, total: 0, used: 0 }
	],
	knownSpells: []
};

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
    
		
		// Character Info Section
		const charInfoSection = container.createDiv({ cls: 'character-info' });
		charInfoSection.createEl('h2', { text: 'Character Information' });
		charInfoSection.createEl('p', { 
			text: `Class: ${this.plugin.settings.characterClass} | Level: ${this.plugin.settings.characterLevel}` 
		});

		// Spell Slots Section
		const spellSlotsSection = container.createDiv({ cls: 'spell-slots-section' });
		spellSlotsSection.createEl('h2', { text: 'Spell Slots' });

    // Add a close button near the top of the container
    const closeButton = container.createEl('button', {
      text: '✕ Close',
      cls: 'close-spellbook-btn'
  });
  closeButton.addEventListener('click', () => {
      this.app.workspace.detachLeavesOfType(SPELLBOOK_VIEW_TYPE);
  });
  
		
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
			}
		});

		// Known Spells Section
		const spellsSection = container.createDiv({ cls: 'known-spells-section' });
		spellsSection.createEl('h2', { text: 'Known Spells' });

		// Add Spell Button
		const addSpellBtn = container.createEl('button', { 
			text: '+ Add New Spell',
			cls: 'add-spell-btn'
		});
		addSpellBtn.addEventListener('click', () => this.openAddSpellModal());

		// Render Spells
		this.renderSpells(spellsSection);
	}

	renderSpells(container: HTMLElement) {
		container.empty();

		this.plugin.settings.knownSpells.forEach(spell => {
			const spellDiv = container.createDiv({ cls: 'spell-card' });
			
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

			// Prepare/Unprepare Toggle
			const prepareBtn = spellDiv.createEl('button', {
				text: spell.prepared ? 'Unprepare' : 'Prepare',
				cls: 'prepare-btn'
			});
			prepareBtn.addEventListener('click', () => {
				this.plugin.toggleSpellPreparation(spell.id);
				this.refresh();
			});

			// Delete Spell Button
			const deleteBtn = spellDiv.createEl('button', {
				text: 'Delete',
				cls: 'delete-btn'
			});
			deleteBtn.addEventListener('click', () => {
				this.plugin.deleteSpell(spell.id);
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
	settings: DnDSpellbookSettings;

	async onload() {
		await this.loadSettings();

		// Register custom view
		this.registerView(
			SPELLBOOK_VIEW_TYPE, 
			(leaf) => new SpellbookView(leaf, this)
		);

		// Add ribbon icon to open spellbook
		this.addRibbonIcon('book', 'D&D Spellbook', async () => {
			await this.activateView();
		});

		// Add settings tab
		this.addSettingTab(new SpellbookSettingTab(this.app, this));
	}

	 async activateView() {
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

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
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
			this.saveSettings();
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
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName('Character Level')
			.setDesc('Set your character\'s current level')
			.addText(text => text
				.setValue(this.plugin.settings.characterLevel.toString())
				.onChange(async (value) => {
					const level = parseInt(value, 10);
					if (!isNaN(level) && level > 0 && level <= 20) {
						this.plugin.settings.characterLevel = level;
						await this.plugin.saveSettings();
					}
				})
			);
	}
}