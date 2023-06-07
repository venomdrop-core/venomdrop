import { FC } from 'react'

export const Spinner: FC = () => {
  return (
    <div className="w-6 h-6 rounded-full animate-spin border-2 border-solid border-primary border-t-transparent" />
  )
}
