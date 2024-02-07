'use client';

import { useSignIn, useUser } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, loginSchemaType } from 'Schema/authentication';
import { Button } from 'components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'components/ui/form';
import { Input } from 'components/ui/input';
import { toast } from 'components/ui/use-toast';
import { updateCustomerAccessToken } from 'lib/shopify';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ImSpinner2 } from 'react-icons/im';
import * as z from 'zod';
export default function SignInForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) router.push('/');
  }, [router, isSignedIn]);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (values: loginSchemaType) => {
    if (!isLoaded) {
      return;
    }
    const { email, password } = values;
    // Start the sign-in process using the email and password provided
    try {
      const completeSignIn = await signIn.create({
        identifier: email,
        password
      });

      if (completeSignIn.status !== 'complete') {
        // The status can also be `needs_factor_on', 'needs_factor_two', or 'needs_identifier'
        // Please see https://clerk.com/docs/references/react/use-sign-in#result-status for  more information
        toast({
          title: completeSignIn.status as string,
          description: 'Something went wrong, please try again later!',
          variant: 'destructive'
        });
      }

      if (completeSignIn.status === 'complete') {
        // SHOPIFY ADD ON
        if (email && password) await updateCustomerAccessToken({ email, password });
        // If complete, user exists and provided password match -- set session active
        await setActive({ session: completeSignIn.createdSessionId });
        // send data to database
        // Redirect the user to a post sign-in route
        router.push('/');
      }
    } catch (err: any) {
      console.log(err);
      err?.errors.map((error: any) => {
        toast({
          title: `${err.status} | ${error.message}`,
          description: error.longMessage,
          variant: 'destructive'
        });
      });
      // This can return an array of errors.
      // See https://clerk.com/docs/custom-flows/error-handling to learn about error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // Display a form to capture the user's email and password
  return (
    <div className="mt-10 flex min-h-[50vh] w-full flex-col items-center justify-center rounded-lg bg-primary">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="w-[300px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="w-[300px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center pt-5 ">
            <Button
              className="w-[75%] bg-accent"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {!form.formState.isSubmitting && <span>Login</span>}
              {form.formState.isSubmitting && <ImSpinner2 className="animate-spin" />}
            </Button>
          </div>
        </form>
      </Form>
      <p className="m-5 w-full text-center text-sm">
        Don`&apos;t have an Account?
        <Link className="ml-2 text-blue-400 hover:underline" href="/sign-up">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
