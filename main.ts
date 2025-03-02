/**
 * D&D Wizard Spell Tracker
 * An Obsidian plugin to track spell slots, known spells, and wizard tasks
 */
import { App, Plugin, PluginSettingTab, Setting, MarkdownPostProcessorContext, TFolder, TAbstractFile } from 'obsidian';

// Define interfaces for type safety
interface WizardLevelData {
  slots: number[];
  cantrips: number;
  spellbook: number;
}

interface WizardTask {
  text: string;
  completed: boolean;
}

interface WizardSpell {
  name: string;
  level: number;
  school: string;
  prepared: boolean;
}

// Define wizard level data as a typed constant
const WIZARD_LEVELS: Record<number, WizardLevelData> = {
  1: { slots: [2], cantrips: 3, spellbook: 6 },
  2: { slots: [3], cantrips: 3, spellbook: 8 },
  3: { slots: [4, 2], cantrips: 3, spellbook: 10 },
  4: { slots: [4, 3], cantrips: 4, spellbook: 12 },
  5: { slots: [4, 3, 2], cantrips: 4, spellbook: 14 },
  6: { slots: [4, 3, 3], cantrips: 4, spellbook: 16 },
  7: { slots: [4, 3, 3, 1], cantrips: 4, spellbook: 18 },
  8: { slots: [4, 3, 3, 2], cantrips: 4, spellbook: 20 },
  9: { slots: [4, 3, 3, 3, 1], cantrips: 4, spellbook: 22 },
  10: { slots: [4, 3, 3, 3, 2], cantrips: 5, spellbook: 24 },
  11: { slots: [4, 3, 3, 3, 2, 1], cantrips: 5, spellbook: 26 },
  12: { slots: [4, 3, 3, 3, 2, 1], cantrips: 5, spellbook: 28 },
  13: { slots: [4, 3, 3, 3, 2, 1, 1], cantrips: 5, spellbook: 30 },
  14: { slots: [4, 3, 3, 3, 2, 1, 1], cantrips: 5, spellbook: 32 },
  15: { slots: [4, 3, 3, 3, 2, 1, 1, 1], cantrips: 5, spellbook: 34 },
  16: { slots: [4, 3, 3, 3, 2, 1, 1, 1], cantrips: 5, spellbook: 36 },
  17: { slots: [4, 3, 3, 3, 2, 1, 1, 1, 1], cantrips: 5, spellbook: 38 },
  18: { slots: [4, 3, 3, 3, 3, 1, 1, 1, 1], cantrips: 5, spellbook: 40 },
  19: { slots: [4, 3, 3, 3, 3, 2, 1, 1, 1], cantrips: 5, spellbook: 42 },
  20: { slots: [4, 3, 3, 3, 3, 2, 2, 1, 1], cantrips: 5, spellbook: 44 }
};

class WizardCharacterData {
  level: number;
  name: string;
  arcaneRecoveryUsed: boolean;
  arcaneSubclass: string;
  spellsKnown: WizardSpell[];
  cantripsKnown: WizardSpell[];
  preparedSpells: WizardSpell[];
  customTasks: WizardTask[];
  currentSpellSlots: number[];
  
  constructor() {
    this.level = 1;
    this.name = "My Wizard";
    this.arcaneRecoveryUsed = false;
    this.arcaneSubclass = "School of Evocation";
    this.spellsKnown = [];
    this.cantripsKnown = [];
    this.preparedSpells = [];
    this.customTasks = [];
    this.currentSpellSlots = [...WIZARD_LEVELS[1].slots];
  }

  getMaxPreparedSpells(): number {
    return this.level + Math.floor(this.getStat("intelligence") / 2);
  }

  getStat(stat: string): number {
    // Default INT to 16 for a new wizard
    return stat === "intelligence" ? 16 : 10;
  }

