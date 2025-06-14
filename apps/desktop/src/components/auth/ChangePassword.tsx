import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { z } from 'zod';
import { trpc } from '../../lib/trpc';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

type PasswordFormData = z.infer<typeof passwordSchema>;

const ChangePassword: React.FC = () => {
  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
    },
  });

  const changePasswordMutation = trpc.auth.changePassword.useMutation({
    onSuccess: () => {
      toast.success('Password changed successfully');
      form.reset();
    },
    onError: (error) => {
      toast.error('Failed to change password', {
        description: error.message,
      });
    },
  });

  const onSubmit = (data: PasswordFormData) => {
    changePasswordMutation.mutate(data);
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Change Password</h2>
      {/* Use Form with form and onSubmit props */}
      <Form form={form} onSubmit={onSubmit}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={changePasswordMutation.isLoading}>
            {changePasswordMutation.isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Changing...
              </>
            ) : (
              'Change Password'
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ChangePassword;