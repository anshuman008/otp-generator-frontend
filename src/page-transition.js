import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { useLocation } from 'react-router-dom';
import './page-transition.scss';

const PageTransition = ({ children }) => {
    const location = useLocation();
  return (
    <CSSTransition
      key={location.key}
      classNames="fade"
      timeout={300}
    >
      {children}
    </CSSTransition>
  );
};

export default PageTransition;
