import React, { useState } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';

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
