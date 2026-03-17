import { prisma } from '../prisma';
import { ApiError } from '../utils/ApiError';
import * as bookService from './bookService';

export async function getCategories() {
  const categories = await prisma.bookCategory.findMany({
    include: { _count: { select: { books: true } } },
    orderBy: { name: 'asc' },
  });
  return categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    icon: c.icon ?? 'BookOpen',
    bookCount: c._count.books,
  }));
}

export async function getCategoryById(id: string) {
  const c = await prisma.bookCategory.findUnique({
    where: { id },
    include: { _count: { select: { books: true } } },
  });
  if (!c) throw new ApiError('Category not found', 404);
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    icon: c.icon ?? 'BookOpen',
    bookCount: c._count.books,
  };
}

export async function getBooksByCategoryId(
  categoryId: string,
  query: { page?: number; limit?: number; search?: string }
) {
  const c = await prisma.bookCategory.findUnique({ where: { id: categoryId } });
  if (!c) throw new ApiError('Category not found', 404);
  return bookService.getBooks({ ...query, categoryId });
}

export async function createCategory(data: { name: string; slug?: string; icon?: string }) {
  const slug = data.slug ?? data.name.toLowerCase().replace(/\s+/g, '-');
  const existing = await prisma.bookCategory.findFirst({
    where: { OR: [{ slug }, { name: data.name }] },
  });
  if (existing) throw new ApiError('Category with this name or slug already exists', 400);

  const category = await prisma.bookCategory.create({
    data: {
      name: data.name,
      slug,
      icon: data.icon ?? null,
    },
  });
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    icon: category.icon ?? 'BookOpen',
    bookCount: 0,
  };
}

export async function updateCategory(id: string, data: { name?: string; slug?: string; icon?: string }) {
  const existing = await prisma.bookCategory.findUnique({ where: { id } });
  if (!existing) throw new ApiError('Category not found', 404);

  const nextName = data.name ?? existing.name;
  const nextSlug = data.slug ?? (data.name ? data.name.toLowerCase().replace(/\s+/g, '-') : existing.slug);

  const conflict = await prisma.bookCategory.findFirst({
    where: {
      AND: [
        { id: { not: id } },
        { OR: [{ name: nextName }, { slug: nextSlug }] },
      ],
    },
  });
  if (conflict) throw new ApiError('Category with this name or slug already exists', 400);

  const updated = await prisma.bookCategory.update({
    where: { id },
    data: {
      ...(data.name != null && { name: data.name }),
      ...(nextSlug != null && { slug: nextSlug }),
      ...(data.icon !== undefined && { icon: data.icon ?? null }),
    },
  });

  const count = await prisma.book.count({ where: { categoryId: updated.id } });
  return {
    id: updated.id,
    name: updated.name,
    slug: updated.slug,
    icon: updated.icon ?? 'BookOpen',
    bookCount: count,
  };
}

export async function deleteCategory(id: string) {
  const existing = await prisma.bookCategory.findUnique({
    where: { id },
    include: { _count: { select: { books: true } } },
  });
  if (!existing) throw new ApiError('Category not found', 404);
  if (existing._count.books > 0) throw new ApiError('Cannot delete category with books', 400);
  await prisma.bookCategory.delete({ where: { id } });
  return { success: true };
}
