import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import blogReducer from './features/blogSlice';
import commentReducer from './features/commentSlice';

export const store = configureStore({
     reducer: {
          auth: authReducer,
          blog: blogReducer,
          comment: commentReducer,
     },
     middleware: (getDefaultMiddleware) => 
          getDefaultMiddleware({
               serializableCheck: false,
          }),
});



// https://redux-toolkit.js.org/api/getDefaultMiddleware
// https://redux-toolkit.js.org/api/serializabilityMiddleware
// https://sunnychopper.medium.com/how-to-use-redux-middleware-to-better-control-your-data-and-write-cleaner-code-33f129d1cad0
