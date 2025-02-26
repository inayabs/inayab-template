"use client";

import ActionButtons from "@/components/layout/action-btns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KeyRound, Lock, Upload, UserCog } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getUser, updateUser } from "@/app/api/userApi";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { getSession, useSession } from "next-auth/react";
import GeneralInformation from "@/components/forms/account/general-information";
import PasswordInformation from "@/components/forms/account/password-information";
import ManageTwoFactor from "@/components/forms/account/two-factor";
import Alerts from "@/components/forms/account/alerts";

const formSchema = z
  .object({
    first_name: z.string().nonempty("First Name is required"),
    last_name: z.string().nonempty("Last Name is required"),
    email: z.string().email(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .optional()
      .or(z.literal("")), // ✅ Allows empty value without validation
    confirm_password: z.string().optional(),
    image: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.password && !data.confirm_password) {
        return false;
      }
      return true;
    },
    {
      message: "Confirm Password is required if Password is entered",
      path: ["confirm_password"],
    }
  )
  .refine(
    (data) => {
      if (data.password && data.confirm_password) {
        return data.password === data.confirm_password;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirm_password"],
    }
  );

type UserFormValue = z.infer<typeof formSchema>;

const Page = () => {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(true);
  const [saveBtnLoading, setSaveBtnLoading] = useState(false);
  const [defaultValues, setDefaultValues] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    image: "",
  });
  // const defaultValues = {
  //   first_name: "",
  //   last_name: "",
  //   email: "",
  //   password: "",
  //   confirm_password: "",
  //   image: "",
  // };

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { reset, setValue } = form;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState(
    "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
  );

  // Handle file input click
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle image change
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          const base64String = reader.result as string;
          setImageSrc(base64String);
          form.setValue("image", base64String); // ✅ Store Base64 in form data
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    form.handleSubmit(onSubmit)();
  };

  const onSubmit = async (data: UserFormValue) => {
    updateUserFromApi(data);
  };

  const fetchUser = async () => {
    try {
      const response = await getUser();
      if (response.data) {
        reset({
          first_name: response.data.first_name || "",
          last_name: response.data.last_name || "",
          email: response.data.email || "",
          password: "",
          confirm_password: "",
          image: response.data.image || "",
        });

        if (response.data.image) {
          setImageSrc(response.data.image); // ✅ Set the image preview
        }
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
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

        if (response.data.image) {
          setImageSrc(response.data.image); // ✅ Set the image preview
        }

        // console.log("response.data.user");
        // console.log(response.data.user);

        // ✅ Force re-fetch NextAuth session
        await update({
          ...session,
          user: {
            ...session?.user,
            first_name: response.data.user.first_name,
            last_name: response.data.user.last_name,
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
      setLoading(false);
      setSaveBtnLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div>
      {/* <ActionButtons handleSave={handleSave} saveBtnLoading={saveBtnLoading} /> */}
      <div className="grid xl:grid-cols-2 gap-6 grid-flow-row">
        <div className="space-y-6">
          <GeneralInformation />
          <PasswordInformation />
        </div>
        <div className="space-y-6">
          <ManageTwoFactor />
          <Alerts />
        </div>
      </div>
    </div>
  );
};

export default Page;
