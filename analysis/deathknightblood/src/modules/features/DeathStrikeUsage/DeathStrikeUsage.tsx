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
  ignore: boolean;
  cap: boolean;
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
    const currentHp = beforeHealHp / (event.maxHitPoints || 0);
    const ignore = this.selectedCombatant.hasBuff(SPELLS.SWARMING_MIST.id, event.timestamp);
    const cap = resource.max - 20 <= resource.amount;

    this.deathStrikes.push({
      rp: resource.amount / 10,
      hp: currentHp,
      ignore,
      cap,
    });
  }

  get deathStrikeData() {
    return this.deathStrikes
  }

  tab() {
    return {
      title: 'DS Plot',
      url: 'DS Plot',
      render: () => <Panel style={{ padding: '15px 22px' }}>
        <h1>Death Strike Plot</h1>
        <DeathStrikeUsagePlot dsData={this.deathStrikeData} />
      </Panel>,
    };
  }
}

export default DeathStrikeUsage;