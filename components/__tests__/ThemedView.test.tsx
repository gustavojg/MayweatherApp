import * as React from 'react';
import { render, waitFor } from '@/utils/test-utils';
import { ThemedView } from '../ThemedView';

describe('ThemedView', () => {
  it('renders correctly with default props', async () => {
    const { getByTestId } = await render(
      <ThemedView testID="themed-view" />
    );

    await waitFor(() => {
      expect(getByTestId('themed-view')).toBeTruthy();
    });
  });

  it('renders correctly with custom background colors', async () => {
    const { getByTestId } = await render(
      <ThemedView testID="themed-view" lightBg="#FF0000" darkBg="#0000FF" />
    );

    await waitFor(() => {
      expect(getByTestId('themed-view')).toBeTruthy();
      const view = getByTestId('themed-view');
      expect(view.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            backgroundColor: expect.any(String)
          })
        ])
      );
    });
  });

  it('renders correctly with children', async () => {
    const { getByTestId } = await render(
      <ThemedView testID="parent">
        <ThemedView testID="child" />
      </ThemedView>
    );

    await waitFor(() => {
      expect(getByTestId('parent')).toBeTruthy();
      expect(getByTestId('child')).toBeTruthy();
    });
  });

  it('renders correctly when transparent', async () => {
    const { getByTestId } = await render(
      <ThemedView testID="themed-view" transparent />
    );

    await waitFor(() => {
      const view = getByTestId('themed-view');
      expect(view.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            backgroundColor: 'transparent'
          })
        ])
      );
    });
  });
});