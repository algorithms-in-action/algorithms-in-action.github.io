import React from 'react';
import '../../styles/About.scss';
import Harald from '../../assets/Prof_Sondergaard.jpg';
import Linda from '../../assets/Dr_Stern.jpg';
import Professor from './Professor';

function Section() {
  const professors = [
    {
      id: 0,
      name: 'Haralf Sondergaard',
      desc: 'Professor',
      department: 'University of Melbourne',
      link: 'https://findanexpert.unimelb.edu.au/profile/13416-harald-sondergaard',
      img: Harald,
    },
    {
      id: 1,
      name: 'Dr. Linda Stern',
      desc: 'Honarary',
      department: 'University of Melbourne',
      link: 'https://findanexpert.unimelb.edu.au/profile/14535-linda-stern',
      img: Linda,
    },
  ];


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
