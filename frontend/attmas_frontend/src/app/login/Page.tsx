import React, { useState } from 'react';
import { SignIn } from '../component/Signin/signin';
import { SignUp } from '../component/SignUp/signup';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


const Page = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm: CallableFunction = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div>
      {isLogin ? <SignIn toggleForm={toggleForm} interestType={'InterestedUserForExhibition'} /> : <SignUp interestType={'InterestedUserForExhibition'}/>}
    </div>
  );
};



export default Page; 
