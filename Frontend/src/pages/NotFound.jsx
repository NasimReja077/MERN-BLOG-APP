import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../components/constants';
import NotFoundImg from "../assets/404.svg";
import { IoArrowUndoOutline } from "react-icons/io5";
import { Slugify } from '../utils/formatters';
export const NotFound = ({
  redirectTo = ROUTES.HOME,
  image = NotFoundImg,
  alt = '404 page illustration',
  title = 'Page not found',
  description = "Sorry, the page you are looking for doesn't exist. Here are some helpful links:",
}) => {
  const navigate = useNavigate();

  // Handler to navigate back one step in history
  const handleGoBack = () => {
    navigate(-1);
  };

  // Handler to navigate to the home page (uses ROUTES)
  const handleGoHome = () => {
    navigate(redirectTo);
  };



  return (
    <section className="bg-white dark:bg-gray-900">
    <div className="container min-h-screen px-6 py-12 mx-auto lg:flex lg:items-center lg:gap-12">
        
        {/* LEFT CONTENT (TEXT and BUTTONS) */}
        <div className="w-full lg:w-1/2"> 
            <p className="text-sm font-medium text-blue-500 dark:text-blue-400">404 error</p>
            <h1 id={Slugify(title)} className="mt-3 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">{title}</h1>
            <p className="mt-4 text-gray-500 dark:text-gray-400">{description}</p>

            <div className="flex items-center mt-6 gap-x-3">
                {/* Go back Button with onClick handler */}
                <button 
                  onClick={handleGoBack}
                  className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700"
                >
                  <IoArrowUndoOutline className="w-5 h-5 rtl:rotate-180" />
                  <span>Go back</span>
                </button>

                {/* Take me home Button with onClick handler */}
                <button 
                  onClick={handleGoHome}
                  className="w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600"
                >
                    Take me home
                </button>
            </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative w-full mt-8 lg:w-1/2 lg:mt-0">
            {/* Image source uses the imported local asset */}
            <img 
                className="w-full rounded-lg object-cover" 
                src={image} 
                alt={alt} 
            />
        </div>
    </div>
</section>
  );
};

NotFound.propTypes = {
  redirectTo: PropTypes.string,
  image: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  alt: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
};