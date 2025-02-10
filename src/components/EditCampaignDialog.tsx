import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from 'react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { CampaignState } from '../pages/CampaignsPage';

interface EditCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignId: string;
  campaignName: string;
  campaignStatus: string;
  metrics: CampaignState['metrics'];
  onEditCampaign: (id: number, updates: Partial<CampaignState>) => void;
}

const EditCampaignDialog = ({ 
  open, 
  onOpenChange,
  campaignId,
  campaignName,
  campaignStatus,
  metrics,
  onEditCampaign
}: EditCampaignDialogProps) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: campaignName,
    status: campaignStatus,
    targetConversions: metrics.target.conversions,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEditCampaign(parseInt(campaignId), {
      name: formData.name,
      status: formData.status as CampaignState['status'],
      metrics: {
        ...metrics,
        target: {
          conversions: formData.targetConversions
        }
      }
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "sm:max-w-[500px] border",
        theme === 'dark'
          ? "bg-indigo-950/95 border-purple-500/20"
          : "bg-white border-gray-200"
      )}>
        <DialogHeader>
          <DialogTitle className={cn(
            "text-2xl font-semibold",
            theme === 'dark' ? "text-purple-100" : "text-gray-900"
          )}>Edit Campaign</DialogTitle>
          <DialogDescription className={cn(
            theme === 'dark' ? "text-purple-300" : "text-gray-500"
          )}>
            Make changes to your campaign settings here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className={cn(
                "text-sm font-medium",
                theme === 'dark' ? "text-purple-100" : "text-gray-700"
              )}>Campaign Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={cn(
                  "border",
                  theme === 'dark'
                    ? "bg-indigo-950/50 border-purple-500/20 text-purple-100"
                    : "bg-white border-gray-200 text-gray-900"
                )}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status" className={cn(
                "text-sm font-medium",
                theme === 'dark' ? "text-purple-100" : "text-gray-700"
              )}>Status</Label>
              <Select 
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger className={cn(
                  "border",
                  theme === 'dark'
                    ? "bg-indigo-950/50 border-purple-500/20 text-purple-100"
                    : "bg-white border-gray-200 text-gray-900"
                )}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className={cn(
                  "border",
                  theme === 'dark'
                    ? "bg-indigo-950/95 border-purple-500/20"
                    : "bg-white border-gray-200"
                )}>
                  <SelectItem value="active" className={theme === 'dark' ? "text-purple-100" : "text-gray-900"}>Active</SelectItem>
                  <SelectItem value="paused" className={theme === 'dark' ? "text-purple-100" : "text-gray-900"}>Paused</SelectItem>
                  <SelectItem value="completed" className={theme === 'dark' ? "text-purple-100" : "text-gray-900"}>Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetConversions" className={cn(
                "text-sm font-medium",
                theme === 'dark' ? "text-purple-100" : "text-gray-700"
              )}>Target Conversions</Label>
              <Input
                id="targetConversions"
                type="number"
                value={formData.targetConversions}
                onChange={(e) => setFormData(prev => ({ ...prev, targetConversions: parseInt(e.target.value) }))}
                className={cn(
                  "border",
                  theme === 'dark'
                    ? "bg-indigo-950/50 border-purple-500/20 text-purple-100"
                    : "bg-white border-gray-200 text-gray-900"
                )}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className={cn(
                "border",
                theme === 'dark'
                  ? "border-purple-500/20 text-purple-100 hover:bg-purple-500/10"
                  : "border-gray-200 text-gray-700 hover:bg-gray-100"
              )}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={cn(
                theme === 'dark'
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              )}
            >
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCampaignDialog;
