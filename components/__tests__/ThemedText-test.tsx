import * as React from 'react';
import { render, waitFor } from '@/utils/test-utils';
import { ThemedText } from '../ThemedText';

describe('ThemedText', () => {
  it('renders correctly with default props', async () => {
    const { getByTestId } = await render(
      <ThemedText testID="text">Hello World</ThemedText>
    );

    await waitFor(() => {
      const element = getByTestId('text');
      expect(element).toBeTruthy();
      expect(element.props.children).toBe('Hello World');
    });
  });

  it('renders correctly with different types', async () => {
    const types = ['default', 'title', 'subtitle', 'defaultSemiBold'] as const;
    for (const type of types) {
      const { getByTestId } = await render(
        <ThemedText testID={`text-${type}`} type={type}>
          Text with {type} type
        </ThemedText>
      );
      
      await waitFor(() => {
        const element = getByTestId(`text-${type}`);
        expect(element).toBeTruthy();
        expect(element.props.style).toEqual(
          expect.arrayContaining([
            expect.any(Object)
          ])
        );
      });
    }
  });

  it('renders correctly with custom colors', async () => {
    const { getByTestId } = await render(
      <ThemedText
        testID="colored-text"
        lightColor="#FF0000"
        darkColor="#0000FF"
      >
        Colored text
      </ThemedText>
    );

    await waitFor(() => {
      const element = getByTestId('colored-text');
      expect(element).toBeTruthy();
      expect(element.props.children).toBe('Colored text');
      expect(element.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            color: expect.any(String)
          })
        ])
      );
    });
  });
});