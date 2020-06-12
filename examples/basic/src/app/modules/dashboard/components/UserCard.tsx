import React from 'react';

interface UserCardProps {
  firstName: string;
  lastName: string;
}

export const UserCard = ({ firstName, lastName }: UserCardProps) => {
  return (
    <div
      style={{
        width: 200,
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
        border: '1px solid #eee',
        padding: 16,
        borderRadius: 3,
        margin: 16,
      }}>
      <p>
        <strong>First Name:</strong> {firstName}
      </p>
      <p>
        <strong>Last Name:</strong> {lastName}
      </p>
    </div>
  );
};
