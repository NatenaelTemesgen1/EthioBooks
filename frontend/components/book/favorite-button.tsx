'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { addFavorite, getFavoriteStatus, removeFavorite } from '@/lib/api';

export function FavoriteButton({ bookId }: { bookId: string }) {
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getFavoriteStatus(bookId)
      .then((r) => {
        if (cancelled) return;
        setIsFavorite(!!r.isFavorite);
      })
      .catch(() => {
        // Not logged in or request failed: treat as not favorited.
        if (cancelled) return;
        setIsFavorite(false);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [bookId]);

  const toggle = async () => {
    setError(null);
    try {
      setLoading(true);
      if (isFavorite) {
        await removeFavorite(bookId);
        setIsFavorite(false);
      } else {
        await addFavorite(bookId);
        setIsFavorite(true);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button className="flex-1" variant={isFavorite ? 'default' : 'outline'} disabled={loading} onClick={toggle}>
        <Heart className="mr-2 h-4 w-4" />
        {isFavorite ? 'Favorited' : 'Add to Favorites'}
      </Button>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}

