import {Component, OnInit} from '@angular/core';
import {ApiService} from '../shared/api.service';
import {Note} from './model/note';
import {Notebook} from './model/notebook';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
  notebooks: Notebook[] = [];
  notes: Note[] = [];
  selectedNotebook: Notebook;
  searchText: string;

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    this.getAllNotebooks();
    this.getAllNotes();
  }

  public getLengthNotes(): number {
      return this.notes.length;
  }

  public getAllNotebooks() {
    this.apiService.getAllNotebooks().subscribe(
      res => {
        this.notebooks = res;
      },
      _err => {
        alert('An error has occurred');
      }
    );
  }

  getAllNotes() {
    this.apiService.getAllNotes().subscribe(
      res => {
        this.notes = res;
      },
    _err => { alert('Error occurred while downloading the notes'); }
    );
  }

  createNotebook() {
    const newNotebook: Notebook = {
      name: 'Nuevo cuaderno',
      id: null,
      nbOfNotes: 0
    };

    this.apiService.postNotebook(newNotebook).subscribe(
      res => {
        newNotebook.id = res.id;
        this.notebooks.push(newNotebook);
      },
      _err => { alert('An error has occurred while saving the notebook'); }
    );

  }

  updateNotebook(updatedNotebook: Notebook) {
    this.apiService.postNotebook(updatedNotebook).subscribe(
      _res => {

      },
      _err => { alert('An error has occurred while saving the notebook'); }
    );
  }

  deleteNotebook(notebook: Notebook) {
    if (confirm('Are you sure you want to delete notebook?')) {
      this.apiService.deleteNotebook(notebook.id).subscribe(
        _res => {
          const indexOfNotebook = this.notebooks.indexOf(notebook);
          this.notebooks.splice(indexOfNotebook, 1);
        },
        _err => {
          alert('Could not delete notebook');
        }
      );
    }
  }

  deleteNote(note: Note) {
    if (confirm('Are you sure you want to delete this note?')) {
      this.apiService.deleteNote(note.id).subscribe(
        _res => {
          const indexOfNote = this.notes.indexOf(note);
          this.notes.splice(indexOfNote, 1);
        },
        _err => { alert('An error has occurred deleting the note'); }
      );
    }
  }

  createNote(notebookId: string) {
    const newNote: Note = {
      id: null,
      title: 'Nueva nota',
      text: 'Escribe algo aqui',
      lastModifiedOn: null,
      notebookId: notebookId
    };

    this.apiService.saveNote(newNote).subscribe(
      res => {
        newNote.id = res.id;
        this.notes.push(newNote);
      },
      _err => { alert('An error occurred while saving the note'); }
    );
  }

  selectNotebook(notebook: Notebook) {
    this.selectedNotebook = notebook;
    this.apiService.getNotesByNotebook(notebook.id).subscribe(
      res => {
        this.notes = res;
      },
      _err => { alert('An error has occurred while downloading the notes'); }
    );
  }

  updateNote(updatedNote: Note) {
    this.apiService.saveNote(updatedNote).subscribe(
      _res => {
      },
      _err => { alert('An error occurred while saving the note'); }
    );
  }

  selectAllNotes() {
    this.selectedNotebook = null;
    this.getAllNotes();
  }
}
