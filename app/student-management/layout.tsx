'use client'

import { ToastProvider } from '../components/ui/Toast'
import StudentManagement from './page'

export default function StudentManagementPage() {
  return (
    <ToastProvider>
      <StudentManagement />
    </ToastProvider>
  )
}
