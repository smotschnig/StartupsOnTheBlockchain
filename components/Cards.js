import React from 'react'
import { Card } from 'semantic-ui-react'

const items = [
  {
    href: '#card-example-link-card',
    header: 'Project Report - April',
    description: 'Leverage agile frameworks to provide a robust synopsis for high level overviews.',
    meta: 'ROI: 30%'
  },
  {
    href: '#card-example-link-card',
    header: 'Project Report - May',
    description: 'Bring to the table win-win survival strategies to ensure proactive domination.',
    meta: 'ROI: 34%',
  },
  {
    href: '#card-example-link-card',
    header: 'Project Report - June',
    description: 'Capitalise on low hanging fruit to identify a ballpark value added activity to beta test.',
    meta: 'ROI: 27%',
  },
]

const Cards = () => (
  <Card.Group itemsPerRow={1} items={items} />
)

export default Cards;