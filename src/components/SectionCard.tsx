export const SectionCard = ({
  title,
  children,
  className = "",
  color = "blue",
}: any) => {

  const colorVariants: any = {
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-100",
      text: "text-blue-700",
      line: "bg-blue-600",
    },

    green: {
      bg: "bg-green-50",
      border: "border-green-100",
      text: "text-green-700",
      line: "bg-green-600",
    },

    orange: {
      bg: "bg-orange-50",
      border: "border-orange-100",
      text: "text-orange-700",
      line: "bg-orange-500",
    },

    purple: {
      bg: "bg-purple-50",
      border: "border-purple-100",
      text: "text-purple-700",
      line: "bg-purple-600",
    },
  };

  const selected = colorVariants[color];

  return (
    <div
      className={`bg-white rounded-2xl border border-gray-200 shadow-sm ${className}`}
    >

      {/* Header */}

      <div
        className={`
          px-5
          py-4
          border-b
          rounded-t-2xl
          flex
          items-center
          gap-3
          ${selected.bg}
          ${selected.border}
        `}
      >

        {/* Title */}

        <h2
          className={`font-semibold text-[15px] ${selected.text}`}
        >
          {title}
        </h2>
      </div>

      {/* Body */}

      <div className="p-5">
        {children}
      </div>
    </div>
  );
};