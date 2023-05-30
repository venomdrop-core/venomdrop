import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import React, { FC, useState } from 'react'
import { useCounter } from 'usehooks-ts'

export interface MintBoxProps {
  
}

export const MintBox: FC<MintBoxProps> = (props) => {
  const [count, setCount] = useState(0)

  const increment = () => setCount(x => x + 1)
  const decrement = () => setCount(x => x > 1 ? x - 1 : 0)

  return (
    <div className='border border-slate-800 p-8 rounded-lg bg-slate-900'>
      <div className="text-gray-100 text-lg font-bold">
        Test Stage
      </div>
      <div className="text-gray-300 mt-2 font-semibold">
        0.025 VENOM
      </div>
      <div className="flex items-center mt-8 ">
        <div className="inline-flex items-center border border-gray-800 rounded-lg">
          <button className="btn btn-ghost font-bold text-xl" onClick={() => decrement()}>
            <MinusIcon className="w-4 h-4" />
          </button>
          <div className="px-4 text-center">
            {count}
          </div>
          <button className="btn btn-ghost font-bold text-xl" onClick={() => increment()}>
            <PlusIcon className="w-4 h-4" />
          </button>
        </div>
        <button className="btn btn-primary ml-4 px-6">Mint</button>
      </div>
    </div>
  )
}
