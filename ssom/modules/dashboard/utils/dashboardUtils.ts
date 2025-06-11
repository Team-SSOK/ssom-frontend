// 시간 포맷 함수
export const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  if (diff < 60000) return '방금 전';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}분 전`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}시간 전`;
  return date.toLocaleDateString();
};

// 상태 색상 매핑
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'CRITICAL': return '#FF4444';
    case 'ERROR': return '#FF6B6B';
    case 'WARN': return '#FFB347';
    case 'PENDING': return '#FFA726';
    case 'IN_PROGRESS': return '#42A5F5';
    case 'RESOLVED': return '#66BB6A';
    default: return '#666666';
  }
}; 