  levelUp(newLevel: number): void {
    if (newLevel > 20) newLevel = 20;
    if (newLevel < 1) newLevel = 1;
    
    this.level = newLevel;
    this.currentSpellSlots = [...WIZARD_LEVELS[newLevel].slots];
  }

  resetSpellSlots(): void {
    this.currentSpellSlots = [...WIZARD_LEVELS[this.level].slots];
    this.arcaneRecoveryUsed = false;
  }

  useSpellSlot(level: number): boolean {
    if (level < 1 || level > this.currentSpellSlots.length) return false;
    if (this.currentSpellSlots[level - 1] > 0) {
      this.currentSpellSlots[level - 1]--;
      return true;
    }
    return false;
  }

  arcaneRecovery(): boolean {
    if (this.arcaneRecoveryUsed) return false;
    
    // Calculate recoverable slots (up to level/2 rounded up spell slot levels)
    const maxRecovery = Math.ceil(this.level / 2);
    // Implementation would allow user to choose which slots to recover here
    this.arcaneRecoveryUsed = true;
    return true;
  }

  getWizardTasks(): WizardTask[] {
    const tasks: WizardTask[] = [
      { text: "Prepare spells (INT mod + Wizard level)", completed: false },
      { text: `Copy new spells into spellbook (50gp and 2 hours per spell level)`, completed: false },
      { text: "Check Arcane Recovery (once per day after short rest)", completed: this.arcaneRecoveryUsed }
    ];

    // Add level-specific tasks
    if (this.level >= 2) {
      tasks.push({ text: `Use Arcane Tradition: ${this.arcaneSubclass} features`, completed: false });
    }
    
    if (this.level >= 10) {
      tasks.push({ text: "Consider using Arcane Tradition capstone abilities", completed: false });
    }
    
    if (this.level >= 18) {
      tasks.push({ text: "Use Spell Mastery for free 1st and 2nd level spells", completed: false });
    }
    
    if (this.level >= 20) {
      tasks.push({ text: "Use Signature Spells for free 3rd level spells (1/rest)", completed: false });
    }

    // Add custom tasks
    return [...tasks, ...this.customTasks];
  }
}

interface WizardPluginSettings {
  autoReset: string;
  dataFile: string;
  wizardData: WizardCharacterData;
  spellFolders: Record<string, string>; // Add this line
}

export default class WizardSpellTrackerPlugin extends Plugin {
  settings: WizardPluginSettings;

  async onload(): Promise<void> {
    this.settings = {
      autoReset: "long-rest", 
      dataFile: "wizard-spells.json",
      wizardData: new WizardCharacterData(),
      spellFolders: {
        "cantrip": "",
        "level1": "",
        "level2": "",
        "level3": "",
        "level4": "",
        "level5": "",
        "level6": "",
        "level7": "",
        "level8": "",
        "level9": ""
      }
    };
    this.addCommand({
      id: "scan-spell-folders",
      name: "Scan Spell Folders",
      callback: () => this.scanSpellFolders()
    });
    
    await this.loadSettings();
    
    // Register commands
    this.addCommand({
      id: "open-wizard-tracker",
      name: "Open Wizard Spell Tracker",
      callback: () => this.openSpellTracker()
    });
    
    this.addCommand({
      id: "reset-spell-slots",
      name: "Reset Spell Slots (Long Rest)",
      callback: () => this.resetSpellSlots()
    });
    
    this.addCommand({
      id: "arcane-recovery",
      name: "Use Arcane Recovery (Short Rest)",
      callback: () => this.useArcaneRecovery()
    });
    
    // Register settings tab
    this.addSettingTab(new WizardSpellTrackerSettingTab(this.app, this));
    
    // Register Markdown post processor for special syntax
    this.registerMarkdownPostProcessor((el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
      const codeblocks = el.querySelectorAll("code");
      for (let code of Array.from(codeblocks)) {
        if (code.innerText.trim() === "!wizard-spells") {
          this.renderSpellTracker(code.parentElement as HTMLElement);
        }
      }
    });
  }

