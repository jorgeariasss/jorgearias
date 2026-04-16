import React from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Generate } from './pages/Generate'
import { History } from './pages/History'
import { Settings } from './pages/Settings'

export function Router() {
  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Generate />
            </Layout>
          }
        />
        <Route
          path="/history"
          element={
            <Layout>
              <History />
            </Layout>
          }
        />
        <Route
          path="/settings"
          element={
            <Layout>
              <Settings />
            </Layout>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
