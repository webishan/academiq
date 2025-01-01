'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ReportDialogProps {
	postId?: string;
	commentId?: string;
	trigger: React.ReactNode;
}

export function ReportDialog({ postId, commentId, trigger }: ReportDialogProps) {
	// TODO: Himel -  add the code here
}
