import { FieldError } from "react-hook-form";
import { AlertCircle } from "lucide-react";

type InputFieldProps = {
  label: string;
  type?: string;
  register: any;
  name: string;
  defaultValue?: string;
  error?: FieldError;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  required?: boolean;
};

const InputField = ({
  label,
  type = "text",
  register,
  name,
  defaultValue,
  error,
  inputProps,
  required = false,
}: InputFieldProps) => {
  return (
    <div className="flex flex-col gap-2 w-full group">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          {...register(name)}
          className={`
            w-full px-4 py-2.5 rounded-lg border-2 
            transition-all duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-offset-0
            ${error 
              ? "border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50" 
              : "border-gray-200 focus:border-ciano focus:ring-ciano/20 hover:border-gray-300"
            }
          `}
          {...inputProps}
          defaultValue={defaultValue}
        />
        {error && (
          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
        )}
      </div>
      {error?.message && (
        <p className="text-xs text-red-500 flex items-center gap-1 animate-fadeIn">
          <AlertCircle className="w-3 h-3" />
          {error.message.toString()}
        </p>
      )}
    </div>
  );
};

export default InputField;