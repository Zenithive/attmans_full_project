"use client";

import { useEffect, useState } from 'react';
import Page from './login/Page';
// import MainHomePage from './component/homePage/MainHomePage';

export default function Home() {
  // const [message, setMessage] = useState('');

  // useEffect(() => {
  //   fetch('http://localhost:3000/hello')
  //     .then(response => response.text())
  //     .then(data => setMessage(data))
  //     .catch(error => console.error('Error fetching data:', error)); // Handle fetch error
  // }, []);

  return (
    // <div>
    //   <h1>Message from NestJS:</h1>
    //   <p>{message}</p>
    // </div>
    <>
    <Page/>
    
    {/* <MainHomePage/> */}
    
    
    </>
  );
}
