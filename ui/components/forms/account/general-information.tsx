import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoaderCircle, Save, UserCog } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateUser } from "@/app/api/userApi";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  first_name: z.string().nonempty("First Name is required"),
  last_name: z.string().nonempty("Last Name is required"),
  email: z.string().email(),
});

type UserFormValue = z.infer<typeof formSchema>;

const GeneralInformation = () => {
  const { data: session, update } = useSession();
  const [saveBtnLoading, setSaveBtnLoading] = useState(false);

  const defaultValues = {
    first_name: session?.user?.first_name || "",
    last_name: session?.user?.last_name || "",
    email: session?.user?.email || "",
  };

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: UserFormValue) => {
    updateUserFromApi(data);
  };

  const updateUserFromApi = async (data: UserFormValue) => {
    setSaveBtnLoading(true);
    try {
      const response = await updateUser(data);
      if (response.data) {
        // reset({
        //   first_name: response.data.first_name || "",
        //   last_name: response.data.last_name || "",
        //   email: response.data.email || "",
        //   password: "",
        //   confirm_password: "",
        //   image: response.data.image || "",
        // });

        // if (response.data.image) {
        //   setImageSrc(response.data.image); // ✅ Set the image preview
        // }

        // console.log("response.data.user");
        // console.log(response.data.user);

        // ✅ Force re-fetch NextAuth session
        await update({
          ...session,
          user: {
            ...session?.user,
            first_name: response.data.user.first_name,
            last_name: response.data.user.last_name,
            email: response.data.user.email,
            // image: response.data.image,
          },
        });

        // ✅ Ensure the session refreshes completely
        // await getSession();

        toast.success("User updated successfully");
      }
    } catch (error) {
      toast.error("Error updating user");
    } finally {
      setSaveBtnLoading(false);
    }
  };

  return (
    <Card>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col h-full"
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-semibold">
              <UserCog className="w-6 h-6" />
              <span>General Information</span>
              <div className="ml-auto">
                <Button size={"sm"} type="submit" disabled={saveBtnLoading}>
                  {saveBtnLoading ? (
                    <span className="h-4 w-4 animate-spin">
                      <LoaderCircle />
                    </span>
                  ) : (
                    <Save />
                  )}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* First Name */}
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your First Name..."
                        {...field}
                        disabled={saveBtnLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Last Name */}
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your Last Name..."
                        {...field}
                        disabled={saveBtnLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Email */}
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter your Email..."
                          {...field}
                          disabled={saveBtnLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Profile Image Upload Section */}
              {/* <div className="flex flex-col justify-center items-center relative">
                        <div
                          className="relative w-40 h-40 rounded-full border border-gray-300 overflow-hidden group cursor-pointer"
                          onClick={handleImageClick}
                        >
                          <img
                            src={imageSrc}
                            alt="Profile"
                            className="w-full h-full object-cover transition-all duration-300 group-hover:blur-md"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <span className="text-white font-semibold">
                              Update Image
                            </span>
                          </div>
                        </div>

                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </div> */}
            </div>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
};

export default GeneralInformation;
