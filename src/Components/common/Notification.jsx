import { useSelector } from 'react-redux';

const Notification = () => {
  const notification = useSelector((state) => state.notification);

  if (!notification) return null;

  const bgColor = notification.type === 'success' ? 'bg-green-500'
    : notification.type === 'error' ? 'bg-red-500'
    : notification.type === 'info' ? 'bg-blue-500'
    : 'bg-transparent';

  return (
    <div className={`fixed top-4 right-4 p-3 rounded-lg z-50 text-white ${bgColor}`}>
      {notification.message}
    </div>
  );
};

export default Notification;
