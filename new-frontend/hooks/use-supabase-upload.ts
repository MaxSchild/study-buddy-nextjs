"use client";

import { useCallback, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export interface SupabaseUploadFile {
  name: string;
  size: number;
  type: string;
  file: File;
  preview?: string;
  errors: { message: string }[];
}

export interface UseSupabaseUploadReturn {
  files: SupabaseUploadFile[];
  setFiles: (files: SupabaseUploadFile[]) => void;
  onUpload: () => Promise<void>;
  loading: boolean;
  successes: string[];
  errors: { name: string; message: string }[];
  maxFileSize: number;
  maxFiles: number;
  allowedMimeTypes: string[];
  isSuccess: boolean;
  isDragActive: boolean;
  isDragReject: boolean;
  getRootProps: (props?: React.HTMLAttributes<HTMLDivElement>) => React.HTMLAttributes<HTMLDivElement>;
  getInputProps: (props?: React.InputHTMLAttributes<HTMLInputElement>) => React.InputHTMLAttributes<HTMLInputElement>;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

interface UseSupabaseUploadOptions {
  bucketName: string;
  path: string;
  allowedMimeTypes?: string[];
  maxFiles?: number;
  maxFileSize?: number;
}

export function useSupabaseUpload({
  bucketName,
  path,
  allowedMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  maxFiles = 1,
  maxFileSize = 10 * 1024 * 1024, // 10MB
}: UseSupabaseUploadOptions): UseSupabaseUploadReturn {
  const [files, setFiles] = useState<SupabaseUploadFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [successes, setSuccesses] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ name: string; message: string }[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isDragReject] = useState(false); // Not used, but kept for interface compatibility
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onUpload = useCallback(async () => {
    setLoading(true);
    setErrors([]);
    setSuccesses([]);
    setIsSuccess(false);
    const supabase = createClient();
    const uploaded: string[] = [];
    const uploadErrors: { name: string; message: string }[] = [];
    for (const fileObj of files) {
      if (fileObj.errors.length > 0) continue;
      const { error } = await supabase.storage.from(bucketName).upload(`${path}/${fileObj.name}`, fileObj.file, {
        cacheControl: "3600",
        upsert: true,
      });
      if (error) {
        uploadErrors.push({ name: fileObj.name, message: error.message });
      } else {
        uploaded.push(fileObj.name);
      }
    }
    setSuccesses(uploaded);
    setErrors(uploadErrors);
    setIsSuccess(uploaded.length > 0 && uploadErrors.length === 0);
    setLoading(false);
  }, [files, bucketName, path]);

  const getRootProps = (
    props: React.HTMLAttributes<HTMLDivElement> = {}
  ): React.HTMLAttributes<HTMLDivElement> => ({
    ...props,
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragActive(true);
    },
    onDragLeave: (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragActive(false);
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragActive(false);
      const droppedFiles = Array.from(e.dataTransfer.files);
      handleFiles(droppedFiles);
    },
    tabIndex: 0,
    role: "button",
  });

  const getInputProps = (
    props: React.InputHTMLAttributes<HTMLInputElement> = {}
  ): React.InputHTMLAttributes<HTMLInputElement> => ({
    ...props,
    type: "file",
    multiple: maxFiles > 1,
    accept: allowedMimeTypes.join(","),
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []);
      handleFiles(selectedFiles);
    },
    style: { display: "none" },
  });

  function handleFiles(selectedFiles: File[]) {
    let newFiles: SupabaseUploadFile[] = [];
    for (const file of selectedFiles) {
      const errors: { message: string }[] = [];
      if (!allowedMimeTypes.includes(file.type)) {
        errors.push({ message: "Invalid file type" });
      }
      if (file.size > maxFileSize) {
        errors.push({ message: `File is larger than ${maxFileSize / 1024 / 1024}MB` });
      }
      newFiles.push({
        name: file.name,
        size: file.size,
        type: file.type,
        file,
        errors,
      });
    }
    if (newFiles.length + files.length > maxFiles) {
      newFiles = newFiles.slice(0, maxFiles - files.length);
    }
    setFiles([...files, ...newFiles]);
  }

  return {
    files,
    setFiles,
    onUpload,
    loading,
    successes,
    errors,
    maxFileSize,
    maxFiles,
    allowedMimeTypes,
    isSuccess,
    isDragActive,
    isDragReject,
    getRootProps,
    getInputProps,
    inputRef,
  };
} 