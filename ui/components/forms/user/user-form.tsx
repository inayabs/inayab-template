import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { LoaderCircle } from "lucide-react";
import React from "react";

const UserForm = ({
  form,
  saveBtnLoading,
  formLoading = false,
}: {
  form: any;
  saveBtnLoading: any;
  formLoading: any;
}) => {
  return (
    <div className="space-y-3">
      <FormField
        control={form.control}
        name="first_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>First name</FormLabel>
            <FormControl>
              {formLoading ? (
                <Skeleton className="h-10 w-100" />
              ) : (
                <Input
                  type="text"
                  placeholder="First name"
                  {...field}
                  disabled={saveBtnLoading}
                />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="last_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Last name</FormLabel>
            <FormControl>
              {formLoading ? (
                <Skeleton className="h-10 w-100" />
              ) : (
                <Input
                  type="text"
                  placeholder="Last name"
                  {...field}
                  disabled={saveBtnLoading}
                />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              {formLoading ? (
                <Skeleton className="h-10 w-100" />
              ) : (
                <Input
                  type="text"
                  placeholder="Email"
                  {...field}
                  disabled={saveBtnLoading}
                />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="role"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Role</FormLabel>
            {formLoading ? (
              <Skeleton className="h-10 w-100" />
            ) : (
              <Select
                disabled={saveBtnLoading}
                onValueChange={field.onChange} // Ensures the form updates when selecting a role
                value={field.value} // ✅ Make sure the selected value updates when form is reset
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                </SelectContent>
              </Select>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder="Password"
                {...field}
                disabled={saveBtnLoading}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default UserForm;
