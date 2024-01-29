// Add global types for `expo?.modules?.ExpoAppIcon`
declare global {
  namespace Native {
    interface ExpoAppIcon {
      isSupported: boolean;
      /** Pass `null` to use the default icon. */
      setAlternateIcon: (iconName: string | null) => Promise<string | null>;
      /** @returns `null` if the default icon is being used. */
      getAlternateIcon: () => Promise<string | null>;
    }

    interface SmartSettings {
      set(key: string, value: string | number, suite?: string): void;
    }
  }

  var expo:
    | {
        modules: {
          ExpoAppIcon?: Native.ExpoAppIcon;
          SmartSettings?: Native.SmartSettings;
        };
      }
    | undefined;
}

export default (expo?.modules?.ExpoAppIcon ?? {
  // If the native module is not available, return a mock that does nothing.
  isSupported: false,
  async setAlternateIcon() {
    return null;
  },
  async getAlternateIcon() {
    return null;
  },
}) satisfies Native.ExpoAppIcon;
