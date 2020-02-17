import React from "react";
import "./App.css";

import randomizer from "./randomizer";

class App extends React.Component {
  state = {
    campaigns: randomizer.availableCampaigns,
    dlcs: randomizer.availableDLCs,
    factions: []
  };

  getFactions = async e => {
    e.preventDefault();

    const factions = await randomizer.getFactions();
    this.setState({
      factions
    });
  };

  reset = e => {
    e.preventDefault();

    randomizer.resetRandomizer();

    document.getElementById("randomizer-form").reset();
    document.getElementById("players").selectedIndex = 1;

    this.setState({
      campaigns: [...randomizer.availableCampaigns],
      dlcs: [...randomizer.availableDLCs],
      factions: []
    });
  };

  render = () => {
    const { campaigns, dlcs, factions } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <h1> Total War: Rome 2 Faction Randomizer </h1>
        </header>
        <div className="App-body">
          <form id="randomizer-form">
            <fieldset className="inline_block">
              <legend> Which DLCs do you have ? </legend>
              {dlcs.map((dlc, idx) => (
                <div key={idx}>
                  <input
                    type="checkbox"
                    defaultChecked
                    id={dlc}
                    onClick={this.setDLC}
                    name="dlc"
                  />
                  <label for={dlc}> {dlc} </label>
                </div>
              ))}
            </fieldset>
            <div className="inline_block">
              <fieldset>
                <legend> Choose a campaign </legend>
                <select
                  form="randomizer-form"
                  id="campaign"
                  name="campaign-select"
                  onChange={e => randomizer.setCampaign(e.target.value)}
                >
                  <option defaultValue value="Grand Campaign">
                    Grand Campaign
                  </option>
                  {campaigns.map((campaign, idx) => (
                    <option key={idx} value={campaign}>
                      {campaign}
                    </option>
                  ))}
                </select>
              </fieldset>
              <fieldset>
                <legend> How many players ? </legend>
                <select
                  form="randomizer-form"
                  id="players"
                  name="players-select"
                  onChange={e => randomizer.setNumberOfPlayers(e.target.value)}
                >
                  {[...Array(8)].map((_, idx) => (
                    <option key={idx} selected={idx + 1 === 2} value={idx + 1}>
                      {idx + 1}
                    </option>
                  ))}
                </select>
              </fieldset>
              <fieldset>
                <legend> Should each faction be unique ? </legend>
                <div>
                  <input
                    type="checkbox"
                    defaultChecked
                    id="unique"
                    onClick={this.setUnique}
                    name="unique"
                  />
                  <label for="unique"> Unique </label>
                </div>
              </fieldset>
              <div className="buttons">
                <button onClick={this.getFactions}> randomize! </button>
                <button onClick={this.reset}> reset </button>
              </div>
            </div>
          </form>
          <div className="results-container">
            {factions.map(({ name }, idx) => (
              <div className="result-container" key={idx}>
                <span className="result-faction"> {name} </span>
                <span className="result-player"> Player {idx + 1} </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  setDLC = async e => {
    await randomizer.setDLC(e.target.id);
    const campaigns = randomizer.availableCampaigns;

    this.setState(
      {
        campaigns
      },
      () => {
        const selectedCampaign = randomizer.selectedCampaign;
        const campaignSelect = document.getElementById("campaign");

        for (let i = 0; i < campaignSelect.options.length; i++) {
          const o = campaignSelect.options[i];

          if (o.value === selectedCampaign) {
            return (campaignSelect.selectedIndex = i);
          }
        }
      }
    );
  };

  setUnique = e => {
    randomizer.setUnique(!randomizer.unique);
  };
}

export default App;
