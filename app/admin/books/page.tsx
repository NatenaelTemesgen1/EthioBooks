'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Plus, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import type { Book, Category } from '@/lib/types';
import { createBook, deleteBook, getBooks, getCategories, updateBook } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RatingStars } from '@/components/book/rating-stars';

export default function AdminBooksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Book | null>(null);
  const [form, setForm] = useState({
    title: '',
    author: '',
    description: '',
    categoryId: '',
    coverImage: '',
    publishedYear: '',
    pages: '',
  });

  useEffect(() => {
    let cancelled = false;
    // Backend enforces max limit 50 via validation
    Promise.all([getBooks({ limit: 50 }), getCategories()])
      .then(([b, c]) => {
        if (cancelled) return;
        setBooks(b.items);
        setCategories(c);
        setForm((f) => ({ ...f, categoryId: c[0]?.id ?? '' }));
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredBooks = useMemo(() => books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' || book.categoryId === categoryFilter;
    return matchesSearch && matchesCategory;
  }), [books, searchQuery, categoryFilter]);

  const openCreate = () => {
    setEditing(null);
    setForm({
      title: '',
      author: '',
      description: '',
      categoryId: categories[0]?.id ?? '',
      coverImage: '',
      publishedYear: '',
      pages: '',
    });
    setShowForm(true);
  };

  const openEdit = (b: Book) => {
    setEditing(b);
    setForm({
      title: b.title ?? '',
      author: b.author ?? '',
      description: b.description ?? '',
      categoryId: b.categoryId ?? '',
      coverImage: b.coverImage ?? '',
      publishedYear: b.publishedYear ? String(b.publishedYear) : '',
      pages: b.pages ? String(b.pages) : '',
    });
    setShowForm(true);
  };

  const submit = async () => {
    setError(null);
    try {
      const payload = {
        title: form.title,
        author: form.author,
        description: form.description,
        categoryId: form.categoryId,
        coverImage: form.coverImage || undefined,
        publishedYear: form.publishedYear ? Number(form.publishedYear) : undefined,
        pages: form.pages ? Number(form.pages) : undefined,
      };
      const saved = editing ? await updateBook(editing.id, payload) : await createBook(payload);
      setBooks((prev) => {
        const next = prev.filter((x) => x.id !== saved.id);
        return [saved, ...next];
      });
      setShowForm(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    }
  };

  const uploadCover = async (file: File) => {
    setError(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message ?? 'Upload failed');
      setForm((f) => ({ ...f, coverImage: data.url ?? '' }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this book?')) return;
    setError(null);
    try {
      await deleteBook(id);
      setBooks((prev) => prev.filter((b) => b.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
            Books
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage your book collection
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Book
        </Button>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {showForm && (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium">{editing ? 'Edit Book' : 'Add Book'}</p>
            <Button variant="ghost" onClick={() => setShowForm(false)}>Close</Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Input placeholder="Author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
            <Input placeholder="Cover image URL (optional)" value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} />
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void uploadCover(file);
              }}
            />
            <Input placeholder="Published year (optional)" value={form.publishedYear} onChange={(e) => setForm({ ...form, publishedYear: e.target.value })} />
            <Input placeholder="Pages (optional)" value={form.pages} onChange={(e) => setForm({ ...form, pages: e.target.value })} />
            <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Input
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="flex gap-2">
            <Button onClick={submit}>{editing ? 'Save Changes' : 'Create Book'}</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-45">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Book</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Reviews</TableHead>
              <TableHead className="w-12.5"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBooks.map((book) => (
              <TableRow key={book.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="h-12 w-8 rounded object-cover"
                    />
                    <span className="font-medium">{book.title}</span>
                  </div>
                </TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{book.category.name}</Badge>
                </TableCell>
                <TableCell>
                  <RatingStars rating={book.averageRating} size="sm" showValue />
                </TableCell>
                <TableCell>{book.reviewCount}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(book)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => remove(book.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredBooks.length} of {books.length} books
      </p>
    </div>
  );
}