  async loadSettings(): Promise<void> {
    try {
      const data = await this.app.vault.adapter.read(this.settings.dataFile);
      const savedData = JSON.parse(data);
      this.settings.wizardData = Object.assign(new WizardCharacterData(), savedData);
    } catch (e) {
      console.log("No wizard data found, creating new");
    }
  }

  async saveSettings(): Promise<void> {
    await this.app.vault.adapter.write(
      this.settings.dataFile, 
      JSON.stringify(this.settings.wizardData, null, 2)
    );
  }
  async scanSpellFolders(): Promise<void> {
    const spells: WizardSpell[] = [];
    const cantrips: WizardSpell[] = [];
    
    // For each configured folder
    for (const [levelKey, folderPath] of Object.entries(this.settings.spellFolders)) {
      if (!folderPath) continue;
      
      // Get spell level from the key
      const level = levelKey === "cantrip" ? 0 : parseInt(levelKey.replace("level", ""));
      
      try {
        // Get all files in the folder
        const folder = this.app.vault.getAbstractFileByPath(folderPath);
        if (!folder || !(folder instanceof TFolder)) continue;
        
        let files: any[] = [];
        if (folder instanceof TFolder) {
          files = folder.children.filter(file => file.path.endsWith('.md'));
        } else {
          console.log("Not a valid folder");
          return;
        }
          
        for (const file of files) {
          // Make sure file has the right properties before using them
          if (file && typeof file.basename === 'string' && typeof file.extension === 'string') {
          // Extract spell name from filename
          const name = file.basename;
          
          // Try to determine school by reading file content
          let school = "Unknown";
          try {
            const content = await this.app.vault.read(file);
            // Simple detection - you may want to improve this
            const schoolMatches = content.match(/school of (.*?)[,\.\n]/i);
            if (schoolMatches) {
              school = schoolMatches[1].charAt(0).toUpperCase() + schoolMatches[1].slice(1);
            }
          } catch (e) {
            console.log("Could not read spell file:", e);
          }
          
          // Create spell object
          const spell: WizardSpell = {
            name,
            level,
            school,
            prepared: false
          };
          
          // Add to appropriate array
          if (level === 0) {
            cantrips.push(spell);
          } else {
            spells.push(spell);
          }
        }
      } catch (e) {
        console.log(`Error scanning folder ${folderPath}:`, e);
      }
    }
    
    // Update wizard data
    this.settings.wizardData.spellsKnown = spells;
    this.settings.wizardData.cantripsKnown = cantrips;
    
    await this.saveSettings();
  }}

  openSpellTracker(): void {
    const content = this.generateSpellTrackerMarkdown();
    
    // Create or open the spell tracker note
    const fileName = "Wizard Spell Tracker.md";
    const existingFile = this.app.vault.getAbstractFileByPath(fileName);
    
    if (existingFile) {
      this.app.workspace.openLinkText(fileName, "", true);
    } else {
      this.app.vault.create(fileName, content).then(file => {
        this.app.workspace.openLinkText(fileName, "", true);
      });
    }
  }

  generateSpellTrackerMarkdown(): string {
    const data = this.settings.wizardData;
    const levelData = WIZARD_LEVELS[data.level];
    
    let content = `# ${data.name} - Level ${data.level} Wizard\n\n`;
    content += `> [!info] Wizard Stats\n> - Arcane Tradition: ${data.arcaneSubclass}\n`;
    content += `> - Spellbook: ${data.spellsKnown.length}/${levelData.spellbook} spells\n`;
    content += `> - Prepared: ${data.preparedSpells.length}/${data.getMaxPreparedSpells()} spells\n\n`;
    
    content += "## Spell Slots\n\n";
    content += "!wizard-spells\n\n";
    
    content += "## Daily Wizard Tasks\n\n";
    const tasks = data.getWizardTasks();
    tasks.forEach(task => {
      content += `- [${task.completed ? "x" : " "}] ${task.text}\n`;
    });
    
    content += "\n## Spellbook\n\n";
    content += "Add your known spells here with spell level and school.\n\n";
    
    return content;
  }

