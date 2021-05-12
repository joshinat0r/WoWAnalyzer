import React from 'react';
import { Panel } from 'interface';
import SPELLS from 'common/SPELLS';
import RESOURCE_TYPES from 'game/RESOURCE_TYPES';
import Analyzer, { Options } from 'parser/core/Analyzer';
import Events, { HealEvent } from 'parser/core/Events';

import DeathStrikeUsagePlot from './DeathStrikeUsagePlot'

interface DeathStrikePoint {
  rp: number;
  hp: number;
  heal: number;
  bad: boolean;
  ignore: boolean;
  cap: boolean;
  score: number;
  time: string;
}

class DeathStrikeUsage extends Analyzer {
  deathStrikes: DeathStrikePoint[] = [];

  constructor(options: Options) {
    super(options);

    this.addEventListener(Events.heal.spell(SPELLS.DEATH_STRIKE_HEAL), this._heal);
  }

  _heal(event: HealEvent) {
    // DRW heals
    if (event.sourceID !== this.selectedCombatant.id) {
      return;
    }

    const resource = event.classResources?.find(
      (resource) => resource.type === RESOURCE_TYPES.RUNIC_POWER.id,
    );
    if (!resource) {
      return;
    }

    const beforeHealHp = (event.hitPoints || 0) - (event.amount || 0);
    const currentHp = beforeHealHp / (event.maxHitPoints || 0) * 100;
    const ignore = this.selectedCombatant.hasBuff(SPELLS.SWARMING_MIST.id, event.timestamp);
    const cap = resource.max - 20 <= resource.amount;
    const rp = resource.amount / 10;
    const heal = (event.amount || 0) / (event.maxHitPoints || 0) * 100;
    const score = rp >= 80 || currentHp <= 45 ? 0 : currentHp / rp

    this.deathStrikes.push({
      time: `${this.owner.formatTimestamp(event.timestamp)}`,
      hp: currentHp,
      rp,
      heal,
      bad: rp <= 80 && currentHp >= 60,
      ignore,
      cap,
      score
    });
  }

  get deathStrikeData() {
    return this.deathStrikes
  }

  tab() {
    return {
      title: 'DS Plot',
      url: 'ds-plot',
      render: () => <Panel
        style={{ padding: '15px 22px' }}
        title="Death Strike Plot"
        explanation={
          <>
            This plot shows you your Death Strike casts based on your HP and RP.
            <br />
            Ideally you'd try to avoid Death Strikes while you're at low RP and high HP, instead you should save the RP for when you need the DS.<br />
            Transparent dots indicate casts where you are likely not RP limited (eg. during Swarming Mist); Red dots indicate how "bad" a DS was<br />
            Red section = unnecessary DS; yellow = RP dumping; green = good DS
          </>
        }
      >
        <DeathStrikeUsagePlot dsData={this.deathStrikeData} />
      </Panel>,
    };
  }
}

export default DeathStrikeUsage;