import React from 'react';
import Analyzer from 'Parser/Core/Analyzer';
import Combatants from 'Parser/Core/Modules/Combatants';

import AVAILABLE_CONFIGS from 'Parser/AVAILABLE_CONFIGS';

class EncounterTips extends Analyzer {
  static dependencies = {
    combatants: Combatants,
  };

  bossID = this.owner.fight.boss;
  bossDifficulty = this.owner.fight.difficulty;
  specID = 0;
  availableTips = [];

  on_initialized() {
    this.specID = this.combatants.selected.specId;

    this.availableTips = AVAILABLE_CONFIGS.filter((elem, index) => {
      return elem.spec.id === this.specID;
    })[0].tips.filter((elem, index) => {
      return elem.encounterID === this.bossID;
    })[0].tips.filter((elem, index) => {
      return elem.difficulty.includes(this.bossDifficulty);
    });

    console.info(this.availableTips);
  }

  render() {
    return (
      <div>
        Tips
      </div>
    );
  }
}

export default EncounterTips;
