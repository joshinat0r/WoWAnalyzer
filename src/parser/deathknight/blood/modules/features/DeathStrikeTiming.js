import React from 'react';

import SelfHealTimingGraph from 'parser/shared/modules/features/SelfHealTimingGraph';
import SPELLS from 'common/SPELLS';
import DeathStrikeEfficiency from './DeathStrikeEfficiency';

class DeathStrikeTiming extends SelfHealTimingGraph {

  static dependencies = {
    deathStrikeEfficiency: DeathStrikeEfficiency,
  };

  constructor(...args) {
    super(...args);
    this.selfHealSpell = SPELLS.DEATH_STRIKE_HEAL;
    this.badSelfHeals = this.deathStrikeEfficiency.getBadDeathStrikeCasts;
    this.tabTitle = "Death Strike Timing";
    this.tabURL = "death-strike-timings";
  }

  render() {
    return (
      <SelfHealTimingGraph />
    );
  } 
}

export default DeathStrikeTiming;
