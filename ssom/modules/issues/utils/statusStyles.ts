import { Colors } from '@/constants/Colors';

type ColorScheme = typeof Colors.light;

type StatusStyle = {
  text: string;
  color: string;
};

export const getStatusStyle = (status: string, colors: ColorScheme): StatusStyle => {
  const upperStatus = status.toUpperCase();

  switch (upperStatus) {
    case 'NEW':
      return { text: '신규', color: colors.info };
    case 'IN_PROGRESS':
    case 'OPEN':
      return { text: '진행중', color: colors.info };
    case 'RESOLVED':
    case 'CLOSED':
      return { text: '해결', color: colors.resolved };
    case 'CRITICAL':
      return { text: '심각', color: colors.critical };
    default:
      return { text: status, color: colors.textSecondary };
  }
}; 