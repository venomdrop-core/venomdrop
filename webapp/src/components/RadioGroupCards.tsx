import React, { FC } from 'react'
import { useState } from 'react'
import { RadioGroup } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import classNames from 'classnames'


export interface Option {
  title: string;
  value: string;
  description: React.ReactNode | string;
  bottomInfo?: React.ReactNode | string;
}

export interface RadioGroupCardsProps {
  options: Option[];
}

export const RadioGroupCards: FC<RadioGroupCardsProps> = ({ options }) => {
  const [selectedOption, setSelectedOption] = useState(options[0])
  return (
    <RadioGroup value={selectedOption} onChange={setSelectedOption}>
      <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
        {options.map((option) => (
          <RadioGroup.Option
            key={option.value}
            value={option}
            className={({ checked, active }) =>
              classNames(
                checked ? 'border-transparent' : 'border-base-content',
                active ? 'border-base-content ring-2 ring-gray-300' : '',
                'relative flex cursor-pointer rounded-lg border border-gray-600 bg-base-100 p-4 shadow-sm focus:outline-none'
              )
            }
          >
            {({ checked, active }) => (
              <>
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <RadioGroup.Label as="span" className={classNames('block text-sm font-medium', checked ? 'text-gray-300' : 'text-gray-400')}>
                      {option.title}
                    </RadioGroup.Label>
                    <RadioGroup.Description as="span" className="mt-1 flex items-center text-sm text-gray-500">
                      {option.description}
                    </RadioGroup.Description>
                    {option.bottomInfo && (
                      <RadioGroup.Description as="span" className="mt-6 text-sm font-medium text-gray-900">
                        {option.bottomInfo}
                      </RadioGroup.Description>
                    )}
                  </span>
                </span>
                <CheckCircleIcon
                  className={classNames(!checked ? 'invisible' : '', 'h-5 w-5 text-gray-300')}
                  aria-hidden="true"
                />
                <span
                  className={classNames(
                    active ? 'border' : 'border-2',
                    checked ? 'border-gray-300' : 'border-transparent',
                    'pointer-events-none absolute -inset-px rounded-lg'
                  )}
                  aria-hidden="true"
                />
              </>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  )
}
