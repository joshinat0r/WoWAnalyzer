import React from 'react';
import PropTypes from 'prop-types';

import fetchWcl from 'common/fetchWclApi';
import CombatLogParser from 'parser/core/CombatLogParser';

class ThroughputPerformance extends React.PureComponent {
  static propTypes = {
    children: PropTypes.func.isRequired,
    metric: PropTypes.string.isRequired,
    throughput: PropTypes.number.isRequired,
  };
  static contextTypes = {
    parser: PropTypes.instanceOf(CombatLogParser).isRequired,
  };

  constructor() {
    super();
    this.state = {
      performance: null,
    };
  }
  componentDidMount() {
    this.load();
  }

  async load() {
    const { rankings } = await this.loadRankings();
    const topRank = rankings[0];
    if (!topRank) {
      return;
    }
    const topThroughput = topRank.total;
    this.setState({
      performance: this.props.throughput / topThroughput,
    });
  }
  async loadRankings() {
    const parser = this.context.parser;

    // We want to stagger the requests so not all specs are refreshed at the same time.
    // We achieve this by adding a static amount of time to `now` based on the spec index (0-35).
    const specIndex = parser.selectedCombatant.spec.index;
    const secondsOffset = (7 * 86400 * specIndex / 35);
    // We mutate now so that if there's a year crossover it will properly go to week 1 instead of 53/54
    const now = new Date((new Date()).getTime() + (secondsOffset * 1000));
    // We need this to calculate the amount of weeks difference
    const onejan = new Date(now.getFullYear(), 0, 1);
    // This calculates the difference in weeks
    const currentWeek = Math.ceil((((now - onejan) / 86400 / 1000) + onejan.getDay() + 1) / 7); // current calendar-week

    return fetchWcl(`rankings/encounter/${parser.fight.boss}`, {
      class: parser.selectedCombatant.spec.ranking.class,
      spec: parser.selectedCombatant.spec.ranking.spec,
      difficulty: parser.fight.difficulty,
      metric: this.props.metric,
      cache: currentWeek, // cache for a week
    });
  }

  render() {
    const { children } = this.props;

    return children(this.state.performance);
  }
}

export default ThroughputPerformance;