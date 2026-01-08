from django.db import migrations


def seed_books(apps, schema_editor):
    Book = apps.get_model('books', 'Book')
    
    books_data = [
        {
            'title': '1984',
            'author': 'George Orwell',
            'description': 'A dystopian novel set in a totalitarian society ruled by Big Brother. The story follows Winston Smith, a low-ranking member of the Party, who begins to question the oppressive regime.',
            'isbn': '9780451524935',
            'published_date': '1949-06-08',
            'page_count': 328,
            'genre': 'Dystopian Fiction',
            'cover_image_url': 'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg'
        },
        {
            'title': 'To Kill a Mockingbird',
            'author': 'Harper Lee',
            'description': 'A classic novel about racial injustice in the American South, seen through the eyes of young Scout Finch. Her father, Atticus, defends a Black man accused of a crime.',
            'isbn': '9780061120084',
            'published_date': '1960-07-11',
            'page_count': 336,
            'genre': 'Southern Gothic',
            'cover_image_url': 'https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg'
        },
        {
            'title': 'The Great Gatsby',
            'author': 'F. Scott Fitzgerald',
            'description': 'A story of the mysteriously wealthy Jay Gatsby and his obsessive love for Daisy Buchanan, set against the backdrop of the Roaring Twenties.',
            'isbn': '9780743273565',
            'published_date': '1925-04-10',
            'page_count': 180,
            'genre': 'Literary Fiction',
            'cover_image_url': 'https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg'
        },
        {
            'title': 'Pride and Prejudice',
            'author': 'Jane Austen',
            'description': 'A romantic novel following Elizabeth Bennet as she navigates issues of manners, morality, and marriage in Georgian-era England.',
            'isbn': '9780141439518',
            'published_date': '1813-01-28',
            'page_count': 432,
            'genre': 'Romance',
            'cover_image_url': 'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg'
        },
        {
            'title': 'The Catcher in the Rye',
            'author': 'J.D. Salinger',
            'description': 'A story about teenage alienation and loss of innocence, narrated by the cynical and troubled Holden Caulfield.',
            'isbn': '9780316769488',
            'published_date': '1951-07-16',
            'page_count': 277,
            'genre': 'Literary Fiction',
            'cover_image_url': 'https://covers.openlibrary.org/b/isbn/9780316769488-L.jpg'
        },
        {
            'title': 'One Hundred Years of Solitude',
            'author': 'Gabriel Garcia Marquez',
            'description': 'A landmark of magical realism, telling the multi-generational story of the Buendia family in the fictional town of Macondo.',
            'isbn': '9780060883287',
            'published_date': '1967-05-30',
            'page_count': 417,
            'genre': 'Magical Realism',
            'cover_image_url': 'https://covers.openlibrary.org/b/isbn/9780060883287-L.jpg'
        },
        {
            'title': 'The Hobbit',
            'author': 'J.R.R. Tolkien',
            'description': 'A fantasy adventure following Bilbo Baggins as he joins a group of dwarves on a quest to reclaim their homeland from the dragon Smaug.',
            'isbn': '9780547928227',
            'published_date': '1937-09-21',
            'page_count': 300,
            'genre': 'Fantasy',
            'cover_image_url': 'https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg'
        },
        {
            'title': 'Brave New World',
            'author': 'Aldous Huxley',
            'description': 'A dystopian novel envisioning a future society controlled through genetic engineering, conditioning, and a pleasure drug called soma.',
            'isbn': '9780060850524',
            'published_date': '1932-01-01',
            'page_count': 288,
            'genre': 'Dystopian Fiction',
            'cover_image_url': 'https://covers.openlibrary.org/b/isbn/9780060850524-L.jpg'
        },
        {
            'title': 'The Lord of the Rings',
            'author': 'J.R.R. Tolkien',
            'description': 'An epic high-fantasy novel following the hobbit Frodo Baggins on his quest to destroy the One Ring and defeat the Dark Lord Sauron.',
            'isbn': '9780544003415',
            'published_date': '1954-07-29',
            'page_count': 1178,
            'genre': 'Fantasy',
            'cover_image_url': 'https://covers.openlibrary.org/b/isbn/9780544003415-L.jpg'
        },
        {
            'title': 'Crime and Punishment',
            'author': 'Fyodor Dostoevsky',
            'description': 'A psychological novel about a poor student who commits murder and struggles with his conscience, exploring themes of morality and redemption.',
            'isbn': '9780143058144',
            'published_date': '1866-01-01',
            'page_count': 671,
            'genre': 'Psychological Fiction',
            'cover_image_url': 'https://covers.openlibrary.org/b/isbn/9780143058144-L.jpg'
        },
        {
            'title': 'The Brothers Karamazov',
            'author': 'Fyodor Dostoevsky',
            'description': 'A passionate philosophical novel exploring faith, doubt, and morality through the story of three brothers and their father\'s murder.',
            'isbn': '9780374528379',
            'published_date': '1880-11-01',
            'page_count': 796,
            'genre': 'Philosophical Fiction',
            'cover_image_url': 'https://covers.openlibrary.org/b/isbn/9780374528379-L.jpg'
        },
        {
            'title': 'Don Quixote',
            'author': 'Miguel de Cervantes',
            'description': 'The story of a man who loses his sanity from reading too many chivalric romances and sets out as a knight-errant with his loyal squire Sancho Panza.',
            'isbn': '9780060934347',
            'published_date': '1605-01-16',
            'page_count': 1023,
            'genre': 'Satire',
            'cover_image_url': 'https://covers.openlibrary.org/b/isbn/9780060934347-L.jpg'
        },
        {
            'title': 'War and Peace',
            'author': 'Leo Tolstoy',
            'description': 'An epic novel that interweaves the lives of aristocratic families against the backdrop of Napoleon\'s invasion of Russia, exploring themes of love, war, and the meaning of life.',
            'isbn': '9780143039990',
            'published_date': '1869-01-01',
            'page_count': 1225,
            'genre': 'Historical Fiction',
            'cover_image_url': 'https://covers.openlibrary.org/b/isbn/9780143039990-L.jpg'
        },
    ]
    
    for book_data in books_data:
        Book.objects.create(**book_data)


def remove_books(apps, schema_editor):
    Book = apps.get_model('books', 'Book')
    Book.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ('books', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_books, remove_books),
    ]
