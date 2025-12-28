"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, CheckCircle2, Flag } from "lucide-react";

export function ReportIssueDialog() {
    const [open, setOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitted(true);
        }, 1500);
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            // Reset state when closed after a slight delay
            setTimeout(() => {
                setSubmitted(false);
            }, 300);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Flag className="w-4 h-4" />
                    Report a mismatch / request review
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                {submitted ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-2">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <DialogTitle>Report Submitted</DialogTitle>
                        <DialogDescription>
                            Thank you for helping us verify our data. Our team will review your report within 48 hours.
                        </DialogDescription>
                        <Button onClick={() => setOpen(false)} className="mt-4">Close</Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>Report an Issue</DialogTitle>
                            <DialogDescription>
                                Found a mismatch or incorrect data? Let us know so we can fix it.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="company">Company Name</Label>
                                <Input id="company" placeholder="e.g. Acme Corp" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="issue-type">Issue Type</Label>
                                <Select required>
                                    <SelectTrigger id="issue-type">
                                        <SelectValue placeholder="Select issue type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="wrong_company">Wrong Company Linked</SelectItem>
                                        <SelectItem value="outdated_info">Outdated Information</SelectItem>
                                        <SelectItem value="duplicate">Duplicate Entry</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="details">Details</Label>
                                <Textarea
                                    id="details"
                                    placeholder="Please describe the issue..."
                                    className="min-h-[100px]"
                                    required
                                />
                            </div>
                            <div className="bg-muted/50 p-3 rounded-md flex gap-2 text-xs text-muted-foreground">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <p>We verify all reports against public records before making changes.</p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Submitting..." : "Submit Report"}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
