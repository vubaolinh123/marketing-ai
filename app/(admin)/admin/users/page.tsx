'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { adminUserApi, type AdminUser } from '@/lib/api';
import { showError, showSuccess } from '@/lib/toast';
import dynamic from 'next/dynamic';

const Pagination = dynamic(() => import('../article/list/_components/Pagination'), { ssr: false });

interface CreateUserFormState {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: 'user' | 'admin';
    isActive: boolean;
}

interface EditUserFormState {
    id: string;
    name: string;
    isActive: boolean;
    newPassword: string;
    confirmNewPassword: string;
}

const DEFAULT_CREATE_FORM: CreateUserFormState = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    isActive: true
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.35 }
    }
};

function formatDate(value?: string) {
    if (!value) return '--';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '--';

    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
}

export default function AdminUsersPage() {
    const { user, setImpersonation } = useAuth();

    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createForm, setCreateForm] = useState<CreateUserFormState>(DEFAULT_CREATE_FORM);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState<EditUserFormState | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<'' | 'user' | 'admin'>('');
    const [statusFilter, setStatusFilter] = useState<'' | 'active' | 'inactive'>('');

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, admins: 0 });

    const pageSize = 10;

    const fetchUsers = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await adminUserApi.listUsers({
                page: currentPage,
                limit: pageSize,
                search,
                role: roleFilter,
                status: statusFilter
            });

            if (!response.success || !response.data) {
                throw new Error(response.message || 'Không thể tải danh sách user');
            }

            setUsers(response.data.users || []);
            setTotalPages(response.data.pagination?.totalPages || 1);
            setStats(response.data.stats || { total: 0, active: 0, inactive: 0, admins: 0 });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Không thể tải danh sách user';
            showError(message);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, roleFilter, search, statusFilter]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, roleFilter, statusFilter]);

    const handleToggleStatus = async (target: AdminUser) => {
        try {
            const response = await adminUserApi.updateUser(target.id, {
                isActive: !target.isActive
            });

            if (!response.success || !response.data) {
                throw new Error(response.message || 'Không thể cập nhật trạng thái');
            }

            showSuccess('Cập nhật trạng thái thành công');
            fetchUsers();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Không thể cập nhật trạng thái';
            showError(message);
        }
    };

    const handleRoleChange = async (target: AdminUser, role: 'user' | 'admin') => {
        try {
            const response = await adminUserApi.updateUser(target.id, { role });

            if (!response.success || !response.data) {
                throw new Error(response.message || 'Không thể cập nhật role');
            }

            showSuccess('Cập nhật role thành công');
            fetchUsers();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Không thể cập nhật role';
            showError(message);
        }
    };

    const handleCreateUser = async () => {
        if (!createForm.name || !createForm.email || !createForm.password || !createForm.confirmPassword) {
            showError('Vui lòng nhập đầy đủ tên, email, mật khẩu và nhập lại mật khẩu');
            return;
        }

        if (createForm.password !== createForm.confirmPassword) {
            showError('Mật khẩu xác nhận không khớp');
            return;
        }

        try {
            setIsCreating(true);

            const response = await adminUserApi.createUser({
                name: createForm.name,
                email: createForm.email,
                password: createForm.password,
                role: createForm.role,
                isActive: createForm.isActive
            });

            if (!response.success) {
                throw new Error(response.message || 'Không thể tạo user');
            }

            showSuccess('Tạo user thành công');
            setShowCreateModal(false);
            setCreateForm(DEFAULT_CREATE_FORM);
            fetchUsers();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Không thể tạo user';
            showError(message);
        } finally {
            setIsCreating(false);
        }
    };

    const handleOpenEditModal = (target: AdminUser) => {
        setEditForm({
            id: target.id,
            name: target.name,
            isActive: !!target.isActive,
            newPassword: '',
            confirmNewPassword: ''
        });
        setShowEditModal(true);
    };

    const handleSaveEditUser = async () => {
        if (!editForm) return;

        if (!editForm.name.trim()) {
            showError('Họ tên không được để trống');
            return;
        }

        if (editForm.newPassword || editForm.confirmNewPassword) {
            if (!editForm.newPassword || !editForm.confirmNewPassword) {
                showError('Vui lòng nhập đủ mật khẩu mới và xác nhận mật khẩu mới');
                return;
            }

            if (editForm.newPassword.length < 6) {
                showError('Mật khẩu mới phải có ít nhất 6 ký tự');
                return;
            }

            if (editForm.newPassword !== editForm.confirmNewPassword) {
                showError('Xác nhận mật khẩu mới không khớp');
                return;
            }
        }

        try {
            setIsUpdating(true);

            const updateResponse = await adminUserApi.updateUser(editForm.id, {
                name: editForm.name.trim(),
                isActive: editForm.isActive
            });

            if (!updateResponse.success) {
                throw new Error(updateResponse.message || 'Không thể cập nhật thông tin người dùng');
            }

            if (editForm.newPassword) {
                const resetResponse = await adminUserApi.resetUserPassword(editForm.id, editForm.newPassword);
                if (!resetResponse.success) {
                    throw new Error(resetResponse.message || 'Không thể đặt lại mật khẩu');
                }
            }

            showSuccess('Cập nhật người dùng thành công');
            setShowEditModal(false);
            setEditForm(null);
            fetchUsers();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Không thể cập nhật người dùng';
            showError(message);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleSwitchAs = (target: AdminUser) => {
        setImpersonation({
            id: target.id,
            name: target.name,
            email: target.email,
            avatar: target.avatar,
            role: target.role,
            isActive: target.isActive
        });
        showSuccess(`Đã chuyển ngữ cảnh sang ${target.name}`);
    };

    const filteredCountText = useMemo(() => {
        if (isLoading) return 'Đang tải dữ liệu...';
        return `Hiển thị ${users.length} người dùng trên trang này`;
    }, [isLoading, users.length]);

    if (user?.role !== 'admin') {
        return (
            <div className="w-[96%] max-w-[1200px] mx-auto py-10">
                <div className="bg-white border border-red-200 text-red-600 rounded-2xl p-6">
                    Bạn không có quyền truy cập trang quản lý người dùng.
                </div>
            </div>
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-[96%] max-w-[1700px] mx-auto"
        >
            <motion.div variants={itemVariants} className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Quản lý người dùng</h1>
                    <p className="text-gray-600 mt-1">{filteredCountText}</p>
                </div>

                <Button
                    variant="primary"
                    className="rounded-xl px-5"
                    onClick={() => setShowCreateModal(true)}
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tạo tài khoản mới
                </Button>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Tổng user', value: stats.total, color: 'from-[#3B82F6] to-[#1D4ED8]' },
                    { label: 'Đang hoạt động', value: stats.active, color: 'from-emerald-500 to-green-600' },
                    { label: 'Tạm khóa', value: stats.inactive, color: 'from-red-500 to-rose-600' },
                    { label: 'Admin', value: stats.admins, color: 'from-[#F59E0B] to-[#EA580C]' }
                ].map((item) => (
                    <motion.div
                        key={item.label}
                        whileHover={{ y: -3 }}
                        className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm"
                    >
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center mb-3 shadow-md`}>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5V4H2v16h5m10 0v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6m10 0H7" />
                            </svg>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{item.value}</div>
                        <div className="text-sm text-gray-500">{item.label}</div>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-200 p-4 md:p-5 mb-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tìm theo tên hoặc email"
                        leftIcon={
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        }
                    />

                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value as '' | 'admin' | 'user')}
                        className="w-full h-11 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90D9]/30"
                    >
                        <option value="">Tất cả role</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as '' | 'active' | 'inactive')}
                        className="w-full h-11 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90D9]/30"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="active">Đang hoạt động</option>
                        <option value="inactive">Tạm khóa</option>
                    </select>

                    <Button
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => {
                            setSearch('');
                            setRoleFilter('');
                            setStatusFilter('');
                        }}
                    >
                        Xóa bộ lọc
                    </Button>
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead>
                            <tr className="bg-gradient-to-r from-[#E0EFFF] to-white text-left text-xs uppercase tracking-wide text-gray-600">
                                <th className="px-4 py-3 font-semibold">Người dùng</th>
                                <th className="px-4 py-3 font-semibold">Role</th>
                                <th className="px-4 py-3 font-semibold">Trạng thái</th>
                                <th className="px-4 py-3 font-semibold">Ngày tạo</th>
                                <th className="px-4 py-3 font-semibold">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                        Đang tải danh sách người dùng...
                                    </td>
                                </tr>
                            )}

                            {!isLoading && users.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                        Không có người dùng phù hợp.
                                    </td>
                                </tr>
                            )}

                            {!isLoading && users.map((item, index) => (
                                <motion.tr
                                    key={item.id}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    className="border-t border-gray-100 hover:bg-[#F8FBFF]"
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-[#4A90D9]/20 text-[#1E40AF] flex items-center justify-center font-bold text-sm">
                                                {item.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{item.name}</div>
                                                <div className="text-xs text-gray-500">{item.email}</div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-4 py-3">
                                        <select
                                            value={item.role}
                                            onChange={(e) => handleRoleChange(item, e.target.value as 'admin' | 'user')}
                                            className={`text-xs px-2 py-1 rounded-full border font-semibold ${
                                                item.role === 'admin'
                                                    ? 'bg-violet-100 text-violet-700 border-violet-200'
                                                    : 'bg-blue-100 text-blue-700 border-blue-200'
                                            }`}
                                        >
                                            <option value="user">user</option>
                                            <option value="admin">admin</option>
                                        </select>
                                    </td>

                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleToggleStatus(item)}
                                            className={`text-xs px-2.5 py-1 rounded-full border font-semibold transition-colors ${
                                                item.isActive
                                                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200'
                                                    : 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200'
                                            }`}
                                        >
                                            {item.isActive ? 'Hoạt động' : 'Tạm khóa'}
                                        </button>
                                    </td>

                                    <td className="px-4 py-3 text-sm text-gray-600">{formatDate(item.createdAt)}</td>

                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleOpenEditModal(item)}
                                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#EEF4FF] text-[#1646C7] hover:bg-[#E2ECFF] transition-colors"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => handleSwitchAs(item)}
                                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#FFD700]/30 text-gray-900 hover:bg-[#FFD700]/50 transition-colors"
                                            >
                                                Switch user
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {!isLoading && totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

            <AnimatePresence>
                {showCreateModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => !isCreating && setShowCreateModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.98 }}
                            className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-gray-200 p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="mb-4">
                                <h3 className="text-xl font-bold text-gray-900">Tạo tài khoản mới</h3>
                                <p className="text-sm text-gray-500 mt-1">Tạo user/admin để quản lý nội dung AI.</p>
                            </div>

                            <div className="space-y-4">
                                <Input
                                    label="Họ tên"
                                    value={createForm.name}
                                    onChange={(e) => setCreateForm((prev) => ({ ...prev, name: e.target.value }))}
                                    placeholder="Nhập họ tên"
                                />

                                <Input
                                    label="Email"
                                    type="email"
                                    value={createForm.email}
                                    onChange={(e) => setCreateForm((prev) => ({ ...prev, email: e.target.value }))}
                                    placeholder="example@email.com"
                                />

                                <Input
                                    label="Mật khẩu"
                                    type="password"
                                    value={createForm.password}
                                    onChange={(e) => setCreateForm((prev) => ({ ...prev, password: e.target.value }))}
                                    placeholder="Tối thiểu 6 ký tự"
                                />

                                <Input
                                    label="Nhập lại mật khẩu"
                                    type="password"
                                    value={createForm.confirmPassword}
                                    onChange={(e) => setCreateForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                                    placeholder="Nhập lại mật khẩu"
                                />

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                                        <select
                                            value={createForm.role}
                                            onChange={(e) => setCreateForm((prev) => ({ ...prev, role: e.target.value as 'admin' | 'user' }))}
                                            className="w-full h-11 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90D9]/30"
                                        >
                                            <option value="user">user</option>
                                            <option value="admin">admin</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                                        <select
                                            value={createForm.isActive ? 'active' : 'inactive'}
                                            onChange={(e) => setCreateForm((prev) => ({ ...prev, isActive: e.target.value === 'active' }))}
                                            className="w-full h-11 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90D9]/30"
                                        >
                                            <option value="active">Hoạt động</option>
                                            <option value="inactive">Tạm khóa</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-end gap-3">
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setCreateForm(DEFAULT_CREATE_FORM);
                                    }}
                                    disabled={isCreating}
                                >
                                    Hủy
                                </Button>

                                <Button
                                    variant="primary"
                                    onClick={handleCreateUser}
                                    isLoading={isCreating}
                                >
                                    Tạo tài khoản
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showEditModal && editForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => !isUpdating && setShowEditModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.98 }}
                            className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-gray-200 p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="mb-4">
                                <h3 className="text-xl font-bold text-gray-900">Cập nhật người dùng</h3>
                                <p className="text-sm text-gray-500 mt-1">Admin có thể chỉnh sửa họ tên, trạng thái và đặt lại mật khẩu.</p>
                            </div>

                            <div className="space-y-4">
                                <Input
                                    label="Họ tên"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm((prev) => (prev ? { ...prev, name: e.target.value } : prev))}
                                    placeholder="Nhập họ tên"
                                />

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                                    <select
                                        value={editForm.isActive ? 'active' : 'inactive'}
                                        onChange={(e) => setEditForm((prev) => (prev ? { ...prev, isActive: e.target.value === 'active' } : prev))}
                                        className="w-full h-11 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90D9]/30"
                                    >
                                        <option value="active">Hoạt động</option>
                                        <option value="inactive">Tạm khóa</option>
                                    </select>
                                </div>

                                <Input
                                    label="Mật khẩu mới (tuỳ chọn)"
                                    type="password"
                                    value={editForm.newPassword}
                                    onChange={(e) => setEditForm((prev) => (prev ? { ...prev, newPassword: e.target.value } : prev))}
                                    placeholder="Để trống nếu không đổi"
                                />

                                <Input
                                    label="Nhập lại mật khẩu mới"
                                    type="password"
                                    value={editForm.confirmNewPassword}
                                    onChange={(e) => setEditForm((prev) => (prev ? { ...prev, confirmNewPassword: e.target.value } : prev))}
                                    placeholder="Nhập lại mật khẩu mới"
                                />
                            </div>

                            <div className="mt-6 flex items-center justify-end gap-3">
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setEditForm(null);
                                    }}
                                    disabled={isUpdating}
                                >
                                    Hủy
                                </Button>

                                <Button
                                    variant="primary"
                                    onClick={handleSaveEditUser}
                                    isLoading={isUpdating}
                                >
                                    Lưu thay đổi
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
