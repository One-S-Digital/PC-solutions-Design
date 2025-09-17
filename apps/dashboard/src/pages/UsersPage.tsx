import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UserListPage from './UserListPage';
import { UserRole } from 'packages/core/src/types';

const UsersPage: React.FC = () => {
  return (
     <Routes>
        <Route path="/" element={<UserListPage />} />
        <Route path="/all" element={<Navigate to="/users" replace />} />
        <Route path="/admins" element={<UserListPage roleFilter={UserRole.ADMIN} />} />
        <Route path="/foundations" element={<UserListPage roleFilter={UserRole.FOUNDATION} />} />
        <Route path="/suppliers" element={<UserListPage roleFilter={UserRole.PRODUCT_SUPPLIER} />} />
        <Route path="/service-providers" element={<UserListPage roleFilter={UserRole.SERVICE_PROVIDER} />} />
        <Route path="/parents" element={<UserListPage roleFilter={UserRole.PARENT} />} />
      </Routes>
  );
};

export default UsersPage;