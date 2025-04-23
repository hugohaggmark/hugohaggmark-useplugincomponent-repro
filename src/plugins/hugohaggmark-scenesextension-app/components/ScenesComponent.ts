import {
  EmbeddedScene,
  PanelBuilders,
  SceneFlexItem,
  SceneFlexLayout,
  SceneQueryRunner,
  SceneTimePicker,
  SceneTimeRange,
  SceneTimeRangeState,
} from '@grafana/scenes';
import { ExposedComponentsObject } from './ExposedComponent';
import { TimeRange } from '@grafana/data';

export type ScenesCustomParams = {
  relativeTimeRange?: SceneTimeRangeState;
  onTimeRangeChange?: (timeRange: TimeRange) => void;
};

const DATASOURCE_REF = {
  uid: 'grafana',
  type: 'datasource',
};

function addTimeRangeHandler(timeRange: SceneTimeRange, onTimeRangeChange?: (timeRange: TimeRange) => void) {
  timeRange.addActivationHandler(() => {
    const listener = timeRange.subscribeToState((newState) => {
      if (typeof onTimeRangeChange === 'function') {
        onTimeRangeChange(newState.value);
      }
    });

    return () => listener?.unsubscribe();
  });
}

export function ScenesComponent({ relativeTimeRange, onTimeRangeChange }: ScenesCustomParams) {
  const sceneTimeRange = new SceneTimeRange(relativeTimeRange);
  addTimeRangeHandler(sceneTimeRange, onTimeRangeChange);

  // Query runner definition, using Grafana built-in TestData datasource
  const queryRunner = new SceneQueryRunner({
    datasource: DATASOURCE_REF,
    queries: [
      {
        refId: 'A',
        datasource: DATASOURCE_REF,
        scenarioId: 'random_walk',
        seriesCount: 5,
        min: 30,
        max: 60,
      },
    ],
    maxDataPoints: 100,
  });

  return new EmbeddedScene({
    $timeRange: sceneTimeRange,
    $data: queryRunner,
    controls: [new SceneTimePicker(relativeTimeRange!)],
    body: new SceneFlexLayout({
      direction: 'column',
      children: [
        new SceneFlexItem({
          minHeight: 300,
          body: PanelBuilders.timeseries()
            // Title is using variable value
            .setTitle('Hello world')
            .build(),
        }),
        new SceneFlexItem({
          minHeight: 300,
          body: new ExposedComponentsObject({ timeRange: sceneTimeRange.clone() }),
        }),
      ],
    }),
  });
}
