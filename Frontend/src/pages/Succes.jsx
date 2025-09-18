import React from 'react'
import SuccessImage from '../assest/success.gif'
import { Link } from 'react-router-dom'

const Succes = () => {
  return (
    <div className='bg-slate-200 w-full max-w-md mx-auto flex justify-center items-center flex-col p-4 m-2 rounded'>
      <img src={SuccessImage} alt="success" width={150} height={120} className='mix-blend-multiply rounded-full' />
      <p className='text-green-600 pt-4 font-bold text-xl'>Payment Successfully</p>
      <Link to={'/user-panel/order'} className=' text-green-600 p-2 my-2 mt-5 border-2 px-3 border-green-600 rounded font-semibold hover:bg-green-600 hover:text-white'>See Order</Link>
    </div>
  )
}

export default Succes
