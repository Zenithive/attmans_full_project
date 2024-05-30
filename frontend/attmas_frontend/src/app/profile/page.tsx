"use client"
import React from 'react'
import Profile1 from '../component/all_Profile_component/profile1'
import Profile2 from '../component/all_Profile_component/profile2'
import Profile3 from '../component/all_Profile_component/profile3'
import HorizontalStepper from '../component/all_Profile_component/upperLine'
import Category from '../component/all_Profile_component/multipleDropDownCategory'

const page = () => {
  return (
    <>
    <Category/>
    <HorizontalStepper/>
    <Profile1/>
    <Profile2/>
    <Profile3/>
    </>
  )
}

export default page
