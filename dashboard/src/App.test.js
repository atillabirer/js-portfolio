import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import renderer from "react-test-renderer";


test('renders models', () => {
  const tree = renderer.create(<App/>);
  setTimeout(() => {
    console.log(tree.toJSON())
  },2000)
});
