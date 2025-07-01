'use client'

import React, { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'
import { STORAGE_KEYS } from '../constants'
import SettingsDrawer from '../components/SettingsDrawer'

export default function SettingsPage() {
  const { setApiKey, setDeveloperMessage, setModel } = useAppStore();
  const [showSettings, setShowSettings] = React.useState(true);

  // Load stored settings on mount
  useEffect(() => {
    const storedApiKey = sessionStorage.getItem(STORAGE_KEYS.API_KEY);
    const storedDeveloperMessage = sessionStorage.getItem(STORAGE_KEYS.DEVELOPER_MESSAGE);
    const storedModel = sessionStorage.getItem(STORAGE_KEYS.MODEL);

    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
    if (storedDeveloperMessage) {
      setDeveloperMessage(storedDeveloperMessage);
    }
    if (storedModel) {
      setModel(storedModel);
    }
  }, [setApiKey, setDeveloperMessage, setModel]);

  const handleClose = () => {
    // Redirect to home page when settings are closed
    window.location.href = '/';
  };

  return (
    <SettingsDrawer
      isOpen={showSettings}
      onClose={handleClose}
      aria-label="Settings page"
    />
  );
} 