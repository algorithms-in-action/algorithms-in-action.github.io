import React from 'react';
import '../../styles/About.scss';

import Professor from './Professor';
import { professors } from '../../resources/About';

function Section() {
  return (
    <div className="section">
      <div className="title">
        Featuring
      </div>
      <div className="extraTitle">Stepwise Refinement</div>
      <div className="subtitle">a pioneering pedagogy techonology by</div>
      <div className="professors">
        {
        professors.map(({
          name, desc, department, link, img, id,
        }) => (
          <Professor
            name={name}
            desc={desc}
            department={department}
            link={link}
            img={img}
            id={id}
            key={id}
          />
        ))
      }
      </div>


    </div>
  );
}

export default Section;