  renderSpellTracker(element: HTMLElement): void {
    const data = this.settings.wizardData;
    const container = document.createElement("div");
    container.className = "wizard-spell-tracker";
    
    // Add styles
    const style = document.createElement("style");
    style.textContent = `
      .wizard-spell-tracker {
        background: #f5f5f5;
        border-radius: 4px;
        padding: 10px;
        margin: 10px 0;
      }
      .spell-slot-container {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 10px;
      }
      .spell-level {
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 8px;
        min-width: 120px;
      }
      .spell-level-title {
        font-weight: bold;
        margin-bottom: 5px;
      }
      .spell-slots {
        display: flex;
        gap: 5px;
      }
      .spell-slot {
        width: 20px;
        height: 20px;
        border: 2px solid #7b6cd9;
        border-radius: 50%;
        display: inline-block;
        cursor: pointer;
      }
      .spell-slot.used {
        background-color: #ddd;
        border-color: #999;
      }
      .spell-slot.available {
        background-color: #7b6cd9;
      }
      .wizard-controls {
        margin-top: 10px;
        display: flex;
        gap: 10px;
      }
      .wizard-button {
        background: #7b6cd9;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
      }
      .wizard-button:disabled {
        background: #ddd;
        cursor: not-allowed;
      }
      .level-selector {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
      }
    `;
    container.appendChild(style);
    
    // Level selector
    const levelSelector = document.createElement("div");
    levelSelector.className = "level-selector";
    const levelLabel = document.createElement("label");
    levelLabel.textContent = "Wizard Level: ";
    const levelSelect = document.createElement("select");
    for (let i = 1; i <= 20; i++) {
      const option = document.createElement("option");
      option.value = i.toString();
      option.textContent = i.toString();
      if (i === data.level) option.selected = true;
      levelSelect.appendChild(option);
    }
    levelSelector.appendChild(levelLabel);
    levelSelector.appendChild(levelSelect);
    container.appendChild(levelSelector);
    
    // Create spell slot display
    const slotContainer = document.createElement("div");
    slotContainer.className = "spell-slot-container";
    
    const slots = WIZARD_LEVELS[data.level].slots;
    for (let i = 0; i < slots.length; i++) {
      const level = i + 1;
      const maxSlots = slots[i];
      const currentSlots = data.currentSpellSlots[i] || 0;
      
      const levelDiv = document.createElement("div");
      levelDiv.className = "spell-level";
      
      const titleDiv = document.createElement("div");
      titleDiv.className = "spell-level-title";
      titleDiv.textContent = `Level ${level} (${currentSlots}/${maxSlots})`;
      levelDiv.appendChild(titleDiv);
      
      const slotsDiv = document.createElement("div");
      slotsDiv.className = "spell-slots";
      
      for (let j = 0; j < maxSlots; j++) {
        const slotDiv = document.createElement("div");
        slotDiv.className = j < currentSlots ? "spell-slot available" : "spell-slot used";
        slotDiv.dataset.level = level.toString();
        slotDiv.dataset.index = j.toString();
        
        // Add click listener to use/restore spell slots
        slotDiv.addEventListener("click", (e) => {
          const target = e.target as HTMLElement;
          const slotLevel = parseInt(target.dataset.level || "1");
          const slotIndex = parseInt(target.dataset.index || "0");
          
          if (slotDiv.classList.contains("available")) {
            // Use a spell slot
            data.currentSpellSlots[slotLevel - 1]--;
            slotDiv.classList.remove("available");
            slotDiv.classList.add("used");
          } else {
            // Restore a spell slot
            if (data.currentSpellSlots[slotLevel - 1] < maxSlots) {
              data.currentSpellSlots[slotLevel - 1]++;
              slotDiv.classList.remove("used");
              slotDiv.classList.add("available");
            }
          }
          
          // Update title
          titleDiv.textContent = `Level ${level} (${data.currentSpellSlots[slotLevel - 1]}/${maxSlots})`;
          
          // Save changes
          this.saveSettings();
        });
        
        slotsDiv.appendChild(slotDiv);
      }
      
      levelDiv.appendChild(slotsDiv);
      slotContainer.appendChild(levelDiv);
    }
    
    container.appendChild(slotContainer);
    
    // Add controls
    const controls = document.createElement("div");
    controls.className = "wizard-controls";
    
    const resetButton = document.createElement("button");
    resetButton.className = "wizard-button";
    resetButton.textContent = "Long Rest (Reset All)";
    resetButton.addEventListener("click", () => {
      this.resetSpellSlots();
      element.empty();
      this.renderSpellTracker(element);
    });
    
    const arcaneRecoveryButton = document.createElement("button");
    arcaneRecoveryButton.className = "wizard-button";
    arcaneRecoveryButton.textContent = "Arcane Recovery";
    arcaneRecoveryButton.disabled = data.arcaneRecoveryUsed;
    arcaneRecoveryButton.addEventListener("click", () => {
      this.useArcaneRecovery();
      element.empty();
      this.renderSpellTracker(element);
    });
    
    controls.appendChild(resetButton);
    controls.appendChild(arcaneRecoveryButton);
    container.appendChild(controls);
    
    // Add level change listener
    levelSelect.addEventListener("change", (e) => {
      const target = e.target as HTMLSelectElement;
      const newLevel = parseInt(target.value);
      data.levelUp(newLevel);
      this.saveSettings();
      element.empty();
      this.renderSpellTracker(element);
    });
    
    element.empty();
    element.appendChild(container);
  }

