import { BookMarked, Users, MessageSquare, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { books, users, reviews, categories } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { RatingStars } from '@/components/book/rating-stars';

const stats = [
  {
    title: 'Total Books',
    value: books.length.toString(),
    change: '+12%',
    changeType: 'positive' as const,
    icon: BookMarked,
  },
  {
    title: 'Total Users',
    value: users.length.toString(),
    change: '+8%',
    changeType: 'positive' as const,
    icon: Users,
  },
  {
    title: 'Total Reviews',
    value: reviews.length.toString(),
    change: '+23%',
    changeType: 'positive' as const,
    icon: MessageSquare,
  },
  {
    title: 'Avg. Rating',
    value: '4.6',
    change: '-0.1',
    changeType: 'negative' as const,
    icon: TrendingUp,
  },
];

export default function AdminDashboard() {
  const recentReviews = reviews.slice(0, 5);
  const topBooks = [...books].sort((a, b) => b.averageRating - a.averageRating).slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Welcome back! Here&apos;s an overview of your platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <stat.icon className="h-6 w-6" />
                </div>
                <Badge
                  variant={stat.changeType === 'positive' ? 'default' : 'destructive'}
                  className="flex items-center gap-1"
                >
                  {stat.changeType === 'positive' ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {stat.change}
                </Badge>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Reviews */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Recent Reviews</CardTitle>
            <CardDescription>Latest reviews from users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReviews.map((review) => {
                const initials = review.user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase();

                return (
                  <div
                    key={review.id}
                    className="flex items-start gap-4 rounded-lg border border-border p-4"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={review.user.avatar} alt={review.user.name} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-foreground truncate">
                          {review.user.name}
                        </p>
                        <RatingStars rating={review.rating} size="sm" />
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {review.comment}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        on {review.book?.title}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Rated Books */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Top Rated Books</CardTitle>
            <CardDescription>Highest rated books on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topBooks.map((book, index) => (
                <div
                  key={book.id}
                  className="flex items-center gap-4 rounded-lg border border-border p-4"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
                    {index + 1}
                  </div>
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="h-14 w-10 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{book.title}</p>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                  </div>
                  <div className="text-right">
                    <RatingStars rating={book.averageRating} size="sm" showValue />
                    <p className="mt-1 text-xs text-muted-foreground">
                      {book.reviewCount} reviews
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Categories Overview</CardTitle>
          <CardDescription>Book distribution across categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between rounded-lg border border-border p-4"
              >
                <div>
                  <p className="font-medium text-foreground">{category.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {category.bookCount} books
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-accent">
                    {Math.round((category.bookCount / books.length) * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
