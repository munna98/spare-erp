import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, User, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '../../lib/trpc';
import { useAuthStore } from '../../store/auth';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthStore();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      login({
        token: data.token,
        user: data.user,
      });
      toast.success(data.message || 'Login successful');
    },
    onError: (error) => {
      toast.error('Login failed', {
        description: error.message || 'Please check your credentials and try again.',
      });
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Card className="w-full max-w-md shadow-lg border-0 bg-white">
      <CardHeader className="space-y-1 pb-6">
        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-blue-100 rounded-full mb-4">
          <User className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-semibold text-center text-gray-900">
          Sign In
        </h2>
        <p className="text-center text-gray-600">
          Enter your credentials to access the system
        </p>
      </CardHeader>

      <CardContent>
        {/* Use Form with required form and onSubmit props */}
        <Form form={form} onSubmit={onSubmit}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 h-11"
                        disabled={loginMutation.isLoading}
                      />
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className="pl-10 pr-10 h-11"
                        disabled={loginMutation.isLoading}
                      />
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                        disabled={loginMutation.isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              disabled={loginMutation.isLoading}
            >
              {loginMutation.isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </div>
        </Form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need access? Contact your system administrator
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;