  resetSpellSlots(): void {
    this.settings.wizardData.resetSpellSlots();
    this.saveSettings();
  }

  useArcaneRecovery(): void {
    const result = this.settings.wizardData.arcaneRecovery();
    if (result) {
      // In a real implementation, we would open a modal to let the user
      // choose which spell slots to recover up to half their wizard level (rounded up)
      // For now, we'll simulate by recovering the lowest level slots first
      const wizard = this.settings.wizardData;
      const maxRecovery = Math.ceil(wizard.level / 2);
      let recovered = 0;
      
      for (let i = 0; i < wizard.currentSpellSlots.length && recovered < maxRecovery; i++) {
        const maxSlots = WIZARD_LEVELS[wizard.level].slots[i];
        const current = wizard.currentSpellSlots[i];
        const canRecover = maxSlots - current;
        
        if (canRecover > 0) {
          const willRecover = Math.min(canRecover, maxRecovery - recovered);
          wizard.currentSpellSlots[i] += willRecover;
          recovered += willRecover;
        }
      }
      
      this.saveSettings();
    }
  }

  onunload(): void {
    this.saveSettings();
  }
}

class WizardSpellTrackerSettingTab extends PluginSettingTab {
  plugin: WizardSpellTrackerPlugin;

  constructor(app: App, plugin: WizardSpellTrackerPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
     // Add folder settings for each spell level
     const spellLevels = [
       ["cantrip", "Cantrips"],
       ["level1", "Level 1 Spells"],
       ["level2", "Level 2 Spells"],
       ["level3", "Level 3 Spells"],
       ["level4", "Level 4 Spells"],
       ["level5", "Level 5 Spells"],
       ["level6", "Level 6 Spells"],
       ["level7", "Level 7 Spells"],
       ["level8", "Level 8 Spells"],
       ["level9", "Level 9 Spells"]
     ];
     
     containerEl.createEl("h3", { text: "Spell Folders" });
     
     for (const [key, label] of spellLevels) {
       new Setting(containerEl)
         .setName(label)
         .setDesc(`Select folder containing ${label.toLowerCase()}`)
         .addDropdown(dropdown => {
           // Add empty option
           dropdown.addOption("", "-- Select Folder --");
           
           // Get all folders in the vault
           const folders = this.getFolders("");
           folders.forEach(folder => {
             dropdown.addOption(folder, folder);
           });
           
           return dropdown
             .setValue(this.plugin.settings.spellFolders[key] || "")
             .onChange(async (value) => {
               this.plugin.settings.spellFolders[key] = value;
               await this.plugin.saveSettings();
             });
         });
     }
     getFolders(path: string): string[] {
      const folders: string[] = [];
      const root = this.app.vault.getAbstractFileByPath(path);
      
      const addFolders = (folder: any, prefix: string = "") => {
        if (!folder || !(folder instanceof TFolder)) return;
        
        const folderPath = prefix ? `${prefix}/${folder.name}` : folder.name;
        folders.push(folderPath);
        
        if (folder.children) {
          for (const child of folder.children) {
            if (folder instanceof TFolder) {
              addFolders(child, folderPath);
            }
          }
        }
      };
      
      if (path === "") {
        // Get all top-level folders
        const rootFolders = this.app.vault.adapter.list("")
          .then(result => result.folders)
          .catch(e => []);
        
        for (const folderPath of this.app.vault.getAllLoadedFiles()
        .filter(f => f instanceof TFolder && f.parent?.path === "/")) {
        addFolders(folderPath);
      }
      } else {
        addFolders(root);
      }
      
      return folders;
    }
    
    // Reset settings
    containerEl.empty();
    
    containerEl.createEl("h2", { text: "Wizard Spell Tracker Settings" });
    
    new Setting(containerEl)
      .setName("Wizard Name")
      .setDesc("Set your wizard character's name")
      .addText(text => text
        .setPlaceholder("My Wizard")
        .setValue(this.plugin.settings.wizardData.name)
        .onChange(async (value) => {
          this.plugin.settings.wizardData.name = value;
          await this.plugin.saveSettings();
        }));
        
    new Setting(containerEl)
      .setName("Auto Reset")
      .setDesc("When to automatically reset spell slots")
      .addDropdown(dropdown => dropdown
        .addOption("long-rest", "After Long Rest")
        .addOption("daily", "Daily")
        .addOption("manual", "Manual Only")
        .setValue(this.plugin.settings.autoReset)
        .onChange(async (value) => {
          this.plugin.settings.autoReset = value;
          await this.plugin.saveSettings();
        }));
    
    new Setting(containerEl)
      .setName("Arcane Tradition")
      .setDesc("Your wizard's arcane tradition (subclass)")
      .addDropdown(dropdown => dropdown
        .addOption("School of Abjuration", "School of Abjuration")
        .addOption("School of Conjuration", "School of Conjuration")
        .addOption("School of Divination", "School of Divination")
        .addOption("School of Enchantment", "School of Enchantment")
        .addOption("School of Evocation", "School of Evocation")
        .addOption("School of Illusion", "School of Illusion")
        .addOption("School of Necromancy", "School of Necromancy")
        .addOption("School of Transmutation", "School of Transmutation")
        .addOption("Bladesinging", "Bladesinging")
        .addOption("Order of Scribes", "Order of Scribes")
        .addOption("Chronurgy", "Chronurgy")
        .addOption("Graviturgy", "Graviturgy")
        .addOption("War Magic", "War Magic")
        .setValue(this.plugin.settings.wizardData.arcaneSubclass)
        .onChange(async (value) => {
          this.plugin.settings.wizardData.arcaneSubclass = value;
          await this.plugin.saveSettings();
        }));
        
    new Setting(containerEl)
      .setName("Reset All Data")
      .setDesc("Reset all wizard data to defaults")
      .addButton(button => button
        .setButtonText("Reset")
        .onClick(async () => {
          this.plugin.settings.wizardData = new WizardCharacterData();
          await this.plugin.saveSettings();
          this.display();
        }));
  }
}