import React from 'react';
import { Card } from 'semantic-ui-react';

const items = [
  {
    href: '#card-example-link-card',
    header: 'Web-Entwickler (m/w)',
    description: 'Von mobilen Apps bis hin zur Robotersteuerung – wir konzipieren und realisieren Individual­softwarelösungen für unsere Kunden und stehen diesen kompetent und zuverlässig bei Softwareprojekten zur Seite. Entwickeln Sie mit uns spannende Projekte am Puls der Zeit.',
    meta: '01.06.2018',
    extra: 'Rating: ',
    image: '/static/img/star.png'
  },
  {
    href: '#card-example-link-card',
    header: 'Softwareentwickler für Anzeigetafeln (m/w) ',
    description: 'Entwicklung einer Applikations-Software (Schwerpunkt Digital Signage).',
    meta: '20.05.2018',
    extra: 'Rating: ',
    image: '/static/img/star.png'
  },
  {
    href: '#card-example-link-card',
    header: 'Java-Entwickler (m/w) ',
    description: 'Design und Realisierung von unterschiedlichen fachlichen und technischen Komponenten für Anwendungen in wechselnden Projekten.',
    meta: '18.05.2018',
    extra: 'Rating: ',
    image: '/static/img/star.png'
  },
]

const Cards = () => (
  <Card.Group itemsPerRow={1} items={items} />
)

export default Cards;