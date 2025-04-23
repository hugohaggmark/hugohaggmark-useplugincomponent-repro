import React, { useState } from 'react';
import { css } from '@emotion/css';
import { DateTime, dateTimeParse, GrafanaTheme2, RawTimeRange, TimeRange } from '@grafana/data';
import { LinkButton, RefreshPicker, useStyles2 } from '@grafana/ui';
import { prefixRoute } from '../utils/utils.routing';
import { ROUTES } from '../constants';
import { testIds } from '../components/testIds';
import { PluginPage } from '@grafana/runtime';
import { Dummy } from 'components/Dummy';

export type DateTimeRange = {
  from: DateTime;
  to: DateTime;
  raw: RawTimeRange;
};

export interface ObjectDetailExtensionProps {
  initialTimeRange: DateTimeRange;
  onTimeRangeChange: (timeRange: TimeRange) => void;
}

const initialTimeRange = {
  from: dateTimeParse(new Date(new Date().setHours(new Date().getHours() - 3))),
  to: dateTimeParse(new Date()),
  raw: { from: 'now-3h', to: 'now' },
};

function PageOne() {
  const s = useStyles2(getStyles);
  const [count, setCount] = useState(0);
  const [timeRange, setTimeRange] = useState<TimeRange>(initialTimeRange);

  return (
    <PluginPage>
      <div data-testid={testIds.pageOne.container}>
        This is page one.
        <div className={s.marginTop}>
          <LinkButton data-testid={testIds.pageOne.navigateToFour} href={prefixRoute(ROUTES.Four)}>
            Full-width page example
          </LinkButton>
          <RefreshPicker
            isOnCanvas={true}
            noIntervalPicker={true}
            onRefresh={() => setCount(count + 1)}
            onIntervalChanged={() => null}
            isLoading={false}
          />
          {count % 2 === 0 && <Dummy initialTimeRange={timeRange} onTimeRangeChange={(range) => setTimeRange(range)} />}
          <div>Count: {count}</div>
        </div>
      </div>
    </PluginPage>
  );
}

export default PageOne;

const getStyles = (theme: GrafanaTheme2) => ({
  marginTop: css`
    margin-top: ${theme.spacing(2)};
  `,
});
