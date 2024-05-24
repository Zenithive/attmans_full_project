import React, { useState } from 'react';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SignIn from '../Signin/SignIn';
import SignUp from '../SignUp/SignUp';


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
