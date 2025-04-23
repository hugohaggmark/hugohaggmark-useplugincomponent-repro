import React, { useEffect, useMemo } from 'react';
import { omit } from 'lodash';
import { DateTime, RawTimeRange, TimeRange } from '@grafana/data';
import { ScenesComponent } from './ScenesComponent';
import { EmbeddedScene } from '@grafana/scenes';

export type DateTimeRange = {
  from: DateTime;
  to: DateTime;
  raw: RawTimeRange;
};

export interface ObjectDetailExtensionProps {
  initialTimeRange: DateTimeRange;
  onTimeRangeChange: (timeRange: TimeRange) => void;
}

declare global {
  interface Window {
    prevScene: EmbeddedScene | null | undefined;
  }
}

function ObjectDetailExtension({ ...props }: ObjectDetailExtensionProps) {
  const scene = useMemo(() => {
    if (!props) {
      return null;
    }
    const { initialTimeRange, onTimeRangeChange } = props;

    const relativeTimeRange = {
      from: initialTimeRange?.raw?.from as string,
      to: initialTimeRange?.raw?.to as string,
      value: initialTimeRange,
    };

    const commonProps = {
      onTimeRangeChange,
      relativeTimeRange,
    };

    return ScenesComponent(commonProps);

    // excluding initialTimeRange from the dependency array to avoid re-rendering after time range change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, Object.values(omit(props, 'initialTimeRange')));

  // this effect is to see when the component is mounted and unmounted
  useEffect(() => {
    console.log('ObjectDetailExtension::initial render');
    return () => {
      window.prevScene = null;
      console.log('ObjectDetailExtension::unmount');
    };
  }, []);

  // this effect adds the scene to the window object if it is not already there
  useEffect(() => {
    if (!window.prevScene && scene) {
      window.prevScene = scene;
    }
    const sceneHasChanged = Boolean(window.prevScene) && Boolean(scene) && window.prevScene !== scene;
    console.log(sceneHasChanged ? 'scene has changed' : 'scene has not changed');
  }, [scene]);

  return scene && <scene.Component model={scene} />;
}

export default ObjectDetailExtension;
