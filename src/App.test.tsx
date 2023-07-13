import {
  render,
  screen,
  queryByAttribute,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import ReactLoader from "./components/ReactLoader";
import userEvent from '@testing-library/user-event'
import DataHandler from "../public/DataHandler";

window.dbConnection = new DataHandler();
window.controls = {isSingleInstance: () => {return true}};

const getByClass = queryByAttribute.bind(null, "class");
jest.mock("../mocks/electronMock.js");


test("newNote", async () => {
  const view = render(<ReactLoader />);
  const newNoteButton = getByClass(view.container, "newNoteButton");
  fireEvent.click(newNoteButton!);
  const entryBar = getByClass(view.container, "entryBarInput");
  fireEvent.click(entryBar!);
  fireEvent.change(entryBar!, { target: { value: "new note" } });
  fireEvent.keyUp(entryBar!, { key: "Enter", code: "Enter", charCode: 13 });
  const noteName = getByClass(view.container, "fileEntry selectedEntry");
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  
  await waitFor(() => {
      expect(screen.getByText('new note')).toBeInTheDocument();
  }, {timeout: 3000});

});

test("editNote", async () => {
  const user = userEvent.setup();
  const view = render(<ReactLoader />);
  const editable = getByClass(view.container, "editable");
  fireEvent.focus(editable!);
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  
  await waitFor(() => {
    const noteButton = screen.queryByText('new note');
    user.click(noteButton!);
  });
  await userEvent.type(editable!, "{enter}*test* ", {delay: 200});

  await waitFor(() => {
    setTimeout(() => expect(editable?.innerHTML).toMatch(/<em>test<\/em>.*/i), 500)
  }, {timeout: 1000});
});


test("rename", async () => {
  const user = userEvent.setup();
  const view = render(<ReactLoader />);
  const fileEntry = await screen.findAllByText("new note");
  user.click(fileEntry[0]);
  const editNoteNameButton =  screen.getAllByLabelText("edit note name")
  
  editNoteNameButton.forEach((x: any) => {
    fireEvent.click(x)
    const entryBar = getByClass(view.container, "entryBarInput");
    fireEvent.focus(entryBar!);
    fireEvent.change(entryBar!, {target: {value: "new note edit"}});
    user.type(entryBar!, "{enter}")
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  await waitFor(() => {
    expect(screen.getByText('new note edit')).toBeInTheDocument();
});
});

test("deleteNote", async () => {
  const view = render(<ReactLoader />);
  const fileEntry = await screen.findAllByText(/new note.*/i);
  fireEvent.click(fileEntry![0]);
  const deleteButton = getByClass(view.container, "deleteNoteButton red");
  fileEntry.forEach(x => {
    fireEvent.click(x);
    fireEvent.click(deleteButton!);
  })
    expect(screen.queryByText("new note edit")).not.toBeInTheDocument();
});
