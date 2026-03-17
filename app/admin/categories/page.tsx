'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, Pencil, Search } from 'lucide-react';
import type { Category } from '@/lib/types';
import { createCategory, deleteCategory, getCategories, updateCategory } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [icon, setIcon] = useState('BookOpen');

  useEffect(() => {
    let cancelled = false;
    getCategories()
      .then((c) => {
        if (cancelled) return;
        setCategories(c);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q));
  }, [categories, search]);

  const add = async () => {
    setError(null);
    try {
      const created = await createCategory({ name, slug: slug || undefined, icon: icon || undefined });
      setCategories((prev) => [created, ...prev]);
      setName('');
      setSlug('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Create failed');
    }
  };

  const edit = async (c: Category) => {
    const nextName = prompt('Category name', c.name);
    if (!nextName) return;
    setError(null);
    try {
      const updated = await updateCategory(c.id, { name: nextName });
      setCategories((prev) => prev.map((x) => (x.id === c.id ? updated : x)));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed');
    }
  };

  const remove = async (c: Category) => {
    if (!confirm(`Delete category "${c.name}"? (Must have 0 books)`)) return;
    setError(null);
    try {
      await deleteCategory(c.id);
      setCategories((prev) => prev.filter((x) => x.id !== c.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">Categories</h1>
        <p className="mt-1 text-muted-foreground">Create, edit, and delete categories</p>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <p className="font-medium flex items-center gap-2"><Plus className="h-4 w-4" /> Add category</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Slug (optional)" value={slug} onChange={(e) => setSlug(e.target.value)} />
          <Input placeholder="Icon (optional)" value={icon} onChange={(e) => setIcon(e.target.value)} />
        </div>
        <Button onClick={add} disabled={!name.trim()}>Create</Button>
      </div>

      <div className="relative flex-1 sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search categories..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Books</TableHead>
              <TableHead className="w-40">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.name}</TableCell>
                <TableCell className="text-muted-foreground">{c.slug}</TableCell>
                <TableCell>{c.bookCount}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => edit(c)}>
                      <Pencil className="mr-1 h-4 w-4" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => remove(c)}>
                      <Trash2 className="mr-1 h-4 w-4" /> Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

