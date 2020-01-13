import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  const { container } = render(<App />);
  const appTextContent = container.textContent;
  expect(appTextContent)
    .toBe("ログイン状態を確認中です。少々お待ち下さい。（数秒かかることがあります）");
});
