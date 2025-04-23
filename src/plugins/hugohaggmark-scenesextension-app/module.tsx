import { AppPlugin } from '@grafana/data';

import { App } from './components/App';
import { ObjectDetailExtensionProps } from './components/ObjectDetailsExtension';
import { ObjectDetailExtensionParams } from './components/ObjectDetailExtensionParams';
export const plugin = new AppPlugin<{}>()
  .setRootPage(App)
  .exposeComponent<ObjectDetailExtensionProps>(ObjectDetailExtensionParams);
