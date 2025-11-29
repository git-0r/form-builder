import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { screen } from "@testing-library/react";
import { SubmissionsTable } from "../components/submissions/SubmissionsTable";
import { renderWithProviders } from "../test/utils";

const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
  useSearch: () => ({ page: 1, limit: 10, sortOrder: "DESC", q: "" }),
}));

vi.mock("../hooks/useSubmissions", () => ({
  useSubmissions: vi.fn(),
}));

import { useSubmissions } from "../hooks/useSubmissions";

const mockData = [
  {
    id: "12345678-abc",
    createdAt: "2025-01-01T10:00:00Z",
    data: {
      full_name: "Alice Test",
      email: "alice@test.com",
      department: "eng",
      age: 25,
    },
  },
  {
    id: "87654321-zyx",
    createdAt: "2025-01-02T14:30:00Z",
    data: {
      full_name: "Bob Test",
      email: "bob@test.com",
      department: "hr",
      age: 30,
    },
  },
];

describe("SubmissionsTable Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders table headers correctly", () => {
    (useSubmissions as Mock).mockReturnValue({
      data: { data: [], meta: { total: 0, totalPages: 0 } },
      isLoading: false,
    });

    renderWithProviders(<SubmissionsTable />);

    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Applicant")).toBeInTheDocument();
    expect(screen.getByText("Department")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();
  });

  it("renders submission data rows", () => {
    (useSubmissions as Mock).mockReturnValue({
      data: {
        data: mockData,
        meta: { total: 2, totalPages: 1 },
      },
      isLoading: false,
    });

    renderWithProviders(<SubmissionsTable />);

    // Check First Row
    expect(screen.getByText("12345678")).toBeInTheDocument(); // Sliced ID
    expect(screen.getByText("Alice Test")).toBeInTheDocument();
    expect(screen.getByText("alice@test.com")).toBeInTheDocument();
    expect(screen.getByText("eng")).toBeInTheDocument();

    // Check Second Row
    expect(screen.getByText("87654321")).toBeInTheDocument();
    expect(screen.getByText("Bob Test")).toBeInTheDocument();
  });

  it("shows empty state message when no data", () => {
    (useSubmissions as Mock).mockReturnValue({
      data: { data: [], meta: { total: 0 } },
      isLoading: false,
    });

    renderWithProviders(<SubmissionsTable />);
    expect(screen.getByText(/No submissions found/i)).toBeInTheDocument();
  });

  it("shows loading spinner when fetching", () => {
    (useSubmissions as Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    renderWithProviders(<SubmissionsTable />);
    expect(screen.getByText(/Loading records/i)).toBeInTheDocument();
  });
});
