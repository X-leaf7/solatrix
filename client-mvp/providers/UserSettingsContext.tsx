'use client'

import { ReactNode, createContext, useState, Dispatch, SetStateAction } from 'react';
import { getSavedValuesFromLocalStorage, clearSavedSettings } from '@/utils/userSettings';

// Define allowed values for specific fields
type ChannelType = 'BASIC' | 'STANDARD' | 'ADVANCED_HD' | 'ADVANCED_SD' | undefined;
type OrientationType = 'PORTRAIT' | 'LANDSCAPE' | undefined;

// Define TypeScript interface for context values
interface UserSettingsContextType {
  channelType?: ChannelType;
  setChannelType?: Dispatch<SetStateAction<ChannelType>>;
  selectedVideoDeviceId?: string;
  setSelectedVideoDeviceId?: Dispatch<SetStateAction<string>>;
  selectedAudioDeviceId?: string;
  setSelectedAudioDeviceId?: Dispatch<SetStateAction<string>>;
  orientation?: OrientationType;
  setOrientation?: Dispatch<SetStateAction<OrientationType>>;
  resolution?: string;
  setResolution?: Dispatch<SetStateAction<string>>;
  configRef?: any;
  streamKey?: string;
  setStreamKey?: Dispatch<SetStateAction<string>>;
  ingestEndpoint?: string;
  setIngestEndpoint?: Dispatch<SetStateAction<string>>;
  localVideoMirror?: boolean;
  setLocalVideoMirror?: Dispatch<SetStateAction<boolean>>;
  audioNoiseSuppression?: boolean;
  setAudioNoiseSuppression?: Dispatch<SetStateAction<boolean>>;
  autoGainControl?: boolean;
  setAutoGainControl?: Dispatch<SetStateAction<boolean>>;
  saveSettings?: boolean;
  setSaveSettings?: Dispatch<SetStateAction<boolean>>;
  clearSavedSettings: () => void;
}

// Create context with default values
const UserSettingsContext = createContext<UserSettingsContextType>({
  clearSavedSettings,
});

interface UserSettingsProviderProps {
  children: ReactNode;
}

function UserSettingsProvider({ children }: UserSettingsProviderProps) {
  const savedValues = getSavedValuesFromLocalStorage();

  // State management with correct types
  const [channelType, setChannelType] = useState<ChannelType>(savedValues.channelType || 'BASIC');
  const [selectedVideoDeviceId, setSelectedVideoDeviceId] = useState<string>('');
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState<string>('');
  const [orientation, setOrientation] = useState<OrientationType>(savedValues.orientation || 'PORTRAIT');
  const [resolution, setResolution] = useState<string>(String(savedValues.resolution || ''));
  const [streamKey, setStreamKey] = useState<string>(savedValues.streamKey || '');
  const [ingestEndpoint, setIngestEndpoint] = useState<string>(savedValues.ingestEndpoint || '');
  const [localVideoMirror, setLocalVideoMirror] = useState<boolean>(savedValues.localVideoMirror || false);
  const [audioNoiseSuppression, setAudioNoiseSuppression] = useState<boolean>(savedValues.audioNoiseSuppression || false);
  const [autoGainControl, setAutoGainControl] = useState<boolean>(savedValues.autoGainControl || false);
  const [saveSettings, setSaveSettings] = useState<boolean>(savedValues.saveSettings || false);
  const configRef = savedValues.configRef

  return (
    <UserSettingsContext.Provider
      value={{
        channelType,
        setChannelType,
        selectedVideoDeviceId,
        setSelectedVideoDeviceId,
        selectedAudioDeviceId,
        setSelectedAudioDeviceId,
        orientation,
        setOrientation,
        resolution,
        setResolution,
        streamKey,
        setStreamKey,
        ingestEndpoint,
        setIngestEndpoint,
        localVideoMirror,
        setLocalVideoMirror,
        audioNoiseSuppression,
        setAudioNoiseSuppression,
        autoGainControl,
        setAutoGainControl,
        saveSettings,
        setSaveSettings,
        clearSavedSettings,
        configRef,
      }}
    >
      {children}
    </UserSettingsContext.Provider>
  );
}

export { UserSettingsContext, UserSettingsProvider };
