import React from 'react';
import App from './App';
import renderer from 'react-test-renderer';
import { act } from 'react-dom/test-utils';
import { render, waitForElement, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('UI tests', () => {
  test('renders models from firebase', async () => {
    const tree = render(<App />);
    await waitForElement(() => tree.getAllByTestId('modelcard'));
    return expect(tree.getAllByTestId('modelcard')).toBeTruthy();
  });
  test('unlock button toggles locked state', async () => {
    const tree = render(<App />);
    const el = await waitForElement(() => tree.getAllByTestId('lockedBtn'));
    fireEvent.click(el[0]);
	const secondel = await waitForElement(() => tree.getAllByTestId('lockedBtn'));
	console.log(secondel[0].textContent);
  });
});
