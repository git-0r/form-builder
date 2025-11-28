interface BackgroundLayoutProps {
  children: React.ReactNode;
}

export const BackgroundLayout = ({ children }: BackgroundLayoutProps) => {
  return (
    <div className="min-h-screen w-full bg-white relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "#ffffff",
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.35) 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
      />
      <div className="relative z-20">{children}</div>
    </div>
  );
};
