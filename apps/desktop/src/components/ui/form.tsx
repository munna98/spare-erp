import * as React from 'react';
import {
  Controller,
  ControllerProps,
  FormProvider,
  useFormContext,
  UseFormReturn,
  FieldValues,
  SubmitHandler
} from 'react-hook-form';
import { cn } from '@/lib/utils';

interface FormProps<T extends FieldValues> 
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
}

const Form = <T extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
  ...props
}: FormProps<T>) => {
  return (
    <FormProvider {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className={cn('space-y-6', className)} 
        {...props}
      >
        {children}
      </form>
    </FormProvider>
  );
};
Form.displayName = 'Form';

// Form item wrapper
const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('space-y-2', className)} {...props} />
));
FormItem.displayName = 'FormItem';

// Label
const FormLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      className
    )}
    {...props}
  />
));
FormLabel.displayName = 'FormLabel';

// Control container (for inputs etc.)
const FormControl = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => <div ref={ref} {...props} />);
FormControl.displayName = 'FormControl';

// Description text
const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
FormDescription.displayName = 'FormDescription';

// Error message
const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { formState } = useFormContext();
  const error = formState.errors[props.id as string];
  
  return (
    <p
      ref={ref}
      className={cn('text-sm font-medium text-destructive', className)}
      {...props}
    >
      {error?.message as React.ReactNode}
      {children}
    </p>
  );
});
FormMessage.displayName = 'FormMessage';

// FormField wrapper using Controller
function FormField<T extends FieldValues>({
  ...props
}: ControllerProps<T>) {
  return <Controller {...props} />;
}

export {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};