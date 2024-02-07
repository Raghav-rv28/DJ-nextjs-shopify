'use client';

import { useAuth, useSignUp } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, signUpSchemaType } from 'Schema/authentication';
import { Button } from 'components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'components/ui/form';
import { Input } from 'components/ui/input';
import { toast } from 'components/ui/use-toast';
import { createCustomerFunction } from 'lib/shopify';
import { createUserInDB } from 'lib/shopify/actions.ts/user';
import { createCustomerInput } from 'lib/shopify/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { ImSpinner2 } from 'react-icons/im';
import * as z from 'zod';

export default function Page() {
  const { isLoaded: signUpStatus, signUp, setActive } = useSignUp();
  const [verifying, setVerifying] = React.useState(false);
  const [values, setValues] = React.useState<createCustomerInput>({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    phone: ''
  });
  const [code, setCode] = React.useState('');
  const [phoneCode, setPhoneCode] = React.useState('');
  const router = useRouter();
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema)
  });
  const { isLoaded, userId } = useAuth();

  // Send user to home page if already signed in.
  React.useEffect(() => {
    if (userId !== null && isLoaded) {
      router.push('/');
    }
  }, [userId, isLoaded, router]);

  // This function will handle the user submitting their email and password
  const onSubmit = async (values: signUpSchemaType) => {
    if (!signUpStatus) return;
    const { email, password, firstName, lastName, phone } = values;
    // SHOPIFY ADD ON
    setValues({
      firstName,
      lastName,
      email,
      password,
      phone
    });
    // Start the sign-up process using the email and password provided
    try {
      await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
        phoneNumber: phone
      });

      const valReturned = await createCustomerFunction(values);
      if (valReturned.customerCreate.customerUserErrors.length > 0) {
        valReturned.customerCreate.customerUserErrors.map(
          (val: { code: string; field: Array<string>; message: string }) => {
            toast({
              title: `${val.code} - ${val.field}`,
              description: val.message
            });
          },
          []
        );
        throw new Error('something wrong while creating shopify user account');
      } else {
        // Send the user an email with the verification code
        await signUp.prepareEmailAddressVerification({
          strategy: 'email_code'
        });

        await signUp.preparePhoneNumberVerification({
          strategy: 'phone_code'
        });
        // Set 'verifying' true to display second form and capture the OTP code
        setVerifying(true);
      }
    } catch (err: any) {
      // This can return an array of errors.
      // See https://clerk.com/docs/custom-flows/error-handling to learn about error handling
      console.error('Error:', JSON.stringify(err, null, 2));
      err.errors.map((error: any) => {
        toast({
          title: `${err.status} | ${JSON.stringify(error.meta)} ${error.message}`,
          description: error.longMessage,
          variant: 'destructive'
        });
      });
    }
  };

  // This function will handle the user submitting a code for verification
  const handleVerify = async () => {
    if (!signUpStatus) return;

    try {
      // Submit the code that the user provides to attempt verification
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code
      });

      const completePhoneSignUp = await signUp.attemptPhoneNumberVerification({
        code: phoneCode
      });
      // The status can also be `abandoned` or `missing_requirements`
      // Please see https://clerk.com/docs/references/react/use-sign-up#result-status for  more information
      if (completeSignUp.status !== 'complete') {
        console.log(JSON.stringify(completeSignUp, null, 2));
      }
      if (completePhoneSignUp.status !== 'complete') {
        console.log(JSON.stringify(completePhoneSignUp, null, 2));
      }
      if (completeSignUp.status === 'complete' && completePhoneSignUp.status === 'complete') {
        //save user details
        createUserInDB({
          firstName: values.firstName,
          email: values.email,
          lastName: values.lastName,
          phone: values.phone,
          password: values.password
        });
        // Check the status to see if it is complete
        // If complete, the user has been created -- set the session active
        await setActive({ session: completeSignUp.createdSessionId });
        // Redirect the user to a post sign-up route
        router.push(`/`);
      }
    } catch (err: any) {
      console.log('Error:', JSON.stringify(err));
      err.errors.map((error: any) => {
        toast({
          title: `${err.status} | ${error.message}`,
          description: error.longMessage,
          variant: 'destructive'
        });
      });
      // This can return an array of errors.
      // See https://clerk.com/docs/custom-flows/error-handling to learn about error handling
    }
  };

  // Once the sign-up form was submitted, verifying was set to true and as a result, this verification form is presented to the user to input their verification code.
  if (verifying) {
    return (
      <div className="mt-10 flex min-h-[50vh] w-full flex-col items-center justify-center rounded-lg bg-primary">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleVerify)} className="space-y-2">
            <FormField
              name="firstName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email: Verification Code</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={code}
                      id="email_code"
                      name="email_code"
                      onChange={(e) => setCode(e.target.value)}
                    />
                  </FormControl>
                  <FormLabel>Phone Verification Code</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={phoneCode}
                      id="phone_code"
                      name="phone_code"
                      onChange={(e) => setPhoneCode(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center pt-5">
              <Button className="w-[75%]" type="submit">
                Complete Sign Up
              </Button>
            </div>
          </form>
        </Form>
      </div>
    );
  }

  // Display the initial sign-up form to capture the email and password
  return (
    <div className="mt-10 flex min-h-[50vh] w-full flex-col items-center justify-center rounded-lg bg-primary">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <div className="flex flex-col flex-wrap justify-between md:flex-row ">
            <FormField
              name="firstName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input id="firstName" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="lastName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="md:ml-3">Last Name</FormLabel>
                  <FormControl>
                    <Input id="lastName" {...field} className="md:ml-2" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="phone"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone No.</FormLabel>
                <FormControl>
                  <Input type="text" defaultValue={'+1'} inputMode="numeric" {...field} />
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
                  <Input type="password" {...field} />
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
              {!form.formState.isSubmitting && <span>Sign Up</span>}
              {form.formState.isSubmitting && <ImSpinner2 className="animate-spin" />}
            </Button>
          </div>
        </form>
        <p className="m-5 w-full text-center text-base">
          Already have an Account?
          <Link className="ml-2 rounded-md p-2 text-blue-400 hover:underline" href="/sign-in">
            Login In
          </Link>
        </p>
      </Form>
    </div>
  );
}
