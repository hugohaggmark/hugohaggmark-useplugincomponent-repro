import { usePluginComponent } from '@grafana/runtime';
import { ObjectDetailExtensionProps } from 'pages/PageOne';
import React, { useEffect, useState } from 'react';

declare global {
  interface Window {
    prevExtension: React.ComponentType<ObjectDetailExtensionProps> | null | undefined;
  }
}

export function Dummy({ initialTimeRange, onTimeRangeChange }: ObjectDetailExtensionProps) {
  const { component: ObjectDetailExtension, isLoading } = usePluginComponent<ObjectDetailExtensionProps>(
    'hugohaggmark-scenesextension-app/object-detail-extension/v1'
  );
  const [extensionHasChanged, setExtensionHasChanged] = useState<boolean>(false);

  // this effect is to see when the component is mounted and unmounted
  useEffect(() => {
    console.log('Dummy::initial render');
    return () => {
      window.prevExtension = null;
      console.log('Dummy::unmount');
    };
  }, []);

  // this effect adds the extension to the window object if it is not already there and sets the extensionHasChanged state to true if it has changed
  useEffect(() => {
    if (!window.prevExtension && ObjectDetailExtension) {
      window.prevExtension = ObjectDetailExtension;
    }
    const extensionHasChanged =
      Boolean(window.prevExtension) && Boolean(ObjectDetailExtension) && window.prevExtension !== ObjectDetailExtension;
    setExtensionHasChanged(extensionHasChanged);
    console.log(extensionHasChanged ? 'extension has changed' : 'extension has not changed');
  }, [ObjectDetailExtension]);

  return (
    <>
      {isLoading && <div>Loading...</div>}
      {ObjectDetailExtension && (
        <ObjectDetailExtension
          initialTimeRange={initialTimeRange}
          onTimeRangeChange={(range) => onTimeRangeChange(range)}
        />
      )}
      {extensionHasChanged && <div>Extension has changed</div>}
      {!extensionHasChanged && <div>Extension has not changed</div>}
    </>
  );
}
