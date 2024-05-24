import React from 'react'
import dp from '../dp.jpg'
const Story = () => {
  return (
    <div className='w-[90%] sm:w-[500px]'>
        <div className='flex gap-2'>
            <div className='  flex flex-col items-center gap-1'>
                <div className='cursor-pointer bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-full'>
                    <img src={dp} alt="dp" className='rounded-full w-[80px] h-[80px] object-cover p-1' />
                </div>
                <h4>Amit Chahar</h4>
            </div>
            <div className='  flex flex-col items-center gap-1'>
                <div className='cursor-pointer bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-full'>
                    <img src={dp} alt="dp" className='rounded-full w-[80px] h-[80px] object-cover p-1' />
                </div>
                <h4>Amit Chahar</h4>
            </div>
            <div className='  flex flex-col items-center gap-1'>
                <div className='cursor-pointer bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-full'>
                    <img src={dp} alt="dp" className='rounded-full w-[80px] h-[80px] object-cover p-1' />
                </div>
                <h4>Amit Chahar</h4>
            </div>
        </div>
    </div>
  )
}

export default Story