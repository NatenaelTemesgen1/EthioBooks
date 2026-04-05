import type { Book, Category, Review, User, Testimonial } from './types';

export const categories: Category[] = [
  { id: '1', name: 'Fiction', slug: 'fiction', icon: 'BookOpen', bookCount: 245 },
  { id: '2', name: 'Science', slug: 'science', icon: 'Atom', bookCount: 189 },
  { id: '3', name: 'Technology', slug: 'technology', icon: 'Cpu', bookCount: 156 },
  { id: '4', name: 'Biography', slug: 'biography', icon: 'User', bookCount: 134 },
  { id: '5', name: 'History', slug: 'history', icon: 'Clock', bookCount: 198 },
  { id: '6', name: 'Philosophy', slug: 'philosophy', icon: 'Brain', bookCount: 87 },
];

export const users: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    role: 'user',
    reviewCount: 47,
    favoriteBooks: ['1', '3', '5'],
    joinedAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    role: 'user',
    reviewCount: 32,
    favoriteBooks: ['2', '4'],
    joinedAt: '2024-02-20',
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    role: 'admin',
    reviewCount: 89,
    favoriteBooks: ['1', '2', '3', '4', '5'],
    joinedAt: '2023-11-10',
  },
  {
    id: '4',
    name: 'James Wilson',
    email: 'james@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    role: 'user',
    reviewCount: 23,
    favoriteBooks: ['3', '6'],
    joinedAt: '2024-03-05',
  },
];

export const books: Book[] = [
  {
    id: '1',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    description: 'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices.',
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
    categoryId: '1',
    category: categories[0],
    averageRating: 4.5,
    reviewCount: 128,
    publishedYear: 2020,
    pages: 304,
  },
  {
    id: '2',
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    description: 'A landmark volume in science writing by one of the great minds of our time, Stephen Hawking explores such profound questions as: How did the universe begin—and what made its start possible?',
    coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop',
    categoryId: '2',
    category: categories[1],
    averageRating: 4.8,
    reviewCount: 256,
    publishedYear: 1988,
    pages: 212,
  },
  {
    id: '3',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    description: 'Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees. This book presents a revolutionary paradigm with Clean Code.',
    coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop',
    categoryId: '3',
    category: categories[2],
    averageRating: 4.7,
    reviewCount: 189,
    publishedYear: 2008,
    pages: 464,
  },
  {
    id: '4',
    title: 'Steve Jobs',
    author: 'Walter Isaacson',
    description: 'Based on more than forty interviews with Jobs conducted over two years—as well as interviews with more than a hundred family members, friends, and colleagues—Walter Isaacson has written a riveting story.',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
    categoryId: '4',
    category: categories[3],
    averageRating: 4.6,
    reviewCount: 342,
    publishedYear: 2011,
    pages: 656,
  },
  {
    id: '5',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    description: 'One hundred thousand years ago, at least six different species of humans inhabited Earth. Today there is only one: Homo sapiens. What happened to the others? And what may happen to us?',
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
    categoryId: '5',
    category: categories[4],
    averageRating: 4.9,
    reviewCount: 478,
    publishedYear: 2011,
    pages: 443,
  },
  {
    id: '6',
    title: 'Meditations',
    author: 'Marcus Aurelius',
    description: 'Written in Greek by the only Roman emperor who was also a philosopher, without any intention of publication, the Meditations of Marcus Aurelius offer a remarkable series of challenging spiritual reflections.',
    coverImage: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&h=600&fit=crop',
    categoryId: '6',
    category: categories[5],
    averageRating: 4.7,
    reviewCount: 167,
    publishedYear: 180,
    pages: 256,
  },
  {
    id: '7',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan. A portrait of the Jazz Age in all of its decadence and excess.',
    coverImage: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop',
    categoryId: '1',
    category: categories[0],
    averageRating: 4.4,
    reviewCount: 523,
    publishedYear: 1925,
    pages: 180,
  },
  {
    id: '8',
    title: 'The Design of Everyday Things',
    author: 'Don Norman',
    description: 'Even the smartest among us can feel inept as we fail to figure out which light switch or oven burner to turn on, or whether to push, pull, or slide a door. The fault lies not in ourselves, but in product design.',
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=600&fit=crop',
    categoryId: '3',
    category: categories[2],
    averageRating: 4.5,
    reviewCount: 234,
    publishedYear: 1988,
    pages: 368,
  },
];

