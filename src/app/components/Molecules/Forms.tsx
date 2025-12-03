import React from "react";
import Field from "../Atoms/Fields";
import Button from "../Atoms/Buttons";
import type { LoginPayload, RegisterPayload } from "../../interface/auth";

interface FormFieldConfig {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  variant?: "outlined" | "filled" | "standard";
}

interface FormProps {
  fields: FormFieldConfig[];
  values: Record<string, string>;
  errors?: Record<string, string>;
  onChange: (name: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitText?: string;
  isLoading?: boolean;
  submitVariant?: "primary" | "secondary" | "outline" | "danger";
  children?: React.ReactNode;
}

export function Form({
  fields,
  values,
  errors = {},
  onChange,
  onSubmit,
  submitText = "Submit",
  isLoading = false,
  submitVariant = "primary",
  children,
}: FormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {fields.map((field) => (
        <Field
          key={field.name}
          name={field.name}
          type={field.type || "text"}
          label={field.label}
          placeholder={field.placeholder}
          helperText={field.helperText}
          error={errors[field.name]}
          value={values[field.name] || ""}
          onChange={(e) => onChange(field.name, e.target.value)}
          required={field.required}
          variant={field.variant}
          fullWidth
        />
      ))}

      {children}

      <Button
        type="submit"
        variant={submitVariant}
        fullWidth
        isLoading={isLoading}
      >
        {submitText}
      </Button>
    </form>
  );
}

// Login Form Component
interface LoginFormProps {
  onSubmit: (data: LoginPayload) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export function LoginForm({ onSubmit, isLoading, error }: LoginFormProps) {
  const [values, setValues] = React.useState<LoginPayload>({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(values);
  };

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Form
      fields={[
        {
          name: "email",
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
          required: true,
        },
        {
          name: "password",
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
          required: true,
        },
      ]}
      values={values}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitText="Login"
      isLoading={isLoading}
    >
      {error && <p className="text-sm text-red-600">{error}</p>}
    </Form>
  );
}

// Register Form Component
interface RegisterFormProps {
  onSubmit: (data: RegisterPayload) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export function RegisterForm({
  onSubmit,
  isLoading,
  error,
}: RegisterFormProps) {
  const [values, setValues] = React.useState<RegisterPayload>({
    fName: "",
    lName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match
    const newErrors: Record<string, string> = {};
    if (values.password !== values.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (values.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      await onSubmit(values);
    }
  };

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <Form
      fields={[
        {
          name: "fName",
          label: "First Name",
          placeholder: "Enter your first name",
          required: true,
        },
        {
          name: "lName",
          label: "Last Name",
          placeholder: "Enter your last name",
          required: true,
        },
        {
          name: "email",
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
          required: true,
        },
        {
          name: "password",
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
          helperText: "Must be at least 8 characters",
          required: true,
        },
        {
          name: "confirmPassword",
          label: "Confirm Password",
          type: "password",
          placeholder: "Confirm your password",
          required: true,
        },
      ]}
      values={values}
      errors={errors}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitText="Create Account"
      isLoading={isLoading}
    >
      {error && <p className="text-sm text-red-600">{error}</p>}
    </Form>
  );
}