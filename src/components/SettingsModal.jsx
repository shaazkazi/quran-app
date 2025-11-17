import { X, Palette, Type, Globe, Volume2, Eye } from 'lucide-react'

const SettingsModal = ({ isOpen, onClose, settings, onSettingsChange }) => {
  if (!isOpen) return null

  const handleSettingChange = (key, value) => {
    onSettingsChange({ [key]: value })
  }

  const settingSections = [
    {
      title: 'Appearance',
      icon: Palette,
      settings: [
        {
          key: 'theme',
          label: 'Theme',
          type: 'select',
          options: [
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'auto', label: 'Auto' }
          ]
        },
        {
          key: 'fontSize',
          label: 'Font Size',
          type: 'select',
          options: [
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' },
            { value: 'xl', label: 'Extra Large' }
          ]
        },
        {
          key: 'arabicFont',
          label: 'Arabic Font',
          type: 'select',
          options: [
            { value: 'uthmanic', label: 'Uthmanic' },
            { value: 'indopak', label: 'Indo-Pak' },
            { value: 'naskh', label: 'Naskh' }
          ]
        }
      ]
    },
    {
      title: 'Language & Translation',
      icon: Globe,
      settings: [
        {
          key: 'language',
          label: 'Primary Language',
          type: 'select',
          options: [
            { value: 'ar', label: 'العربية (Arabic)' },
            { value: 'en', label: 'English' },
            { value: 'ur', label: 'اردو (Urdu)' }
          ]
        },
        {
          key: 'translation',
          label: 'Translation',
          type: 'select',
          options: [
            { value: 'en', label: 'English' },
            { value: 'ur', label: 'Urdu' }
          ]
        },
        {
          key: 'translator',
          label: 'Translator',
          type: 'select',
          options: [
            { value: 'sahih', label: 'Sahih International' },
            { value: 'maududi', label: 'Maududi' }
          ]
        },
        {
          key: 'showTransliteration',
          label: 'Show Transliteration',
          type: 'toggle'
        }
      ]
    },
    {
      title: 'Reading Experience',
      icon: Eye,
      settings: [
        {
          key: 'autoScroll',
          label: 'Auto Scroll',
          type: 'toggle'
        },
        {
          key: 'nightMode',
          label: 'Night Reading Mode',
          type: 'toggle'
        }
      ]
    },
    {
      title: 'Audio',
      icon: Volume2,
      settings: [
        {
          key: 'audioReciter',
          label: 'Reciter',
          type: 'select',
          options: [
            { value: 'mishary', label: 'Mishary Rashid' },
            { value: 'sudais', label: 'Abdul Rahman Al-Sudais' },
            { value: 'husary', label: 'Mahmoud Khalil Al-Husary' }
          ]
        },
        {
          key: 'audioSpeed',
          label: 'Playback Speed',
          type: 'select',
          options: [
            { value: '0.5', label: '0.5x' },
            { value: '0.75', label: '0.75x' },
            { value: '1', label: '1x' },
            { value: '1.25', label: '1.25x' },
            { value: '1.5', label: '1.5x' }
          ]
        }
      ]
    }
  ]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Settings</h2>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            aria-label="Close settings"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {settingSections.map(section => {
            const Icon = section.icon
            return (
              <div key={section.title} className="settings-section">
                <div className="section-header">
                  <Icon size={20} />
                  <h3 className="section-title">{section.title}</h3>
                </div>

                <div className="settings-list">
                  {section.settings.map(setting => (
                    <div key={setting.key} className="setting-item">
                      <div className="setting-info">
                        <label className="setting-label">
                          {setting.label}
                        </label>
                        {setting.description && (
                          <p className="setting-description">
                            {setting.description}
                          </p>
                        )}
                      </div>

                      <div className="setting-control">
                        {setting.type === 'select' ? (
                          <select
                            value={settings[setting.key]}
                            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                            className="select"
                          >
                            {setting.options.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : setting.type === 'toggle' ? (
                          <label className="toggle">
                            <input
                              type="checkbox"
                              checked={settings[setting.key]}
                              onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                        ) : setting.type === 'range' ? (
                          <input
                            type="range"
                            min={setting.min}
                            max={setting.max}
                            step={setting.step}
                            value={settings[setting.key]}
                            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                            className="range"
                          />
                        ) : (
                          <input
                            type="text"
                            value={settings[setting.key]}
                            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                            className="input"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="modal-footer">
          <button
            onClick={() => {
              // Reset to defaults
              onSettingsChange({
                theme: 'dark',
                language: 'ar',
                translation: 'en',
                translator: 'sahih',
                fontSize: 'medium',
                arabicFont: 'uthmanic',
                showTransliteration: false,
                autoScroll: false,
                nightMode: false
              })
            }}
            className="btn btn-secondary"
          >
            Reset to Defaults
          </button>
          
          <button
            onClick={onClose}
            className="btn btn-primary"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal