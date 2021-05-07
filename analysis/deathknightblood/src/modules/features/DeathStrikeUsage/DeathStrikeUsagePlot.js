import React from 'react';
import PropTypes from 'prop-types';

class DeathStrikeUsagePlot extends React.PureComponent {

  static propTypes = {
    dsData: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="ds-plot" style={{
        position: 'relative',
        width: '100%',
        height: '60rem',
        border: '1px solid white'
      }}>
        <div style={{
          position: 'absolute',
          left: 0,
          right: '33%',
          top: 0,
          bottom: '50%',
          backgroundColor: 'rgba(255, 0, 0, .1)'
        }} />
        {this.props.dsData.map((point, index) => (
          <div key={index} style={{
            position: 'absolute',
            bottom: `calc(${point.hp * 100}% - 10px)`,
            left: `${point.rp / 1.5}%`,
            opacity: point.ignore || point.cap ? 0.5 : 1,
            height: 10,
            width: 10,
            borderRadius: '50%',
            backgroundColor: 'white'
          }}></div>
        ))}
      </div>
    );
  }
}

export default DeathStrikeUsagePlot;
