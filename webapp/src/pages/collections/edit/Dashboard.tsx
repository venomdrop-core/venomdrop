import { FC } from 'react'
import { AdminLayout } from '../../../layouts/AdminLayout'

export interface DashboardProps {}

export const Dashboard: FC<DashboardProps> = () => {
  return (
    <AdminLayout>
      Dashboard
    </AdminLayout>
  )
}
