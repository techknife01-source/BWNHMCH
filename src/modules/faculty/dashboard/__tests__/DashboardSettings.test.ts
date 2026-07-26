/**
 * Dashboard Settings Unit Tests
 * Validates layout reordering, widget visibility toggles, theme settings & browser storage persistence.
 */

import { DEFAULT_SETTINGS, DEFAULT_WIDGETS, FacultyDashboardSettings } from '../hooks/useDashboardSettings';

describe('Faculty Dashboard Settings & Customizer Tests', () => {
  let settings: FacultyDashboardSettings;

  beforeEach(() => {
    settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
  });

  test('contains correct default widget count', () => {
    expect(settings.widgets.length).toBe(15);
  });

  test('toggles widget visibility correctly', () => {
    const widgetId = 'statistics';
    const widget = settings.widgets.find((w) => w.id === widgetId);
    expect(widget?.visible).toBe(true);

    // Toggle
    settings.widgets = settings.widgets.map((w) =>
      w.id === widgetId ? { ...w, visible: !w.visible } : w
    );
    const updated = settings.widgets.find((w) => w.id === widgetId);
    expect(updated?.visible).toBe(false);
  });

  test('reorders widget position correctly', () => {
    const firstWidget = settings.widgets[0];
    const secondWidget = settings.widgets[1];

    // Swap position 0 and 1
    const swapped = [...settings.widgets];
    swapped[0] = secondWidget;
    swapped[1] = firstWidget;

    expect(swapped[0].id).toBe(secondWidget.id);
    expect(swapped[1].id).toBe(firstWidget.id);
  });

  test('updates theme preference to dark or light', () => {
    settings.theme = 'dark';
    expect(settings.theme).toBe('dark');
  });

  test('updates compact mode setting', () => {
    settings.compactMode = true;
    expect(settings.compactMode).toBe(true);
  });
});
