import React from 'react';
import PropTypes from 'prop-types';

import ItemLink from 'common/ItemLink';

import fetchWcl from 'common/fetchWcl';


class TopTalentsDisplay extends React.PureComponent {
  static propTypes = {
    currentBoss: PropTypes.number.isRequired,
    specID: PropTypes.number.isRequired,
    difficulty: PropTypes.number.isRequired
  };

  LIMIT = 100;

  constructor() {
    super();
    this.state = {
      mostUsedTrinkets: [],
      mostUsedLegendaries: [],
      loaded: false,
    };
  }

  addItem(array, item) {
    const index = array.findIndex(elem => elem.id === item.id);
    if (index === -1) {
      array.push({
        id: item.id,
        name: item.name.replace(/\\'/g, '\''),
        quality: item.quality,
        amount: 1,
      })
    } else {
      array[index].amount += 1;
    }

    return array;
  }

  load() {

    console.log(this.props.specID);

    let specID = 0;
    let classID = 0;
    if (this.props.specID === 250) {
      specID = 1;
      classID = 1;
    }

    return fetchWcl(`rankings/encounter/${ this.props.currentBoss }`, {
      class: specID,
      spec: specID,
      difficulty: this.props.difficulty,
      limit: this.LIMIT,
    }).then((stats) => {
      console.info(stats);

      let talentCounter = [[], [], [], [], [], [], []];
      let trinketCounter = [];
      let legendaryCounter = [];
      stats.rankings.forEach((rank, rankIndex) => {
        rank.talents.forEach((talent, index) => {
          if (talent.id !== null && talent.id !== 0) { //when logged without advanced logging || no talent selected in that row (happens due to class rings)
            talentCounter[index].push(talent.id);
          }
        });

        rank.gear.forEach((item, itemSlot) => {
          if (item.quality === 'legendary') {
            legendaryCounter = this.addItem(legendaryCounter, item);
          }

          if (itemSlot === 12 || itemSlot === 13) {
            trinketCounter = this.addItem(trinketCounter, item);
          }
        });
      });

      talentCounter.forEach(row => {
        let talentRow = row.reduce(function(prev, cur) {
          prev[cur] = (prev[cur] || 0) + 1;
          return prev;
        }, {});

        //'talentRow' contains picked talents with amount of logs
      });

      console.info(trinketCounter);

      trinketCounter.sort(function(a,b) {return (a.amount < b.amount) ? 1 : ((b.amount < a.amount) ? -1 : 0);} );
      legendaryCounter.sort(function(a,b) {return (a.amount < b.amount) ? 1 : ((b.amount < a.amount) ? -1 : 0);} );

      this.setState({
        mostUsedTrinkets: trinketCounter.slice(0, 5),
        mostUsedLegendaries: legendaryCounter.slice(0, 5),
        loaded: true,
      });

      console.info(this.state.mostUsedLegendaries);
      console.info(this.state.mostUsedTrinkets);

    });
  }

  // This is a special module, we're giving it a custom position. Normally we'd use "statistic" instead.
  render() {

    if (this.state.loaded) {
      return (
        <div className="panel" style={{ border: 0, marginTop: 40 }}>
          <div className="panel-body flex-main">
            <div className="row">
              <div className="col-md-6">
                <div className="panel-heading" style={{ boxShadow: 'none', borderBottom: 0 }}>
                  <h2>Most used Legendaries</h2>
                </div>
                {this.state.mostUsedLegendaries.map((legendary) =>
                  <div key={legendary.id}>
                  <ItemLink id={legendary.id}>
                    {legendary.name} ({legendary.amount}x)
                  </ItemLink>
                </div>
                )}
              </div>
              <div className="col-md-6">
                <div className="panel-heading" style={{ boxShadow: 'none', borderBottom: 0 }}>
                  <h2>Most used Trinkets</h2>
                </div>
                {this.state.mostUsedTrinkets.map((trinket) =>
                  <div key={trinket.id}>
                    <ItemLink id={trinket.id}>
                      {trinket.name} ({trinket.amount}x)
                    </ItemLink>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="panel" style={{ border: 0, marginTop: 40 }}>
          <button onClick={this.load.bind(this)} className="btn btn-primary analyze" style={{ marginLeft: 'auto', marginRight: 'auto', width: '90%', display: 'block' }}>
            Show me what the Top {this.LIMIT} parses for this fight used
          </button>
        </div>
      );
    }
  }
}

export default TopTalentsDisplay;
