import React from 'react';

import Wrapper from 'common/Wrapper';
import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';
import ITEMS from 'common/ITEMS';
import ItemLink from 'common/ItemLink';
import DIFFICULTIES from 'common/DIFFICULTIES';

import bosses from 'common/bosses';

export default [
  {
    encounterID: bosses.AntorusTheBurningThrone.PORTAL_KEEPER_HASABEL,
    tips: [
      {
        difficulty: [DIFFICULTIES[1], DIFFICULTIES[3], DIFFICULTIES[4], DIFFICULTIES[5]],
        desc: <Wrapper>Position the adds with <SpellLink id={SPELLS.DEATH_GRIP.id} icon /> and <SpellLink id={SPELLS.GOREFIENDS_GRASP.id} icon /> to allow your DPS to cleave more efficiently.</Wrapper>,
      },
      {
        difficulty: [DIFFICULTIES[1], DIFFICULTIES[3], DIFFICULTIES[4], DIFFICULTIES[5]],
        desc: <Wrapper>Use <SpellLink id={SPELLS.ANTI_MAGIC_SHELL.id} icon /> to mitigate some of <SpellLink id={SPELLS.REALITY_TEAR.id} icon />'s explosion at the end (<SpellLink id={SPELLS.BURSTING_DARKNESS.id} icon />).</Wrapper>,
      },
      {
        difficulty: [DIFFICULTIES[1], DIFFICULTIES[3], DIFFICULTIES[4], DIFFICULTIES[5]],
        desc: <Wrapper>Use <SpellLink id={SPELLS.DEATH_GRIP.id} icon />, <SpellLink id={SPELLS.GOREFIENDS_GRASP.id} icon /> and <SpellLink id={SPELLS.ASPHYXIATE.id} icon /> on the adds to proc <ItemLink id={ITEMS.SEPHUZS_SECRET.id} icon /> if equipped.</Wrapper>,
      },
    ],
  },
];