import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { ControllerRenderProps, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCreateReview } from './useReview';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import StarRating from '../ui/StarRating';
import { Button } from '../ui/button';
import { useSession } from 'next-auth/react';

interface ReviewFormProps {
  productId: string;
  productSlug: string;
  onSuccess?: () => void;
}

type FormValues = {
  rating: number;
  title: string;
  comment: string;
  name?: string;
  email?: string;
};

const ReviewForm = ({ productId, productSlug, onSuccess }: ReviewFormProps) => {
  const { data: session } = useSession();
  const isSignedIn = !!session?.user;

  const { mutate: createReview, isPending } = useCreateReview();

  const currentSchema = React.useMemo(() => {
    if (isSignedIn) {
      return z.object({
        rating: z.number().min(1, 'Please select a rating'),
        title: z.string().min(3, 'Title must be at least 3 characters'),
        comment: z.string().min(10, 'Comment must be at least 10 characters'),
        name: z.string().optional(),
        email: z.string().optional(),
      });
    } else {
      return z.object({
        rating: z.number().min(1, 'Please select a rating'),
        title: z.string().min(3, 'Title must be at least 3 characters'),
        comment: z.string().min(10, 'Comment must be at least 10 characters'),
        name: z.string().min(2, 'Name must be at least 2 characters'),
        email: z.string().email('Please enter a valid email address'),
      });
    }
  }, [isSignedIn]);

  const form = useForm<FormValues>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      rating: 0,
      title: "",
      comment: "",
      name: "",
      email: ""
    }
  });

  const onSubmit = (data: FormValues) => {
    const reviewData = {
      rating: data.rating,
      title: data.title,
      comment: data.comment,
      userName: isSignedIn
        ? (session?.user.name ?? 'Anonymous')
        : (data.name ?? 'Anonymous'),
      userEmail: isSignedIn
        ? (session?.user.email ?? '')
        : (data.email ?? '')
    };

    createReview({
      productId,
      productSlug,
      reviewData
    }, {
      onSuccess: () => {
        form.reset();
        onSuccess?.();
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {isSignedIn && (
          <div className="bg-gray-50 p-3 rounded border">
            <p className="text-sm text-gray-600">
              Reviewing as: <span className="font-medium">{session?.user?.name || 'Anonymous'}</span>
            </p>
            <p className="text-sm text-gray-600">
              Email: <span className="font-medium">{session?.user?.email}</span>
            </p>
          </div>
        )}

        <FormField
          control={form.control}
          name="rating"
          render={({ field }: { field: ControllerRenderProps<FormValues, "rating"> }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <StarRating
                  rating={field.value}
                  setRating={(rating) => field.onChange(rating)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }: { field: ControllerRenderProps<FormValues, "title"> }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Review title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }: { field: ControllerRenderProps<FormValues, "comment"> }) => (
            <FormItem>
              <FormLabel>Comment</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Your review comment"
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!isSignedIn && (
          <>
            <FormField
              control={form.control}
              name="name"
              render={({ field }: { field: ControllerRenderProps<FormValues, "name"> }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }: { field: ControllerRenderProps<FormValues, "email"> }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Your email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default ReviewForm;