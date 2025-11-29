import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import OnboardingForm from "../components/onboarding-form";
import { renderWithProviders } from "../test/utils";

const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
  useSearch: () => ({ strict: false }),
  useParams: () => ({}),
}));

vi.mock("../hooks/useFormSchema", () => ({
  useFormSchema: vi.fn(),
}));

vi.mock("../hooks/useSubmissions", () => ({
  useSubmission: vi.fn(),
}));

import { useFormSchema } from "../hooks/useFormSchema";
import { useSubmission } from "../hooks/useSubmissions";

const mockSchema = {
  title: "Test Form",
  description: "This is a test form",
  fields: [
    {
      name: "full_name",
      type: "text",
      label: "Full Name",
      placeholder: "Enter name",
      required: true,
      validation: { minLength: 3 },
    },
    {
      name: "age",
      type: "number",
      label: "Age",
      placeholder: "0",
      required: false,
    },
  ],
};

describe("OnboardingForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useFormSchema as Mock).mockReturnValue({
      data: mockSchema,
      isLoading: false,
      error: null,
    });

    (useSubmission as Mock).mockReturnValue({
      data: null, // No existing data (Create mode)
      isLoading: false,
    });
  });

  it("renders the form title and fields from schema", () => {
    renderWithProviders(<OnboardingForm />);

    expect(screen.getByText("Test Form")).toBeInTheDocument();
    expect(screen.getByText("This is a test form")).toBeInTheDocument();
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Age/i)).toBeInTheDocument();
  });

  it("shows loading state when fetching schema", () => {
    (useFormSchema as Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    renderWithProviders(<OnboardingForm />);
    expect(screen.getByText(/Loading configuration/i)).toBeInTheDocument();
  });

  it("shows validation error when submitting empty required field", async () => {
    renderWithProviders(<OnboardingForm />);

    // Click submit without filling anything
    const submitBtn = screen.getByRole("button", {
      name: /SUBMIT APPLICATION/i,
    });
    fireEvent.click(submitBtn);

    // Expect validation error for Full Name
    await waitFor(() => {
      // The error message comes from our Zod generator "This field is required"
      expect(screen.getByText(/This field is required/i)).toBeInTheDocument();
    });
  });

  it("validates minLength constraint", async () => {
    renderWithProviders(<OnboardingForm />);

    // Type "ab" (too short, min is 3)
    const nameInput = screen.getByLabelText(/Full Name/i);
    fireEvent.change(nameInput, { target: { value: "ab" } });
    fireEvent.blur(nameInput); // Trigger validation on blur

    await waitFor(() => {
      expect(screen.getByText(/Min 3 chars/i)).toBeInTheDocument();
    });
  });
});
