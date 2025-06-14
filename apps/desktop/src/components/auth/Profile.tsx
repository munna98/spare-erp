import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { z } from 'zod';
import { trpc } from '../../lib/trpc';
import { useAuthStore } from '../../store/auth';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const Profile: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const utils = trpc.useUtils();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
    },
  });

  const updateProfileMutation = trpc.auth.updateProfile.useMutation({
    onSuccess: (data) => {
      updateUser(data);
      toast.success('Profile updated successfully');
      utils.auth.me.invalidate();
    },
    onError: (error) => {
      toast.error('Failed to update profile', {
        description: error.message,
      });
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
      {/* Use Form with form and onSubmit props */}
      <Form form={form} onSubmit={onSubmit}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={updateProfileMutation.isLoading}>
            {updateProfileMutation.isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Profile'
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Profile;