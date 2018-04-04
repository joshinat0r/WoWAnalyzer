import React from 'react';
import PropTypes from 'prop-types';

import Expandable from 'Main/Expandable';

import ChevronIcon from 'Icons/Chevron';
import InformationIcon from 'Icons/Information';

import AVAILABLE_CONFIGS from 'Parser/AVAILABLE_CONFIGS';
import DIFFICULTIES from 'common/DIFFICULTIES';

import bosses from 'common/bosses';
import SPECS from 'common/SPECS';

class EncounterTips extends React.PureComponent {

  static propTypes = {
    currentBoss: PropTypes.number.isRequired,
    spec: PropTypes.number.isRequired,
    difficulty: PropTypes.number.isRequired,
  };

  availableTips = [];
  tipsDesc = "";

  filterItems() {
    this.availableTips = AVAILABLE_CONFIGS.filter((elem, index) => {
      return elem.spec.id === this.props.spec;
    })[0];

    if(!this.availableTips) {
      return;
    }
    
    this.availableTips = this.availableTips.tips.filter((elem, index) => {
      return elem.encounterID === this.props.currentBoss;
    })[0];

    if(!this.availableTips) {
      return;
    }

    this.availableTips = this.availableTips.tips.filter((elem, index) => {
      return elem.difficulty.includes(DIFFICULTIES[this.props.difficulty]);
    });

    this.tipsDesc = AVAILABLE_CONFIGS.filter((elem, index) => {
      return elem.spec.id === this.props.spec;
    })[0].tipsDesc;

    // console.info(this.availableTips);
  }

  tipRow(elem) {
    return (
      <div style={{ marginBottom: 10 }}>
        {elem.desc} <br/>
        <span class="text-muted">
          Difficulties:
          {elem.difficulty.map((diff, index) => {
            const append = index + 1 !== elem.difficulty.length ? '/' : '';
            return (
              <span>
                <span style={{ margin: '0 5px' }}>{diff}</span>{append}
              </span>
            );
          })}
        </span>
      </div>
    );
  }

  render() {

    this.filterItems();

    if (!this.availableTips) {
      return <div />;
    }

    const spec = SPECS[this.props.spec].specName + " " + SPECS[this.props.spec].className;

    let bossName = "";
    Object.keys(bosses).forEach((key) => {
      Object.keys(bosses[key]).forEach((boss) => {
        if (bosses[key][boss] === this.props.currentBoss) {
          bossName = boss.replace(/_/g, " ");
        }
      });
    });

    const githubLink = `https://github.com/WoWAnalyzer/WoWAnalyzer/issues/new?title=[${ encodeURI(spec) }][Tip] ${ encodeURI(bossName) }`;

    return (
      <Expandable
        header={(
          <div className="flex" style={{ fontSize: '1.4em' }}>
            <div className="flex-sub content-middle" style={{ paddingRight: 22 }}>
              <div>{/* this div ensures vertical alignment */}
                <InformationIcon />
              </div>
            </div>
            <div className="flex-main">
              Encounter specific tips
            </div>
            <div className="flex-sub content-middle" style={{ width: 100 }}></div>
            <div className="flex-sub content-middle" style={{ paddingLeft: 22 }}>
              <div className="chevron">{/* this div ensures vertical alignment */}
                <ChevronIcon />
              </div>
            </div>
          </div>
        )}
      >
        <div className="row" style={{ marginBottom: 10 }}>
          <div className="col-md-12 text-muted">
            <div className="flex">
              <div className="flex-main">
                The goal of those suggestions is to point out spells/items that might help you and your raid with specific mechanics or to increase the damage output.<br/>
                <a href={githubLink} target="_blank" rel="noopener noreferrer">Create an issue on GitHub</a> {this.tipsDesc} if you have any additional tips for this fight.
              </div>
            </div>
          </div>
        </div>
        <div className="row" style={{ marginTop: 20 }}>
          <div className="col-md-12">
            <div className="flex">
              <div className="flex-main">
                {this.availableTips.map((elem) => {
                  return this.tipRow(elem);
                })}
              </div>
            </div>
          </div>
        </div>
      </Expandable>
    );
  }
}

export default EncounterTips;
