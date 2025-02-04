import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from 'react';

interface EditCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignId: string;
  campaignName: string;
  campaignStatus: string;
  metrics: {
    target: {
      conversions: number;
    };
  };
}

const EditCampaignDialog = ({ 
  open, 
  onOpenChange,
  campaignId,
  campaignName,
  campaignStatus,
  metrics
}: EditCampaignDialogProps) => {
  const [formData, setFormData] = useState({
    name: campaignName,
    status: campaignStatus,
    targetConversions: metrics.target.conversions,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to update the campaign
    console.log('Updating campaign:', formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-indigo-950/95 border-purple-500/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-purple-100">Edit Campaign</DialogTitle>
          <DialogDescription className="text-purple-300">
            Make changes to your campaign settings here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-purple-100">Campaign Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-indigo-950/50 border-purple-500/20 text-purple-100"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium text-purple-100">Status</Label>
              <Select 
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger className="bg-indigo-950/50 border-purple-500/20 text-purple-100">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-indigo-950/95 border-purple-500/20">
                  <SelectItem value="active" className="text-purple-100">Active</SelectItem>
                  <SelectItem value="paused" className="text-purple-100">Paused</SelectItem>
                  <SelectItem value="completed" className="text-purple-100">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetConversions" className="text-sm font-medium text-purple-100">Target Conversions</Label>
              <Input
                id="targetConversions"
                type="number"
                value={formData.targetConversions}
                onChange={(e) => setFormData(prev => ({ ...prev, targetConversions: parseInt(e.target.value) }))}
                className="bg-indigo-950/50 border-purple-500/20 text-purple-100"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-purple-500/20 text-purple-100 hover:bg-purple-500/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 text-white hover:bg-purple-700"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCampaignDialog;
