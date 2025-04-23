import React, { useEffect, useRef } from 'react';
import { SceneObjectBase, SceneObjectState, SceneTimeRange, SceneComponentProps } from '@grafana/scenes';

interface ExposedComponentsObjectState extends SceneObjectState {
  timeRange: SceneTimeRange;
}

export class ExposedComponentsObject extends SceneObjectBase<ExposedComponentsObjectState> {
  static Component = ExposedComponentsRenderer;
}

function ExposedComponentsRenderer({ model }: SceneComponentProps<ExposedComponentsObject>) {
  const id = useRef(new Date().getTime());
  const renderCount = useRef(0);
  const state = model.useState();

  useEffect(() => {
    renderCount.current += 1;
  });

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem',
      }}
    >
      Render count: {renderCount.current}
      <br />
      ID: {id.current}
      <br />
      Time range: {JSON.stringify(state.timeRange.state)}
    </div>
  );
}
