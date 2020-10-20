import React from 'react';
import '../../styles/About.scss';
import Harald from '../../assets/Prof_Sondergaard.jpg';
import Linda from '../../assets/Dr_Stern.jpg';


function Section() {
  const professors = [
    {
      name: 'Haralf Sondergaard',
      desc: 'Professor',
      department: 'University of Melbourne',
      link: 'https://findanexpert.unimelb.edu.au/profile/13416-harald-sondergaard',
      img: Harald,
    },
    {
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
          name, desc, department, link, img,
        }) => (
          <a href={link} target="_blank" rel="noopener noreferrer" className="profile">
            <img src={img} alt={name} />
            <div className="info">
              <div className="desc">{desc}</div>
              <div className="name">{name}</div>
              <div className="department">{department}</div>
            </div>
          </a>
        ))
      }
      </div>


    </div>
  );
}

export default Section;
