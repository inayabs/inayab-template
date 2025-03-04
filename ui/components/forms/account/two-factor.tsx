import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { KeyRound } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { updateTwoFactor } from "@/app/api/authApi";

const ManageTwoFactor = () => {
  const { data: session, update } = useSession(); // ✅ Use `update` to modify session state
  const twoFactorEnabled = session?.user?.two_factor ?? false;

  const [alert, setAlert] = useState(twoFactorEnabled);
  const [openDialog, setOpenDialog] = useState(false);
  const [pendingState, setPendingState] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ Sync switch state when session updates
  useEffect(() => {
    // console.log("twoFactorEnabled");
    // console.log(session);
    setAlert(twoFactorEnabled);
  }, [twoFactorEnabled]);

  // ✅ Show alert dialog before updating switch
  const handleAlert = (checked: boolean) => {
    setPendingState(checked); // Save state change, apply after confirmation
    setOpenDialog(true);
  };

  // ✅ Confirm the update and apply changes
  const confirmUpdate = async () => {
    if (pendingState === null) return;
    setLoading(true);

    try {
      // ✅ Send request to update 2FA in backend
      await updateTwoFactor({ two_factor: pendingState });

      // ✅ Update session with new 2FA state
      await update({
        ...session,
        user: { ...session?.user, two_factor: pendingState },
      });

      // ✅ Update local state
      setAlert(pendingState);
      setOpenDialog(false);
      toast.success(
        pendingState
          ? "Two-factor authentication enabled"
          : "Two-factor authentication disabled"
      );
    } catch (error) {
      console.error("Failed to update 2FA:", error);
      toast.error("Failed to update two-factor authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
          <KeyRound className="w-6 h-6" />
          <span>Manage two-factor authentication</span>
          <div className="ml-auto">
            <Switch
              id="notifSwitch"
              onCheckedChange={handleAlert} // ✅ Show confirmation before toggling
              checked={alert}
              disabled={!session || loading} // ✅ Disable while API request is in progress
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Here you can manage the two-factor e-mail addresses you have
            registered on your account. These e-mail addresses will also receive
            any two-factor codes when you log into your account.
          </p>
          <p className="text-sm text-muted-foreground">
            If you would like to change your primary e-mail address, please
            contact arm@ccpc.com.au
          </p>
          <p>
            <span className="text-sm font-medium">
              Primary E-mail address:{" "}
            </span>
            <span className="text-sm text-muted-foreground">
              {session?.user?.email ?? "Loading..."}
            </span>
          </p>
        </div>
      </CardContent>

      {/* ✅ Confirmation Dialog */}
      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingState
                ? "Enable Two-Factor Authentication?"
                : "Disable Two-Factor Authentication?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingState
                ? "Enabling 2FA will require an additional authentication step when logging in. Are you sure?"
                : "Disabling 2FA will remove this extra layer of security. Proceed with caution!"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmUpdate} disabled={loading}>
              {loading ? "Updating..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default ManageTwoFactor;
