import React from 'react';
import PropTypes from 'prop-types';

function Professor({
  id, link, img, name, desc, department,
}) {
  return (
    <>
      <a href={link} id={id} target="_blank" rel="noopener noreferrer" className="profile">
        <img src={img} alt={name} />
        <div className="info">
          <div className="desc">{desc}</div>
          <div className="name">{name}</div>
          <div className="department">{department}</div>
        </div>
      </a>
    </>
  );
}

export default Professor;
Professor.propTypes = {
  id: PropTypes.number.isRequired,
  link: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  department: PropTypes.string.isRequired,
};
