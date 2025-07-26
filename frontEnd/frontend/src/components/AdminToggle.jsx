import { useState } from 'react';

export default function AdminToggle() {
  const [autoApprove, setAutoApprove] = useState(true);

  const toggleModeration = () => {
    const newSetting = !autoApprove;
    setAutoApprove(newSetting);
    localStorage.setItem('autoModeration', JSON.stringify(newSetting));
    alert(`Auto Moderation ${newSetting ? 'Enabled' : 'Disabled'}`);
  };

  return (
    <div>
      <h4>Admin Moderation Controls</h4>
      <label>
        <input
          type="checkbox"
          checked={autoApprove}
          onChange={toggleModeration}
        />
        Auto Approve Educational Content
      </label>
    </div>
  );
}
