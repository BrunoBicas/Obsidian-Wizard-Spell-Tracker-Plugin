import { App, Plugin, PluginSettingTab, Setting, MarkdownView, TFile } from 'obsidian';

interface SpellSlot {
	level: number;
	total: number;
	used: number;
}

interface Spell {
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

export default class DnDSpellbookPlugin extends Plugin {
	settings: DnDSpellbookSettings;

	async onload() {
		await this.loadSettings();

		// Add a ribbon icon to open the spellbook
		this.addRibbonIcon('book', 'D&D Spellbook', () => {
			this.openSpellbook();
		});

		// Add settings tab
		this.addSettingTab(new SpellbookSettingTab(this.app, this));
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async openSpellbook() {
		// Create a temporary file in the vault
		const fileName = `DnD_Spellbook_${Date.now()}.md`;
		const fileContent = this.generateSpellbookContent();

		// Create the file
		const file = await this.app.vault.create(fileName, fileContent);

		// Open the file
		await this.app.workspace.openLinkText(fileName, '', true);
	}

	generateSpellbookContent(): string {
		let content = "# Spellbook\n\n";

		// Character Info
		content += `## Character Information\n`;
		content += `- **Class**: ${this.settings.characterClass}\n`;
		content += `- **Level**: ${this.settings.characterLevel}\n\n`;

		// Spell Slots
		content += "## Spell Slots\n";
		this.settings.spellSlots.forEach(slot => {
			if (slot.total > 0) {
				content += `- **Level ${slot.level}**: ${slot.total - slot.used}/${slot.total} remaining\n`;
			}
		});

		// Known Spells
		content += "\n## Known Spells\n";
		this.settings.knownSpells.forEach(spell => {
			content += `### ${spell.name} (Level ${spell.level})\n`;
			content += `${spell.description}\n`;
			content += `- ${spell.prepared ? "✅ Prepared" : "❌ Unprepared"}\n\n`;
		});

		// Commands
		content += "## Spell Management\n";
		content += "- To use a spell slot, mark it as used\n";
		content += "- To prepare/unprepare a spell, edit the spell's status\n";

		return content;
	}

	addSpell(spell: Spell) {
		this.settings.knownSpells.push(spell);
		this.saveSettings();
	}

	useSpellSlot(level: number) {
		const slot = this.settings.spellSlots.find(s => s.level === level);
		if (slot && slot.used < slot.total) {
			slot.used++;
			this.saveSettings();
		}
	}

	resetSpellSlots() {
		this.settings.spellSlots.forEach(slot => {
			slot.used = 0;
		});
		this.saveSettings();
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