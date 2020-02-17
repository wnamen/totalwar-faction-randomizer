const totalwar_factions = require('./factions.json')
const totalwar_meta = require('./meta.json')

class Randomizer {
  constructor(meta, factions) {
    const availableFactions = factions.filter((faction) => (faction.free || faction.dlc.includes("Grand Campaign")))

    this.availableCampaigns = [...meta.availableCampaigns];
    this.availableDLCs = [...meta.availableCampaigns, ...meta.availablePacks];
    this.availableFactions = availableFactions;
    this.campaigns = [...meta.availableCampaigns];
    this.factions = [...factions];
    this.includeCavOnly = true;
    this.includeSuper = true;
    this.maxPlayers = 8;
    this.numberOfPlayers = 2;
    this.packs = [...meta.availablePacks];
    this.selectedCampaign = "Grand Campaign";
    this.selectedDLCs = ["Rise of the Republic", "Empire Divided", "Wrath of Sparta", "Hannibal at the Gates", "Ceasar in Gaul", "Imperator Augustus", "Greek States", "Nomadic Tribes", "Pirates and Raiders", "Black Sea Colonies"]
    this.selectedFactions = [];
    this.unique = true;
  }

  async getCampaigns(campaign) {
    const campaigns = this.campaigns;
    const availableCampaigns = this.availableCampaigns

    if (!campaigns.includes(campaign)) {
      return availableCampaigns;
    }

    if (availableCampaigns.includes(campaign)) {
      return availableCampaigns.filter((c) => c !== campaign)
    }

    return [...availableCampaigns, campaign];
  }

  async getCampaignFactions(campaign) {
    const selectedDLCs = this.selectedDLCs;

    return this.factions.filter((faction) => {
      switch (campaign) {
        case "Grand Campaign": {
          if (faction.free || (faction.dlc.includes("Grand Campaign") && faction.dlc.some(f => selectedDLCs.includes(f)))) {
            return faction;
          }
          break;
        }

        case "Ceasar in Gaul": {
          const bannedFactions = ["Boii", "Galatia"]
          if (faction.dlc.includes("Ceasar in Gaul") && faction.dlc.some(f => selectedDLCs.includes(f)) && !bannedFactions.includes(faction.name)) {
            return faction;
          }
          break;
        }

        default: {
          if (faction.dlc.includes(campaign) && faction.dlc.some(f => selectedDLCs.includes(f))) {
            return faction
          }
        }
      }
    })
  }

  async getFactions() {
    this.selectedFactions = [];
    this.availableFactions = await this.getCampaignFactions(this.selectedCampaign);

    for (let i = 0; i < this.numberOfPlayers; i++) {
      await this.selectRandomFaction();
    }

    return this.selectedFactions;
  }

  getRandomInt() {
    const min = Math.ceil(0);
    const max = Math.floor(this.availableFactions.length - 1);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getSelected() {
    return this.selectedFactions;
  }

  resetRandomizer() {
    const availableFactions = this.factions.filter((faction) => (faction.free || faction.dlc.includes("Grand Campaign")))

    this.availableFactions = availableFactions;
    this.includeCavOnly = true;
    this.includeSuper = true;
    this.maxPlayers = 8;
    this.numberOfPlayers = 2;
    this.selectedCampaign = "Grand Campaign";
    this.selectedDLCs = ["Rise of the Republic", "Empire Divided", "Wrath of Sparta", "Hannibal at the Gates", "Ceasar in Gaul", "Imperator Augustus", "Greek States", "Nomadic Tribes", "Pirates and Raiders", "Black Sea Colonies"]
    this.selectedFactions = [];
    this.unique = true;
  }

  selectRandomFaction() {
    const rand = this.getRandomInt()
    const selected = this.availableFactions[rand]

    this.selectedFactions.push(selected)

    if (this.unique) {
      let availableFactions = this.availableFactions;
      availableFactions.splice(rand, 1)
      this.availableFactions = availableFactions;
    }

    return selected
  }

  async setCampaign(campaign) {
    this.selectedCampaign = campaign;
    this.availableFactions = await this.getCampaignFactions(campaign);

    const checkbox = document.getElementById("unique");

    if (this.unique && this.numberOfPlayers > this.availableFactions.length) {
      this.unique = false;
      checkbox.checked = false;
      checkbox.disabled = true;
    } else if (checkbox.disabled && this.numberOfPlayers <= this.availableFactions.length) {
      checkbox.disabled = false;
    }
  }

  async setDLC(dlc) {
    let selectedDLCs = this.selectedDLCs;

    if (this.selectedDLCs.includes(dlc)) {
      selectedDLCs.splice(selectedDLCs.indexOf(dlc), 1);
      this.selectedDLCs = selectedDLCs;

      if (this.selectedCampaign === dlc) {
        this.selectedCampaign = "Grand Campaign";
        document.getElementById("campaign").selectedIndex = 0;
      }
    } else {
      selectedDLCs.push(dlc)
      this.selectedDLCs = selectedDLCs;
    }

    this.availableFactions = await this.getCampaignFactions(this.selectedCampaign)
    this.availableCampaigns = await this.getCampaigns(dlc)

    return this.selectedDLCs;
  }

  setIncludeCavOnly(includeCavOnly) {
    this.includeCavOnly = includeCavOnly;
  }

  setIncludeSuper(includeSuper) {
    this.includeSuper = includeSuper;
  }

  setNumberOfPlayers(players) {
    this.numberOfPlayers = players;

    const checkbox = document.getElementById("unique");

    if (this.unique && this.numberOfPlayers > this.availableFactions.length) {
      this.unique = false;
      checkbox.checked = false;
      checkbox.disabled = true;
    } else if (checkbox.disabled && this.numberOfPlayers <= this.availableFactions.length) {
      checkbox.disabled = false;
    }
  }

  setUnique(unique) {
    this.unique = unique;
  }
}

const randomizer = new Randomizer(totalwar_meta.rome_2, totalwar_factions.rome_2);
export default randomizer;