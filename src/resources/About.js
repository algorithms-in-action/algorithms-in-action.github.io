/* eslint-disable no-trailing-spaces */
/* eslint-disable no-multi-str */
/**
 * This file is used to store the content/description shown
 * on the About page.
 */

/**
 * How to use:
 * Each object represents a section on the About page.
 * 'heading' is the heading for the section,
 * 'paragraph' array stores paragraphs you want to show
*/
/**
 * How to use:
 * Each object contains the information of a team member
 * 
 */

import Harald from '../assets/images/Prof_Sondergaard.jpg';
import Linda from '../assets/images/Dr_Stern.jpg';
import Lee from '../assets/images/lee_naish.png';

import Boyu from '../assets/images/boyu.JPG';
import Carina from '../assets/images/carina.jpg';
import Joao from '../assets/images/joao.jpg';
import Kenny from '../assets/images/kenny.JPG';
import Luke from '../assets/images/luke.jpeg';
import Tianyang from '../assets/images/tianyang.jpg';
import Linfan from '../assets/images/linfan.jpeg';
import Yinsong from '../assets/images/yinsong.jpg';
import Zihan from '../assets/images/zihan.jpg';
import Nir from '../assets/images/nir.png';


export const content = {
  projectDescription: {
    heading: 'About the Project',
    paragraph: [
      'In the late 90s, Prof. Harald Sondergaard and Dr. Linda Stern built Algorithm in Action,\
      designed for students to visualise algorithms. However, that was almost 20 years ago and the\
      app fell out of use.',
      'This project aims to redevelop and redesign the application with its pioneering pedagogy\
      (stepwise refinement) for the modern century.',
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been\
      the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley\
      of type and scrambled it to make a type specimen book. It has survived not only five centuries,\
      but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised\
      in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently\
      with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    ],
  },
  licenseDescription: {
    heading: 'Licensing',
    paragraph: [
      'We are using MIT Licensing...',
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been\
      the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley\
      of type and scrambled it to make a type specimen book. It has survived not only five centuries,\
      but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised\
      in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently\
      with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    ],
  },
};

export const professors = [
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
  {
    id: 2,
    name: 'Dr. Lee Naish',
    desc: 'Honarary',
    department: 'University of Melbourne',
    link: 'https://people.eng.unimelb.edu.au/lee/',
    img: Lee,
  },

];

export const team = [
  {
    name: 'Zihan Zhang',
    photo: Zihan,
    github: 'https://github.com/ZhangzihanGit',
    linkedIn: 'https://www.linkedin.com/in/zihan-zhang-a40855172/',
    desc: 'University of Melbourne',
    title: 'MEng (Software)',
  }, {
    name: 'Luke Ceddia',
    photo: Luke,
    github: 'https://github.com/flukiluke',
    linkedIn: '',
    desc: 'University of Melbourne',
    title: 'MEng (Software)',

  },
  {
    name: 'Kenny Lee',
    photo: Kenny,
    github: 'https://github.com/kennylwx',
    linkedIn: 'https://www.linkedin.com/in/kennylwx/',
    desc: 'University of Melbourne',
    title: 'MEng (Software)',

  },
  {
    name: 'Yingsong Chen',
    photo: Yinsong,
    github: 'https://github.com/icarusunimelb',
    linkedIn: 'https://www.linkedin.com/in/yinsong-chen-62707b15b/',
    desc: 'University of Melbourne',
    title: 'MEng (Software)',


  },
  {
    name: 'Bohao Liu',
    photo: Carina,
    github: 'https://github.com/lbh-carina',
    linkedIn: 'https://www.linkedin.com/in/bohao-liu-3218211ba/',
    desc: 'University of Melbourne',
    title: 'MEng (Software)',

  },
  {
    name: 'Nir Palombo',
    photo: Nir,
    github: 'https://github.com/nirpalombo',
    linkedIn: 'https://www.linkedin.com/in/nir-palombo-b513b449/',
    desc: 'University of Melbourne',
    title: 'MEng (Software)',


  },
  {
    name: 'Boyu Zhou',
    photo: Boyu,
    github: 'https://github.com/BOYU0926',
    linkedIn: 'https://www.linkedin.com/in/boyu-zhou-05487b1a0/',
    desc: 'University of Melbourne',
    title: 'MEng (Software)',

  },
  {
    name: 'João Pereira',
    photo: Joao,
    github: 'https://github.com/jofrancis1997',
    linkedIn: 'https://www.linkedin.com/in/joão-pereira-574972163/',
    desc: 'University of Melbourne',
    title: 'MEng (Software)',

  },
  {
    name: 'Lin Fan',
    photo: Linfan,
    github: 'https://github.com/tututulillian',
    linkedIn: '',
    desc: 'University of Melbourne',
    title: 'MEng (Software)',

  },
  {
    name: 'Tianyang Chen',
    photo: Tianyang,
    github: 'https://github.com/Allen-Chen-7',
    linkedIn: 'https://www.linkedin.com/in/tianyang-chen-8208261ba/',
    desc: 'University of Melbourne',
    title: 'MEng (Software)',

  },
];
