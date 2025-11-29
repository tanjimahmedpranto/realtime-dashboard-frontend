"use client";

import { useState } from "react";
import { ProductStatus } from "@/types/product";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useUpdateProductStatusMutation } from "@/lib/apiSlice";

interface StatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string | null;
  currentStatus: ProductStatus;
}

export function StatusDialog({
  open,
  onOpenChange,
  productId,
  currentStatus
}: StatusDialogProps) {
  const [status, setStatus] = useState<ProductStatus>(currentStatus);
  const [updateStatus, { isLoading }] = useUpdateProductStatusMutation();

  const handleSave = async () => {
    if (!productId) return;
    try {
      await updateStatus({ id: productId, status }).unwrap();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Status</DialogTitle>
          <DialogDescription>
            Update the status of this product.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <Select
            value={status}
            onValueChange={(val: ProductStatus) => setStatus(val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
