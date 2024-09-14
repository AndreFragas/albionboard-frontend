import {cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import renderer from 'react-test-renderer';
import {CloseButton} from 'src/@prismafive/components/buttons/close-button';

afterEach(() => {
  cleanup();
});

test('execute onClick when clicked', () => {
  render(<CloseButton onClick={() => console.log('clicked!')} />);
  const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  const element = screen.getByTestId('CloseButton');
  expect(element).toBeInTheDocument();

  fireEvent.click(element);

  expect(consoleLogSpy).toHaveBeenCalledWith('clicked!');

  expect(element).toContainHTML('<button');
});

test('matches snapshot', () => {
  const tree = renderer.create(<CloseButton />).toJSON();
  expect(tree).toMatchSnapshot();
});
