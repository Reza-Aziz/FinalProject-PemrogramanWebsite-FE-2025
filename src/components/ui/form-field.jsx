import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

export function FormField({
  label,
  required,
  optionalLabel,
  error,
  children,
  className,
  ...props
}) {
  return (
    <div className="grid w-full items-center gap-1.5">
      <Label className="flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
        {!required && optionalLabel && (
          <span className="text-gray-500 text-xs">(optional)</span>
        )}
      </Label>

      {children ? (
        <>
          {children}
          {error && <p className="text-sm text-red-500">{error}</p>}
        </>
      ) : (
        <Input
          className={className ?? "bg-[#F3F3F5]"}
          required={required}
          {...props}
        />
      )}
    </div>
  );
}
