import React from 'react'
import PropTypes from 'prop-types';

export const Loading = ({ size = 'md', fullScreen = false }) => {
     const sizes = {
          sm: 'w-6 h-6',
          md: 'w-12 h-12',
          lg: 'w-16 h-16',
     };

     if (fullScreen){
          return (
               <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
                    <div className={`${sizes[size]} spinner`}></div>
               </div>
          );
     }

  return (
    <div className="flex justify-center items-center p-8">
      <div className={`${sizes[size]} spinner`}></div>
    </div>
  );
};

Loading.propTypes = {
     size: PropTypes.oneOf(['sm', 'md', 'lg']),
     fullScreen: PropTypes.bool,
};