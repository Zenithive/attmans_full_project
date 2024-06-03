"use client"

import React from 'react'
import Image from 'next/image'

interface LogoProps {
  width: number | `${number}` | undefined;
  height: number | `${number}` | undefined;
}


export const Logo = ({ width, height }: LogoProps) => {

  return (
    <Image src="/attmans (png)-01.png" alt="attmans logo" width={width} height={height} />
  )
}



