import React from 'react';

import Wrapper from 'common/Wrapper';
import ItemLink from 'common/ItemLink';
import ITEMS from 'common/ITEMS';
import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';

export default [
  {
    encounterID: 2082,
    tips: [
      {
        difficulty: [4, 5],
        desc: <Wrapper>Use <SpellLink id={SPELLS.ANTI_MAGIC_SHELL.id} icon/> to cheese stuff.</Wrapper>,
      },
      {
        difficulty: [4],
        desc: <Wrapper>Use <ItemLink id={ITEMS.SMOLDERING_TITANGUARD.id} icon/> to mitigate burst of ability x.</Wrapper>,
      },
    ],
  },
];