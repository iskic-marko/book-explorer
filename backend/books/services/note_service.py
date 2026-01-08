from django.contrib.auth.models import User
from ..models import Book, UserNote


class NoteNotFoundError(Exception):
    pass


class NotePermissionError(Exception):
    pass


class NoteService:
    def get_user_notes(self, user: User, book_id: int = None):
        queryset = UserNote.objects.filter(user=user)
        if book_id:
            queryset = queryset.filter(book_id=book_id)
        return queryset

    def create_note(self, user: User, book_id: int, content: str) -> UserNote:
        book = Book.objects.get(id=book_id)
        return UserNote.objects.create(
            user=user,
            book=book,
            content=content
        )

    def update_note(self, user: User, note_id: int, content: str) -> UserNote:
        note = self._get_user_note(user, note_id)
        note.content = content
        note.save()
        return note

    def delete_note(self, user: User, note_id: int) -> None:
        note = self._get_user_note(user, note_id)
        note.delete()

    def _get_user_note(self, user: User, note_id: int) -> UserNote:
        try:
            note = UserNote.objects.get(id=note_id)
        except UserNote.DoesNotExist:
            raise NoteNotFoundError('Note not found.')

        if note.user != user:
            raise NotePermissionError('You do not have permission to access this note.')

        return note
