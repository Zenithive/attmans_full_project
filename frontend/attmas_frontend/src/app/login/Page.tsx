import React, { useState } from 'react';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SignIn from '../signin/SignIn';
import SignUp from '../signup/SignUp';


const Page = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div>
      {isLogin ? <SignIn toggleForm={toggleForm} /> : <SignUp toggleForm={toggleForm} />}
    </div>
  );
};



export default Page;
