import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function TextareaField({
  label,
  className,
  required = false,
  ...props
}) {
  return (
    <div className="grid w-full items-center gap-1.5">
      <Label className="flex items-center gap-1">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      <Textarea
        className={className ?? "bg-[#F3F3F5]"}
        required={required}
        {...props}
      />
    </div>
  );
}
