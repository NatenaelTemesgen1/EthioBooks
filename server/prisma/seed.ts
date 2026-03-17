import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin' },
  });

  await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: { name: 'user' },
  });

  const categories = [
    { name: 'Fiction', slug: 'fiction', icon: 'BookOpen' },
    { name: 'Science', slug: 'science', icon: 'Atom' },
    { name: 'Technology', slug: 'technology', icon: 'Cpu' },
    { name: 'History', slug: 'history', icon: 'Clock' },
    { name: 'Biography', slug: 'biography', icon: 'User' },
  ];

  for (const cat of categories) {
    await prisma.bookCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@ethiobooks.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@ethiobooks.com',
      password: hashedPassword,
      roleId: adminRole.id,
    },
  });

  const categoryIds = await prisma.bookCategory.findMany({ select: { id: true, slug: true } }).then((c) => Object.fromEntries(c.map((x) => [x.slug, x.id])));

  const seedBooks = [
    { title: 'The Midnight Library', author: 'Matt Haig', description: 'Between life and death there is a library.', categorySlug: 'fiction', coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop', publishedYear: 2020, pages: 304 },
    { title: 'A Brief History of Time', author: 'Stephen Hawking', description: 'A landmark volume in science writing.', categorySlug: 'science', coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop', publishedYear: 1988, pages: 212 },
    { title: 'Clean Code', author: 'Robert C. Martin', description: 'Even bad code can function.', categorySlug: 'technology', coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop', publishedYear: 2008, pages: 464 },
    { title: 'Steve Jobs', author: 'Walter Isaacson', description: 'Based on more than forty interviews with Jobs.', categorySlug: 'biography', coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop', publishedYear: 2011, pages: 656 },
    { title: 'Sapiens', author: 'Yuval Noah Harari', description: 'One hundred thousand years ago, at least six different species of humans inhabited Earth.', categorySlug: 'history', coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop', publishedYear: 2011, pages: 443 },
  ];

  for (const b of seedBooks) {
    const categoryId = categoryIds[b.categorySlug];
    if (!categoryId) continue;
    const existing = await prisma.book.findFirst({ where: { title: b.title, author: b.author } });
    if (!existing) {
      await prisma.book.create({
        data: {
          title: b.title,
          author: b.author,
          description: b.description,
          categoryId,
          coverImage: b.coverImage,
          publishedYear: b.publishedYear,
          pages: b.pages,
        },
      });
    }
  }

  console.log('Seed completed: roles, categories, admin user (admin@ethiobooks.com / admin123), and sample books.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
