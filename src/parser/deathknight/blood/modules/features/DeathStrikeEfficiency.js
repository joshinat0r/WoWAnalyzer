import React from 'react';
import Analyzer from 'parser/core/Analyzer';

import SPELLS from 'common/SPELLS';
import SpellIcon from 'common/SpellIcon';
import SpellLink from 'common/SpellLink';
import { formatPercentage } from 'common/format';

import AbilityTracker from 'parser/shared/modules/AbilityTracker';
import StatisticBox, { STATISTIC_ORDER } from 'interface/others/StatisticBox';
import SpellUsable from 'parser/shared/modules/SpellUsable';
import RESOURCE_TYPES from 'game/RESOURCE_TYPES';

const MAX_DEATH_STRIKE_OVERHEAL = 30; // % overheal on DS
const DS_DUMPING = 25; // next MR cast would cap RP + some slack
const fillerSpells = [
  SPELLS.HEART_STRIKE,
  SPELLS.BLOOD_BOIL,
  SPELLS.BLOODDRINKER_TALENT,
];

/*
  Module that checks if a Deathstrike was cast unnecessary
  - check overhealing
  - check if this DS was for RP dumping
  - check if other filler spells were available
*/

class DeathStrikeEfficiency extends Analyzer {
  static dependencies = {
    abilityTracker: AbilityTracker,
    spellUsable: SpellUsable,
  };

  badDeathStrikeCasts = [];
  totalDeathStrikeCasts = 0;

  on_toPlayer_heal(event) {
    const spellId = event.ability.guid;
    if (spellId !== SPELLS.DEATH_STRIKE_HEAL.id) {
      return;
    }

    // check if this DS healed enough
    this.totalDeathStrikeCasts += 1;
    const infoText = [];
    const healed = event.amount + (event.absorb || 0);
    const overheal = event.overheal || 0;
    const wasted = overheal / (healed + overheal) * 100;

    if (wasted <= MAX_DEATH_STRIKE_OVERHEAL) {
      return;
    }

    infoText.push(`This cast overhealed for ${wasted.toFixed(0)}%`);
    const runePower = event.classResources?.find(resource => resource.type === RESOURCE_TYPES.RUNIC_POWER.id);
    if (!runePower) {
      return;
    }

    // check if this DS was for RP dumping
    if (runePower.max - (DS_DUMPING * 10) <= runePower.amount) {
      return;
    }

    infoText[0] += ` and wasn't for RP dumping (casted at ${runePower.amount / 10} RP).`;

    const fillersAvailable = fillerSpells
      .filter(filler => this.spellUsable.isAvailable(filler.id))
      .map(filler => filler.name);

    if (fillersAvailable.length === 0) {
      return;
    }

    infoText.push(`You had ${fillersAvailable.join(', ')} available, use them before dumping RP`);

    this.badDeathStrikeCasts.push({
      ...event,
      info: infoText,
    });
  }

  // ToDo: check damage events
  // make "badDeathStrikeCasts" "potentiallyBadDeathStrikeCasts"
  // if health drops within ca. 8secs after potentially bad casts make them real "badDeathStrikeCasts"

  get getBadDeathStrikeCasts() {
    return this.badDeathStrikeCasts;
  }

  get suggestionThresholds() {
    return {
      actual: this.badDeathStrikeCasts.length / this.totalDeathStrikeCasts,
      isGreaterThan: {
        minor: 0.05,
        average: 0.15,
        major: 0.3,
      },
      style: 'percentage',
    };
  }

  suggestions(when) {
    when(this.suggestionThresholds).addSuggestion((suggest, actual, recommended) => {
      return suggest(<>
        Try to cast <SpellLink id={SPELLS.DEATH_STRIKE.id} /> only when you need the healing or need to dump Runic Power. 
        &nbsp;Use fillers such as {fillerSpells.map(filler => <SpellLink id={filler.id} />)} before using unnecessary DS.<br />
        Bank <SpellLink id={SPELLS.DEATH_STRIKE.id} /> to react quickly to incoming damage and to reduce strain on your healers.
      </>)
        .icon(SPELLS.DEATH_STRIKE.icon)
        .actual(`${formatPercentage(actual)}% misused Deathstrikes`)
        .recommended(`<${formatPercentage(recommended)}% is recommended`);
    });
  }

  statistic() {
    const fillernames = fillerSpells.map(filler => filler.name).join(', ');
    return (
      <StatisticBox
        icon={<SpellIcon id={SPELLS.DEATH_STRIKE.id} />}
        value={`${this.badDeathStrikeCasts.length}`}
        label="misused Deathstrikes"
        tooltip={(
          <>
            You'll want to bank as much {SPELLS.DEATH_STRIKE.name}s as possible without capping runic power.<br />
            Banking {SPELLS.DEATH_STRIKE.name}s to heal yourself quickly out of dangerous spikes will reduce strain on the healers.<br />
            Use fillers such as {fillernames} before dumping RP with {SPELLS.DEATH_STRIKE.name}<br />
            You can find a detailed breakdown of your {SPELLS.DEATH_STRIKE.name} casts in the 'Death Strike Timing' tab.
          </>
        )}
      />
    );
  }
  statisticOrder = STATISTIC_ORDER.CORE(6);
}

export default DeathStrikeEfficiency;
