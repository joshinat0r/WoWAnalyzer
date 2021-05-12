import React from 'react';
import PropTypes from 'prop-types';

import './main.css'

class DeathStrikeUsagePlot extends React.PureComponent {

  static propTypes = {
    dsData: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      goodSet: false,
      badSet: false
    }
  }
  

  render() {
    function randomMinMax(min, max) {
      return Math.random() * (max - min) + min;
    }

    const goodSet = this.props.dsData.map(() => {
      const baddy = randomMinMax(0, 2)
      let hp = randomMinMax(0, 100)
      let rp = randomMinMax(hp > 60 ? 80 : 40, 125)

      if (baddy <= 0.3) {
        hp = randomMinMax(50, 100)
        rp = randomMinMax(40, 125)
      }

      const score = rp >= 80 || hp <= 45 ? 0 : hp / rp
      return {
        hp,
        rp,
        heal: 0,
        score
      }
    })

    const badSet = this.props.dsData.map(() => {
      const goodie = randomMinMax(0, 2)
      let hp = randomMinMax(60, 100)
      let rp = randomMinMax(40, 85)

      if (goodie <= 0.4) {
        hp = randomMinMax(0, 100)
        rp = randomMinMax(hp > 60 ? 80 : 40, 125)
      }

      const score = rp >= 80 || hp <= 45 ? 0 : hp / rp
      return {
        hp,
        rp,
        heal: 0,
        score
      }
    })
    
    return (
      <>
        <div className="ds-plot">
          <div className="ds-bad-batch" />
          <div className="ds-good-batch" />
          <div className="ds-dump-batch" />
          <div className="ds-plot-axis-y">
            <div style={{top: 0}}><b>HP</b> 100%</div>
            <div style={{top: '25%'}}>75%</div>
            <div style={{top: '50%'}}>50%</div>
            <div style={{top: '75%'}}>25%</div>
            <div style={{top: '100%'}}>0%</div>
          </div>
          <div className="ds-plot-axis-x">
            <div style={{left: 0}}>0RP</div>
            <div style={{left: '33.3%'}}>50RP</div>
            <div style={{left: '66.6%'}}>100RP</div>
            <div style={{left: '100%'}}>150RP</div>
          </div>
          <div className="ds-grid">
            <div /><div /><div /><div /><div /><div /><div /><div /><div /><div /><div /><div />
          </div>
          {this.props.dsData.map((el, index) => {
            let point = this.props.dsData[index]
            if (this.state.goodSet) {
              point = goodSet[index]
            } else if (this.state.badSet) {
              point = badSet[index]
            }
            
            return (
              <>
                <div
                  key={index}
                  className={`ds-point ${point.ignore ? 'ds-point-ignore' : ''} ${point.cap ? 'ds-point-cap' : ''} ${point.bad ? 'ds-point-bad' : ''}`}
                  style={{
                    bottom: `calc(${point.hp}% - 10px)`,
                    left: `${(point.rp) / 1.5}%`,
                    backgroundColor: `hsl(0, 100%, ${100 - (point.score * 100 / 5)}%)`
                  }}
                  title={`${point.time}: ${point.hp.toFixed(1)}% HP / ${point.rp} RP`}
                ></div>
                <div 
                  key={index} 
                  className="ds-heal-bar"
                  style={{
                    height: `${point.heal}%`,
                    bottom: `calc(${point.hp}% - 10px)`,
                    left: `${point.rp / 1.5}%`,
                  }}
                  title={`${point.heal.toFixed(1)}% healed`}
                />
              </>
            )
          })}
        </div>
        <div className="ds-plot-help">
          <h2>What?</h2>
          <small>
            Hover over one of the buttons to see an example with good and bad Death Strikes.<br />
            It's not an issue if you sometimes cast Death Strikes while at low RP and high HP, but the overall distribution should tend towards high PR and lower HP.<br />
            There are caveats to this, like when you are outgearing content significantly or when you're not actively tanking or when you know that there won't be any threatening damage in the next few seconds.<br />
            But overall it's a good idea not to waste Death Strikes when you're already low on RP.
          </small>
          <div className="buttons">
            <div
              className="btn btn-primary"
              onMouseEnter={() => this.setState({ goodSet: true, badSet: false })}
              onMouseLeave={() => this.setState({ goodSet: false, badSet: false })}>
              Good Example
            </div>
            <div
              className="btn btn-primary"
              onMouseEnter={() => this.setState({ goodSet: false, badSet: true })}
              onMouseLeave={() => this.setState({ goodSet: false, badSet: false })}>
              Bad Example
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default DeathStrikeUsagePlot;
