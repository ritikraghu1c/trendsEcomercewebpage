import React from 'react'
import { Link } from 'react-router-dom'
import cancelImage from '../assest/Cancel.gif'

const Cancel = () => {
  return (
    <div className='bg-slate-200 w-full max-w-md mx-auto flex justify-center items-center flex-col p-4 m-2 rounded'>
      <img src={cancelImage} alt="success" width={150} height={150} className='mix-blend-multiply rounded-full' />
      <p className='text-red-600 pt-4 font-bold text-xl'>Payment Cancel</p>
      <Link to={'/cart'} className=' text-red-600 p-2 my-2 mt-5 border-2 px-3 border-red-600 rounded font-semibold hover:bg-red-600 hover:text-white'>Go To Card</Link>
    </div>
  )
}

export default Cancel
