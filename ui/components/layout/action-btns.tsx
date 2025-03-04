import React from "react";
import { LoaderCircle, Save } from "lucide-react";
import { Button } from "../ui/button";

interface ActionBtnProps {
  handleSave: () => void;
  saveBtnLoading: boolean;
}

const ActionButtons = ({ handleSave, saveBtnLoading }: ActionBtnProps) => {
  return (
    <div className="flex justify-end gap-4 mb-4">
      <Button
        variant={"outline"}
        size={"sm"}
        onClick={handleSave}
        disabled={saveBtnLoading}
      >
        {saveBtnLoading ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : (
          <Save />
        )}
        Save
      </Button>
    </div>
  );
};

export default ActionButtons;