export const reviews: Review[] = [
  {
    id: '1',
    userId: '1',
    user: users[0],
    bookId: '1',
    book: books[0],
    rating: 5,
    comment: 'Absolutely beautiful and thought-provoking. This book made me reflect on my own life choices and the paths not taken. A must-read for anyone going through a quarter-life or mid-life crisis.',
    createdAt: '2024-03-15',
    helpful: 45,
  },
  {
    id: '2',
    userId: '2',
    user: users[1],
    bookId: '2',
    book: books[1],
    rating: 5,
    comment: 'Hawking manages to explain the most complex concepts of physics in a way that anyone can understand. A masterpiece of science communication.',
    createdAt: '2024-03-10',
    helpful: 67,
  },
  {
    id: '3',
    userId: '3',
    user: users[2],
    bookId: '3',
    book: books[2],
    rating: 4,
    comment: 'Essential reading for any software developer. While some examples feel dated, the principles remain timeless. Changed how I approach code quality.',
    createdAt: '2024-03-08',
    helpful: 89,
  },
  {
    id: '4',
    userId: '4',
    user: users[3],
    bookId: '5',
    book: books[4],
    rating: 5,
    comment: 'A sweeping narrative that changed how I view human history. Harari connects dots across millennia in ways that are both illuminating and humbling.',
    createdAt: '2024-03-01',
    helpful: 112,
  },
  {
    id: '5',
    userId: '1',
    user: users[0],
    bookId: '4',
    book: books[3],
    rating: 4,
    comment: 'Fascinating look into the mind of a visionary. Isaacson doesn\'t shy away from Jobs\' flaws, making this biography feel authentic and balanced.',
    createdAt: '2024-02-25',
    helpful: 34,
  },
  {
    id: '6',
    userId: '2',
    user: users[1],
    bookId: '6',
    book: books[5],
    rating: 5,
    comment: 'Timeless wisdom from nearly 2000 years ago. These reflections on life, duty, and inner peace are as relevant today as they were in ancient Rome.',
    createdAt: '2024-02-20',
    helpful: 78,
  },
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Alexandra Rivers',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
    comment: 'EthioBooks has completely transformed how I discover new reads. The community recommendations are spot-on, and I\'ve found so many hidden gems!',
    rating: 5,
    role: 'Avid Reader',
  },
  {
    id: '2',
    name: 'Marcus Thompson',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop',
    comment: 'As someone who reads 50+ books a year, this platform helps me track everything and connect with like-minded readers. Absolutely love it!',
    rating: 5,
    role: 'Book Club Organizer',
  },
  {
    id: '3',
    name: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop',
    comment: 'The review quality here is exceptional. Unlike other platforms, EthioBooks fosters thoughtful discussions about literature.',
    rating: 5,
    role: 'Literature Professor',
  },
];

export function getBookById(id: string): Book | undefined {
  return books.find(book => book.id === id);
}

export function getBooksByCategory(categorySlug: string): Book[] {
  const category = categories.find(c => c.slug === categorySlug);
  if (!category) return [];
  return books.filter(book => book.categoryId === category.id);
}

export function getReviewsByBookId(bookId: string): Review[] {
  return reviews.filter(review => review.bookId === bookId);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug);
}

export function searchBooks(query: string): Book[] {
  const lowercaseQuery = query.toLowerCase();
  return books.filter(
    book =>
      book.title.toLowerCase().includes(lowercaseQuery) ||
      book.author.toLowerCase().includes(lowercaseQuery) ||
      book.category.name.toLowerCase().includes(lowercaseQuery)
  );
}
