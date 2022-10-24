import React from 'react';
import { render, screen, queryByAttribute, fireEvent, prettyDOM } from '@testing-library/react';
import App from './App';
import { keyboard } from '@testing-library/user-event/dist/keyboard';
import userEvent from '@testing-library/user-event';


const view = render(<App />);
const getByClass = queryByAttribute.bind(null, "class")

test('newNote', () => {

  const newNoteButton = getByClass(view.container, 'newNoteButton');
  newNoteButton && fireEvent.click(newNoteButton)
  const entryBar = getByClass(view.container, 'entryBarInput');
  entryBar && fireEvent.change(entryBar, {target: {value: "nieuwe note"}})
  entryBar && fireEvent.keyDown(entryBar, {key: "Enter", code: "Enter"})
  const noteName = getByClass(view.container, 'fileEntry selectedEntry');
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  expect(noteName?.textContent).toBe("nieuwe note");
});


test('editNote', async () => {
  const view = render(<App />);
  const noteName = getByClass(view.container, 'fileEntry');
  fireEvent.click(noteName!);
  const editable = getByClass(view.container, 'editable rightContainer');
  userEvent.click(editable!)
  userEvent.keyboard("*test*")
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  expect(editable?.innerHTML).toBe("\u200b<em>test</em>\u200b");
});

test('deleteNote', () => {
  const view = render(<App />);
  const noteName = getByClass(view.container, 'fileEntry');
  fireEvent.click(noteName!);
  const deleteButton = getByClass(view.container, 'deleteNoteButton')
  fireEvent.click(deleteButton!);
  const fileList = getByClass(view.container, 'fileList')
  expect(fileList?.children.length).toBe(0);


})