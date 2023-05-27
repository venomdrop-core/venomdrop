import React, { Fragment, useEffect, useState } from 'react'
import classNames from 'classnames'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { CATEGORIES } from '../consts'

export interface CategorySelectProps {
  value: string;
  onChange: (slug: string) => void;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({ value, onChange }) => {
  const [selected, setSelected] = useState(CATEGORIES.find(c => c.slug === value) || CATEGORIES[0]);
  useEffect(() => {
    onChange(selected.slug);
  }, [selected]);
  useEffect(() => {
    setSelected(CATEGORIES.find(c => c.slug === value ) || CATEGORIES[0]);
  }, [value]);
  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <div className="relative mt-2">
            <Listbox.Button className="relative w-full cursor-default rounded-btn border border-base-content border-opacity-20 bg-base-100 py-3 pl-3 pr-10 text-left focus:outline-none">
              <span className="flex items-center">
                {selected?.icon && (
                  <selected.icon className="h-5 w-5 flex-shrink-0"></selected.icon>
                )}
                <span className="ml-3 block truncate">{selected?.name}</span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-md bg-base-100 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {CATEGORIES.map((category) => (
                  <Listbox.Option
                    key={category.slug}
                    className={({ active }) =>
                      classNames(
                        active ? 'bg-primary text-gray-300' : 'text-white',
                        'relative cursor-default select-none py-2 pl-3 pr-9'
                      )
                    }
                    value={category}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          {category?.icon && (
                            <category.icon className="h-5 w-5 flex-shrink-0"></category.icon>
                          )}
                          <span
                            className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                          >
                            {category.name}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-primary',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  )
}
