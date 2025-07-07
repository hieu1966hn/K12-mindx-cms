

import React, { memo } from 'react';
import type { LucideProps } from 'lucide-react';

interface BadgeProps {
  children: React.ReactNode; // Nội dung văn bản của badge.
  colorScheme?: 'gray' | 'orange' | 'blue' | 'green' | 'yellow'; // Bảng màu để xác định màu nền và màu chữ.
  icon?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>; // Component icon tùy chọn để hiển thị bên cạnh văn bản.
}

/**
 * Component Badge là một thành phần UI tái sử dụng để hiển thị các thông tin ngắn, nổi bật
 * như trạng thái, tag, hoặc thuộc tính (ví dụ: Năm học, Độ tuổi).
 * `memo` được sử dụng để tối ưu hóa, ngăn component render lại nếu props không thay đổi.
 */
export const Badge: React.FC<BadgeProps> = memo(({ children, colorScheme = 'gray', icon: Icon }) => {
  // Đối tượng ánh xạ `colorScheme` với các lớp CSS của Tailwind.
  // Điều này giúp dễ dàng thay đổi và mở rộng các bảng màu.
  const colorStyles = {
    gray: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    // Bảng màu mới theo yêu cầu
    orange: 'bg-[#F6931E]/20 text-[#C37418] dark:bg-[#F6931E]/20 dark:text-[#F6931E]', // Year
    blue: 'bg-[#27AAE1]/20 text-[#1C779D] dark:bg-[#27AAE1]/20 dark:text-[#27AAE1]', // Age Group
    green: 'bg-[#5DBD22]/20 text-[#428A18] dark:bg-[#5DBD22]/20 dark:text-[#5DBD22]', // Language
    yellow: 'bg-[#F3CC0B]/20 text-[#B89B08] dark:bg-[#F3CC0B]/20 dark:text-[#F3CC0B]', // Tools
  };

  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full ${colorStyles[colorScheme]}`}>
      {/* Hiển thị icon nếu được cung cấp */}
      {Icon && <Icon size={14} className="opacity-80" />}
      {children}
    </span>
  );
});