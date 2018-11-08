import React from 'react';
import Analyzer from 'parser/core/Analyzer';
import Tab from 'interface/others/Tab';
import SPELLS from 'common/SPELLS/index';
import { formatDuration } from 'common/format';

const PRECISION = 5000;
const TIME = 5;
const PHASE_LENGTH = 50; // 30sec phases + precision
const BUFFER = 2500;
const MAX_BUFFER = 5000;
const MAX_OVERHEAL = 0.30;

class DeathStrikeUsage extends Analyzer {

  damageTakenPerSecond = [];
  deathStrikeCast = [];

  on_toPlayer_damage(event) {
    const second = Math.floor((event.timestamp - this.owner.fight.start_time) / PRECISION);
    const prevDamage = this.damageTakenPerSecond[second] ? this.damageTakenPerSecond[second].amount : 0;

    this.damageTakenPerSecond[second] = {
      amount: prevDamage + event.amount,
      timestamp: event.timestamp,
      second: formatDuration(second * TIME),
    };
  }

  on_toPlayer_heal(event) {
    if (event.ability.guid === SPELLS.DEATH_STRIKE_HEAL.id && event.sourceID === event.targetID) {
      this.deathStrikeCast.push(event);
    }
  }

  get phases() {
    const phases = [];
    const sections = Math.ceil(this.owner.fightDuration / (PHASE_LENGTH / TIME * PRECISION));

    for (let index = 0; index < sections * PHASE_LENGTH / TIME; index += PHASE_LENGTH / TIME) {
      phases.push(this.damageTakenPerSecond.slice(index, index + PHASE_LENGTH / TIME));
    }

    return phases;
  }

  rms(set) {
    const sum = set.reduce((prev, curr) => {
      return prev + Math.pow(curr.amount, 2) / set.length;
    }, 0);
    return Math.sqrt(sum);
  }

  get mandatoryDeathStrikes() {
    const mandatoryDeathStrikes = [];

    // this.damageTakenPerSecond = Array.from({length: Math.ceil(this.owner.fightDuration / PRECISION)}, x => 1);
    for (let index = 0; index < Math.ceil(this.owner.fightDuration / PRECISION); index++) {
      if (!this.damageTakenPerSecond[index]) {
        this.damageTakenPerSecond[index] = {
          amount: 0,
        };
      }
    }
    
    const phases = this.phases;
    phases.forEach(phase => {
      const rms = this.rms(phase);
      let lastMandatoryDS = 0;
      
      phase.forEach(damage => {
        if (!damage.amount || damage.amount < rms) {
          return;
        } 

        if (lastMandatoryDS !== 0 && damage.timestamp - lastMandatoryDS < 5000) {
          mandatoryDeathStrikes.splice(-1,1);
        }

        lastMandatoryDS = damage.timestamp;
        mandatoryDeathStrikes.push(damage);
      });
    });

    mandatoryDeathStrikes.forEach((should, ind) => {
      this.deathStrikeCast.forEach(did => {
        const overhealing = did.overheal || 0;
        const overhealPercent = overhealing / (did.amount + overhealing);

        if (did.timestamp > should.timestamp && did.timestamp <= should.timestamp + BUFFER) {
          // DSs within 2.5sec
          mandatoryDeathStrikes[ind].passed = true;
          return;
        } else if (did.timestamp > should.timestamp && did.timestamp <= should.timestamp + MAX_BUFFER && overhealPercent <= MAX_OVERHEAL) {
          // DS within 5sec and with little overhealing
          mandatoryDeathStrikes[ind].passed = true;
          return;
        }
      });
    });

    return mandatoryDeathStrikes;
  }

  get missedDeathStrikes() {
    return this.mandatoryDeathStrikes.filter(e => !e.passed)
  }

  plot() {

    return (
      <div style={{ padding: 20 }}>
        Should've done {this.mandatoryDeathStrikes.length} Death Strikes for spikes<br />
        Did {this.missedDeathStrikes.length} Death Strikes within 2.5/5s for those suggested spikes<br />
        A total of {this.deathStrikeCast.length} Death Strikes<br />
      </div>
    );
  }

  tab() {
    return {
      title: 'DS',
      url: 'DS',
      render: () => (
        <Tab>
          {this.plot(this.selfHealSpell)}
        </Tab>
      ),
    };
  }
}

export default DeathStrikeUsage;