/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react'

type Props = {

    name: string;
    buttonComponent?: any;
    isSmallText?: boolean;

}

const Header = ({name, buttonComponent, isSmallText = false}: Props) => {
  return (
    <div className='mb-5 flex w-full items-center justify-between'>

            <h1 className={`${isSmallText ? "text-lg" : "text-2xl"} font-semibold dark:text-white`}> {name}</h1>
            {buttonComponent}

    </div>
  )
}

export default Header