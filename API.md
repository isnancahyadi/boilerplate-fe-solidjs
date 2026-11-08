# SolidStart Frontend Boilerplate — API Reference & Integration Guide

> **Versi Dokumen**: 1.0.0 (Boilerplate Baseline)
> **Tanggal Efektif**: 4 November 2026
> **Status**: Active Baseline — Living Document (Adaptif & Updatable via Protokol §6)
> **Dokumen Terkait**: [`PRD.md`](./PRD.md) · [`ARCHITECTURE.md`](./ARCHITECTURE.md) · [`DESIGN.md`](./DESIGN.md) · [`AGENTS.md`](./AGENTS.md) · [`DEPLOYMENT.md`](./DEPLOYMENT.md)
> **Pemilik / Maintainer**: Developer (Personal / Team Project)
> **Audience**: Developer, Backend Engineer, & AI Coding Assistant
>
> Dokumen ini adalah spesifikasi resmi dan referensi tunggal (_single source of truth_) seluruh kontrak endpoint REST API untuk Core IAM/Auth Service (`API_CORE`) serta template dan konvensi untuk Domain API Aplikasi (`API_APP`).

---

## Daftar Isi

1. [Arsitektur & Konfigurasi Prefix API](#1-arsitektur--konfigurasi-prefix-api)
   - 1.1 [Konfigurasi Base URL & Token Injection](#11-konfigurasi-base-url--token-injection)
2. [Core Service Endpoints (`API_CORE`)](#2-core-service-endpoints-api_core)
   - 2.1 [Authentication & User Profile](#21-authentication--user-profile)
   - 2.2 [User Management](#22-user-management)
   - 2.3 [Role Management & Role Permissions](#23-role-management--role-permissions)
   - 2.4 [Group Management, Group Roles & Permissions](#24-group-management-group-roles--permissions)
   - 2.5 [Permission & Attribute Management](#25-permission--attribute-management)
   - 2.6 [Menu Management](#26-menu-management)
   - 2.7 [System Settings](#27-system-settings)
   - 2.8 [Auth Providers & External SSO](#28-auth-providers--external-sso)
3. [Application Business Endpoints (`API_APP`)](#3-application-business-endpoints-api_app)
   - 3.1 [Konvensi Endpoint Domain Bisnis](#31-konvensi-endpoint-domain-bisnis)
   - 3.2 [Template Spesifikasi Modul CRUD (Contoh: Item / Entity)](#32-template-spesifikasi-modul-crud-contoh-item--entity)
   - 3.3 [Pola Upload File Multipart](#33-pola-upload-file-multipart)
4. [Standar Kontrak Request & Response](#4-standar-kontrak-request--response)
   - 4.1 [Paginated Response Envelope (`ArrayData<T>`)](#41-paginated-response-envelope-arraydatat)
   - 4.2 [Non-Paginated List & Dropdown](#42-non-paginated-list--dropdown)
   - 4.3 [Counter Response (`CountType`)](#43-counter-response-counttype)
   - 4.4 [Filter Parameters (`FilterParams` & `CountParams`)](#44-filter-parameters-filterparams--countparams)
   - 4.5 [Error Response Contract (`ApiErrorBody`) & Form Mapping](#45-error-response-contract-apierrorbody--form-mapping)
   - 4.6 [Disiplin Request Body: JSON vs Multipart Form Data](#46-disiplin-request-body-json-vs-multipart-form-data)
   - 4.7 [File Download & Binary Blob Handling](#47-file-download--binary-blob-handling)
5. [Konvensi Integrasi Frontend (Pola 3-Lapis)](#5-konvensi-integrasi-frontend-pola-3-lapis)
6. [Tata Kelola Dokumen (Living Document Protocol)](#6-tata-kelola-dokumen-living-document-protocol)
7. [Document Revision History](#7-document-revision-history)

---

## 1. Arsitektur & Konfigurasi Prefix API

Sistem memisahkan komunikasi API ke dalam dua prefix/namespace utama:

| Prefix      | Konstanta TS | File Konfigurasi                                 | Deskripsi Domain                                                                                               |
| :---------- | :----------- | :----------------------------------------------- | :------------------------------------------------------------------------------------------------------------- |
| `/api/core` | `API_CORE`   | [`src/config/prefix.ts`](./src/config/prefix.ts) | Layanan IAM / Autentikasi terpusat (Login, Refresh Token, Profil, User, Role, Group, Menu, Permission, Setting) |
| `/api/v1`   | `API_APP`    | [`src/config/prefix.ts`](./src/config/prefix.ts) | Layanan Domain Bisnis Spesifik Proyek (Entitas, Transaksi, Operasional Aplikasi)                               |

### 1.1 Konfigurasi Base URL & Token Injection

- **Base URL**: Dikonfigurasi dinamis via `import.meta.env.VITE_API_URL` pada instance Axios di [`src/config/http.ts`](./src/config/http.ts).
- **Token Injection**: Setiap request secara otomatis menyertakan header `Authorization: Bearer <token>` yang diambil dari cookie aman (`~/config/cookies`).
- **Auto Refresh Token Interceptor**: Menggunakan `axios-auth-refresh`. Jika server merespons HTTP `401 Unauthorized`, interceptor otomatis memanggil `POST /api/core/auth/refresh-token` dengan payload `{ refresh_token }`. Jika refresh token kadaluarsa, cookie dibersihkan dan user diarahkan ke `/auth/login`.

> [!IMPORTANT]
> **Disiplin Path Trailing Slash**:
> Seluruh endpoint `API_CORE` **tidak menggunakan trailing slash** (misal `/api/core/user`, `/api/core/auth/refresh-token`).
> Untuk `API_APP`, sesuaikan dengan konvensi router backend proyek Anda (konsistenkan di seluruh endpoint layer 1).

---

## 2. Core Service Endpoints (`API_CORE`)

Prefix: `/api/core` — Layanan inti autentikasi dan manajemen sistem pengguna.

### 2.1 Authentication & User Profile

| Method | Endpoint                                | Query / Path Params | Request Body                          | Response 200 OK                           | Deskripsi                                         |
| :----- | :-------------------------------------- | :------------------ | :------------------------------------ | :---------------------------------------- | :------------------------------------------------ |
| `POST` | `/api/core/auth/login`                  | —                   | `LoginRequest` (JSON)                 | `LoginResponse`                           | Autentikasi user dengan username & password       |
| `POST` | `/api/core/auth/logout`                 | —                   | —                                     | `200 OK` (empty body)                     | Logout & terminasi sesi token aktif               |
| `POST` | `/api/core/auth/refresh-token`          | —                   | `RefreshTokenRequest` (JSON)          | `RefreshTokenResponse`                    | Perbarui token sesi yang telah kadaluarsa         |
| `POST` | `/api/core/auth/token`                  | —                   | `OAuth2PasswordRequest` (URL-encoded) | `OAuth2TokenResponse`                     | Standar OAuth2 password grant login               |
| `POST` | `/api/core/auth/forgot-password`        | —                   | `ForgotPasswordRequest` (JSON)        | `{ message: string }`                     | Permintaan reset link / OTP password              |
| `POST` | `/api/core/auth/check-forgot-password`  | —                   | `CheckForgotPasswordRequest` (JSON)   | `{ message: string }`                     | Validasi token/kode reset password                |
| `POST` | `/api/core/auth/update-forgot-password` | —                   | `UpdateForgotPasswordRequest` (JSON)  | `{ message: string }`                     | Simpan password baru setelah verifikasi           |
| `GET`  | `/api/core/my/profile`                  | —                   | —                                     | `MyProfileResponse`                       | Ambil profil lengkap pengguna yang sedang aktif   |
| `GET`  | `/api/core/my/menu`                     | —                   | —                                     | `Array<MyMenuResponse>`                        | Ambil hierarki menu yang berhak diakses pengguna  |
| `GET`  | `/api/core/my/permission`               | —                   | —                                     | `Array<MyPermissionResponse>`                  | Ambil permission string array pengguna aktif      |
| `GET`  | `/api/core/my/avatar`                   | —                   | —                                     | `application/octet-stream` (binary image) | Stream binary foto profil pengguna aktif          |
| `POST` | `/api/core/my/avatar`                   | —                   | `MyUploadAvatarRequest` (Multipart)   | `MyUploadAvatarResponse`                  | Upload foto profil baru pengguna aktif            |
| `PUT`  | `/api/core/my/update-profile`           | —                   | `MyUpdateProfileRequest` (JSON)       | `MyUpdateProfileResponse`                 | Perbarui informasi profil pengguna sendiri        |
| `PUT`  | `/api/core/my/update-passwd`            | —                   | `MyUpdatePasswordRequest` (JSON)      | `{ message: string }`                     | Ganti password mandiri (membutuhkan old password) |

#### Skema Object Request & Response 200 OK (§2.1)

```typescript
// === Request Models ===

export interface LoginRequest {
  password: string;
  remember_me?: boolean | null;
  user_name: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface ForgotPasswordRequest {
  user_name: string;
}

export interface CheckForgotPasswordRequest {
  token: string;
}

export interface UpdateForgotPasswordRequest {
  password: string;
  token: string;
}

export interface MyUpdateProfileRequest {
  address?: string | null;
  email?: string | null;
  first_name?: string | null;
  gender?: unknown;
  last_name?: string | null;
  phone?: string | null;
  user_name: string;
}

export interface MyUpdatePasswordRequest {
  new_password: string;
  old_password: string;
}

export interface MyUploadAvatarRequest {
  avatar: string;
}

// === Response Models ===

export interface LoginResponse {
  exp: string;
  exp_in: number;
  exp_refresh_token: string;
  last_login?: string | null;
  last_update?: string | null;
  refresh_token: string;
  token: string;
  token_type: string;
}

export interface RefreshTokenResponse {
  exp: string;
  exp_in: number;
  exp_refresh_token: string;
  refresh_token: string;
  token: string;
  token_type: string;
}

export interface MyProfileResponse {
  created_by?: unknown;
  created_date?: string | null;
  group_roles: Array<MyGroupRole>;
  id: string;
  is_2faenabled?: boolean | null;
  is_active?: boolean | null;
  updated_date?: string | null;
  user_name: string;
  user_profile: MyDetailUserProfile;
}

export interface MyMenuResponse {
  child: Array<MyMenuResponse>;
  description?: string | null;
  icon?: string | null;
  id: string;
  name: string;
  order?: number | null;
  parent_only?: boolean | null;
  url?: string | null;
}

export interface MyPermissionResponse {
  id: string;
  name: string;
  permission_attribute: Array<MyPermissionAttributeDetail>;
}

export interface MyUploadAvatarResponse {
  avatar: string;
}
```

---

### 2.2 User Management

| Method   | Endpoint                           | Query / Path Params                | Request Body                     | Response 200 OK                 | Deskripsi                                           |
| :------- | :--------------------------------- | :--------------------------------- | :------------------------------- | :------------------------------ | :-------------------------------------------------- |
| `GET`    | `/api/core/user`                   | `UserListQuery` (Query)            | —                                | `ArrayData<DetailUser>`         | Daftar pengguna dengan pagination & pencarian       |
| `POST`   | `/api/core/user`                   | —                                  | `UserCreateRequest` (JSON)       | `200 OK` / `UserCreateResponse` | Tambah pengguna baru                                |
| `PUT`    | `/api/core/user`                   | `IdQuery` (Query)                  | `UserUpdateRequest` (JSON)       | `UserUpdateResponse`            | Perbarui data pengguna berdasarkan ID               |
| `DELETE` | `/api/core/user`                   | `IdQuery` (Query)                  | —                                | `200 OK` (empty body)           | Hapus pengguna dari sistem                          |
| `GET`    | `/api/core/user/detail`            | `IdQuery` (Query)                  | —                                | `UserDetailResponse`            | Informasi detail pengguna lengkap                   |
| `GET`    | `/api/core/user/all`               | `UserListQuery` (Query)            | —                                | `Array<DetailUser>`                  | Ambil seluruh pengguna tanpa batasan paginasi ketat |
| `GET`    | `/api/core/user/dropdown`          | `UserDropdownQuery` (Query)        | —                                | `Array<UserDropdownResponse>`        | Daftar ringkas ID dan Nama untuk opsi dropdown      |
| `PUT`    | `/api/core/user/change-status`     | `IdQuery` (Query)                  | `ChangeStatusRequest` (JSON)     | `200 OK`                        | Ubah status aktif / nonaktif pengguna               |
| `POST`   | `/api/core/user/reset_passwd`      | `UserResetPasswordQuery` (Query)   | `ResetPasswordRequest` (JSON)    | `ResetPasswordResponse`         | Admin me-reset password pengguna target             |
| `POST`   | `/api/core/user/add-group-role`    | —                                  | `AddUserGroupRoleRequest` (JSON) | `AddUserGroupRoleResponse`      | Asosiasikan user ke kombinasi Group & Role          |
| `DELETE` | `/api/core/user/delete-group-role` | `DeleteUserGroupRoleQuery` (Query) | —                                | `200 OK`                        | Lepas asosiasi user dari Group & Role tertentu      |

#### Skema Object Parameter, Request & Response 200 OK (§2.2)

```typescript
// === Parameter Models (Query / Path) ===

export interface UserListQuery {
  page?: number;
  page_size?: number;
  search?: string;
}

export interface IdQuery {
  id: string; // UUID
}

export interface UserDropdownQuery {
  limit?: number;
  search?: string;
}

export interface UserResetPasswordQuery {
  user_id: string; // UUID pengguna target reset password
}

export interface DeleteUserGroupRoleQuery {
  group_id: string; // UUID group
  role_id: string; // UUID role
  user_id: string; // UUID pengguna
}

// === Request Models ===

export interface UserCreateRequest {
  address?: string | null;
  email?: string | null;
  first_name?: string | null;
  gender?: unknown;
  group_roles?: Array<unknown> | null;
  is_active: boolean;
  last_name?: string | null;
  password: string;
  phone?: string | null;
  user_name: string;
}

export interface UserUpdateRequest {
  address?: string | null;
  email?: string | null;
  first_name?: string | null;
  gender?: unknown;
  group_roles?: Array<unknown> | null;
  is_active: boolean;
  last_name?: string | null;
  phone?: string | null;
  user_name: string;
}

export interface ChangeStatusRequest {
  status: boolean;
}

export interface ResetPasswordRequest {
  confirm_new_password: string;
  new_password: string;
}

export interface AddUserGroupRoleRequest {
  group_id: string /* UUID */;
  role_id: string /* UUID */;
  user_id: string /* UUID */;
}

// === Response Models ===

export interface DetailUser {
  created_by?: unknown;
  created_date?: string | null;
  id: string;
  is_2faenabled?: boolean | null;
  is_active?: boolean | null;
  updated_date?: string | null;
  user_name: string;
}

export interface UserDetailResponse {
  created_by?: unknown;
  created_date?: string | null;
  group_roles: Array<DetailGroupRole>;
  id: string;
  is_2faenabled?: boolean | null;
  is_active?: boolean | null;
  updated_by?: unknown;
  updated_date?: string | null;
  user_name: string;
  user_profile?: unknown;
}

export interface UserDropdownResponse {
  id: string;
  name: string;
}

export interface AddUserGroupRoleResponse {
  group_id: string;
  id: string;
  role_id: string;
  user_id: string;
}
```

---

### 2.3 Role Management & Role Permissions

| Method   | Endpoint                            | Query / Path Params                 | Request Body                             | Response 200 OK                    | Deskripsi                                            |
| :------- | :---------------------------------- | :---------------------------------- | :--------------------------------------- | :--------------------------------- | :--------------------------------------------------- |
| `GET`    | `/api/core/role`                    | `RoleListQuery` (Query)             | —                                        | `ArrayData<DetailRole>`            | Daftar role terpaginasi (opsional filter per group)  |
| `POST`   | `/api/core/role`                    | —                                   | `RoleCreateRequest` (JSON)               | `RoleCreateResponse`               | Tambah role baru                                     |
| `PUT`    | `/api/core/role`                    | `IdQuery` (Query)                   | `RoleUpdateRequest` (JSON)               | `RoleUpdateResponse`               | Perbarui data role berdasarkan ID                    |
| `DELETE` | `/api/core/role`                    | `IdQuery` (Query)                   | —                                        | `200 OK` (empty body)              | Hapus role dari sistem                               |
| `GET`    | `/api/core/role/detail`             | `IdQuery` (Query)                   | —                                        | `RoleDetailSuccessResponse`        | Detail role beserta daftar grup & user terkait       |
| `GET`    | `/api/core/role/all`                | —                                   | —                                        | `Array<RoleAllResponse>`                | Ambil seluruh daftar role tanpa paginasi             |
| `GET`    | `/api/core/role/dropdown`           | `RoleDropdownQuery` (Query)         | —                                        | `Array<RoleDropdownResponse>`           | Opsi role ringkas untuk komponen dropdown            |
| `GET`    | `/api/core/role-permissions`        | `RolePermissionListQuery` (Query)   | —                                        | `ArrayData<RolePermissionItem>`    | Daftar izin (_permissions_) yang dimiliki suatu role |
| `POST`   | `/api/core/role-permissions`        | —                                   | `RolePermissionCreateRequest` (JSON)     | `RolePermissionCreateResponse`     | Tambah satu permission ke role                       |
| `DELETE` | `/api/core/role-permissions`        | `DeleteRolePermissionQuery` (Query) | —                                        | `200 OK`                           | Hapus permission tertentu dari suatu role            |
| `PUT`    | `/api/core/role-permissions/assign` | —                                   | `RolePermissionUpsertBulkRequest` (JSON) | `RolePermissionUpsertBulkResponse` | Simpan seluruh daftar permission role secara bulk    |

#### Skema Object Parameter, Request & Response 200 OK (§2.3)

```typescript
// === Parameter Models (Query / Path) ===

export interface RoleListQuery {
  group_id?: string; // Filter berdasarkan UUID group
  page?: number;
  page_size?: number;
  search?: string;
}

export interface IdQuery {
  id: string; // UUID
}

export interface RoleDropdownQuery {
  group_id?: string;
  limit?: number;
  search?: string;
}

export interface RolePermissionListQuery {
  all?: boolean;
  page?: number;
  page_size?: number;
  role_id: string; // UUID role (required)
}

export interface DeleteRolePermissionQuery {
  attribute_id: string; // UUID attribute
  permission_id: string; // UUID permission
  role_id: string; // UUID role
}

// === Request Models ===

export interface RoleCreateRequest {
  description?: string | null;
  group_ids?: Array<unknown> | null;
  is_active?: boolean | null;
  role_name: string;
}

export interface RoleUpdateRequest {
  description?: string | null;
  group_ids?: Array<unknown> | null;
  is_active?: boolean | null;
  role_name: string;
}

export interface RolePermissionCreateRequest {
  attribute_id: string /* UUID */;
  permission_id: string /* UUID */;
  role_id: string /* UUID */;
}

export interface RolePermissionUpsertBulkRequest {
  permissions: Array<RolePermissionItem>;
  role_id: string /* UUID */;
}

// === Response Models ===

export interface DetailRole {
  id: string;
  role_name: string;
}

export interface RoleDetailSuccessResponse {
  created_by?: unknown;
  created_date?: string | null;
  description?: string | null;
  groups: Array<RoleDetailGroupInfo>;
  id: string;
  is_active?: boolean | null;
  role_name: string;
  updated_by?: unknown;
  updated_date?: string | null;
}

export interface RoleAllResponse {
  created_by?: unknown;
  created_date?: string | null;
  description?: string | null;
  id: string;
  is_active?: boolean | null;
  role_name: string;
  updated_by?: unknown;
  updated_date?: string | null;
}

export interface RoleDropdownResponse {
  id: string;
  role_name: string;
}

export interface RolePermissionItem {
  attribute_ids: Array<string /* UUID */>;
  permission_id: string /* UUID */;
}

export interface RolePermissionUpsertBulkResponse {
  assigned_count: number;
  role_id: string;
}
```

---

### 2.4 Group Management, Group Roles & Permissions

| Method   | Endpoint                             | Query / Path Params                  | Request Body                              | Response 200 OK                     | Deskripsi                                     |
| :------- | :----------------------------------- | :----------------------------------- | :---------------------------------------- | :---------------------------------- | :-------------------------------------------- |
| `GET`    | `/api/core/group`                    | `GroupListQuery` (Query)             | —                                         | `ArrayData<DetailGroup>`            | Daftar departemen / grup pengguna (paginated) |
| `POST`   | `/api/core/group`                    | —                                    | `GroupCreateRequest` (JSON)               | `GroupCreateResponse`               | Tambah group baru                             |
| `PUT`    | `/api/core/group`                    | `IdQuery` (Query)                    | `GroupUpdateRequest` (JSON)               | `GroupUpdateResponse`               | Perbarui data group berdasarkan ID            |
| `DELETE` | `/api/core/group`                    | `IdQuery` (Query)                    | —                                         | `200 OK` (empty body)               | Hapus group                                   |
| `GET`    | `/api/core/group/detail`             | `IdQuery` (Query)                    | —                                         | `GroupDetailSuccessResponse`        | Detail group beserta parent dan role terkait  |
| `GET`    | `/api/core/group/all`                | —                                    | —                                         | `Array<GroupAllResponse>`                | Seluruh data group (flat list)                |
| `GET`    | `/api/core/group/dropdown`           | `GroupDropdownQuery` (Query)         | —                                         | `Array<GroupDropdownResponse>`           | Opsi group ringkas untuk select dropdown      |
| `GET`    | `/api/core/group-roles`              | `GroupRoleListQuery` (Query)         | —                                         | `ArrayData<DetailGroupRole>`        | Daftar role yang terasosiasi dengan group ini |
| `POST`   | `/api/core/group-roles`              | —                                    | `GroupRoleCreateRequest` (JSON)           | `GroupRoleCreateResponse`           | Asosiasikan role baru ke dalam group          |
| `DELETE` | `/api/core/group-roles`              | `DeleteGroupRoleQuery` (Query)       | —                                         | `200 OK`                            | Lepas relasi role dari suatu group            |
| `PUT`    | `/api/core/group-roles/assign`       | —                                    | `GroupRoleAssignRequest` (JSON)           | `GroupRoleAssignResponse`           | Bulk assign daftar role ke group tertentu     |
| `GET`    | `/api/core/group-permissions`        | —                                    | —                                         | `Array<GroupPermissionItem>`             | Daftar permission yang melekat pada group     |
| `POST`   | `/api/core/group-permissions`        | —                                    | `GroupPermissionCreateRequest` (JSON)     | `GroupPermissionCreateResponse`     | Tambah permission ke group                    |
| `DELETE` | `/api/core/group-permissions`        | `DeleteGroupPermissionQuery` (Query) | —                                         | `200 OK`                            | Hapus permission dari group                   |
| `PUT`    | `/api/core/group-permissions/assign` | —                                    | `GroupPermissionUpsertBulkRequest` (JSON) | `GroupPermissionUpsertBulkResponse` | Bulk assign permission ke group               |

#### Skema Object Parameter, Request & Response 200 OK (§2.4)

```typescript
// === Parameter Models (Query / Path) ===

export interface GroupListQuery {
  page?: number;
  page_size?: number;
  parent_id?: string; // Filter hierarki parent group (UUID)
  search?: string;
}

export interface IdQuery {
  id: string; // UUID
}

export interface GroupDropdownQuery {
  limit?: number;
  parent_id?: string;
  search?: string;
}

export interface GroupRoleListQuery {
  all?: boolean;
  group_id: string; // UUID group (required)
  page?: number;
  page_size?: number;
  search?: string;
}

export interface DeleteGroupRoleQuery {
  group_id: string; // UUID group
  role_id: string; // UUID role
}

export interface DeleteGroupPermissionQuery {
  attribute_id: string; // UUID attribute
  group_id: string; // UUID group
  permission_id: string; // UUID permission
}

// === Request Models ===

export interface GroupCreateRequest {
  description?: string | null;
  group_name: string;
  is_active?: boolean | null;
  parent_id?: string | null;
  role_ids?: Array<unknown> | null;
}

export interface GroupUpdateRequest {
  description?: string | null;
  group_name: string;
  is_active?: boolean | null;
  parent_id?: string | null;
  role_ids?: Array<unknown> | null;
}

export interface GroupRoleCreateRequest {
  group_id: string /* UUID */;
  role_id: string /* UUID */;
}

export interface GroupRoleAssignRequest {
  group_id: string /* UUID */;
  role_ids: Array<string /* UUID */>;
}

export interface GroupPermissionCreateRequest {
  attribute_id: string /* UUID */;
  group_id: string /* UUID */;
  permission_id: string /* UUID */;
}

export interface GroupPermissionUpsertBulkRequest {
  group_id: string /* UUID */;
  permissions: Array<GroupPermissionItem>;
}

// === Response Models ===

export interface DetailGroup {
  group_name: string;
  id: string;
}

export interface GroupDetailSuccessResponse {
  created_by?: unknown;
  created_date?: string | null;
  description?: string | null;
  group_name: string;
  id: string;
  is_active?: boolean | null;
  parent?: unknown;
  roles: Array<GroupDetailRoleInfo>;
  updated_by?: unknown;
  updated_date?: string | null;
}

export interface GroupAllResponse {
  created_by?: unknown;
  created_date?: string | null;
  description?: string | null;
  group_name: string;
  id: string;
  is_active?: boolean | null;
  parent?: unknown;
  updated_by?: unknown;
  updated_date?: string | null;
}

export interface GroupDropdownResponse {
  group_name: string;
  id: string;
}

export interface DetailGroupRole {
  group?: unknown;
  role?: unknown;
}

export interface GroupPermissionItem {
  attribute_ids: Array<string /* UUID */>;
  permission_id: string /* UUID */;
}

export interface GroupRoleAssignResponse {
  created: Array<GroupRoleCreateResponse>;
  deleted: Array<string>;
  existing: Array<string>;
  not_found: Array<string>;
}

export interface GroupPermissionUpsertBulkResponse {
  assigned_count: number;
  group_id: string;
}
```

---

### 2.5 Permission & Attribute Management

| Method   | Endpoint                                  | Query / Path Params                 | Request Body                              | Response 200 OK                        | Deskripsi                                            |
| :------- | :---------------------------------------- | :---------------------------------- | :---------------------------------------- | :------------------------------------- | :--------------------------------------------------- |
| `GET`    | `/api/core/permissions`                   | `PermissionListQuery` (Query)       | —                                         | `ArrayData<DetailPermission>`          | Master daftar permission terdaftar di sistem         |
| `POST`   | `/api/core/permissions`                   | —                                   | `PermissionCreateRequest` (JSON)          | `PermissionCreateResponse`             | Buat definisi permission baru                        |
| `PUT`    | `/api/core/permissions`                   | `IdQuery` (Query)                   | `PermissionUpdateRequest` (JSON)          | `PermissionUpdateResponse`             | Perbarui nama / konfigurasi permission               |
| `DELETE` | `/api/core/permissions`                   | `IdQuery` (Query)                   | —                                         | `200 OK` (empty body)                  | Hapus permission                                     |
| `GET`    | `/api/core/permissions/detail`            | `IdQuery` (Query)                   | —                                         | `PermissionDetailResponse`             | Detail permission                                    |
| `GET`    | `/api/core/permissions/all`               | —                                   | —                                         | `Array<PermissionAllResponse>`              | Seluruh permission tanpa paginasi                    |
| `GET`    | `/api/core/permissions/dropdown`          | `PermissionDropdownQuery` (Query)   | —                                         | `Array<PermissionDropdownResponse>`         | Dropdown list permissions                            |
| `GET`    | `/api/core/permissions/attributes`        | `PermissionAttributeQuery` (Query)  | —                                         | `PermissionAttributeListResponse`      | Atribut aksi (create, read, update, delete) per tipe |
| `GET`    | `/api/core/permission-attribute`          | `AttributeListQuery` (Query)        | —                                         | `ArrayData<DetailPermissionAttribute>` | Daftar atribut izin operasi sistem                   |
| `POST`   | `/api/core/permission-attribute`          | —                                   | `CreatePermissionAttributeRequest` (JSON) | `200 OK`                               | Tambah permission attribute                          |
| `PUT`    | `/api/core/permission-attribute`          | `IdQuery` (Query)                   | `UpdatePermissionAttributeRequest` (JSON) | `200 OK`                               | Perbarui permission attribute                        |
| `DELETE` | `/api/core/permission-attribute`          | `IdQuery` (Query)                   | —                                         | `200 OK`                               | Hapus permission attribute                           |
| `GET`    | `/api/core/permission-attribute/detail`   | `IdQuery` (Query)                   | —                                         | `DetailPermissionAttribute`            | Detail permission attribute                          |
| `GET`    | `/api/core/permission-attribute/dropdown` | `AttributeDropdownQuery` (Query)    | —                                         | `Array<DetailPermissionAttribute>`          | Dropdown opsi permission attribute                   |
| `GET`    | `/api/core/user-permissions`              | `UserPermissionListQuery` (Query)   | —                                         | `ArrayData<UserPermissionItem>`        | Daftar override permission khusus per user           |
| `POST`   | `/api/core/user-permissions`              | —                                   | `UserPermissionCreateRequest` (JSON)      | `UserPermissionCreateResponse`         | Tambah custom permission ke user spesifik            |
| `DELETE` | `/api/core/user-permissions`              | `DeleteUserPermissionQuery` (Query) | —                                         | `200 OK`                               | Hapus custom permission user                         |
| `PUT`    | `/api/core/user-permissions/assign`       | —                                   | `UserPermissionUpsertBulkRequest` (JSON)  | `UserPermissionUpsertBulkResponse`     | Bulk assign permission user                          |

#### Skema Object Parameter, Request & Response 200 OK (§2.5)

```typescript
// === Parameter Models (Query / Path) ===

export interface PermissionListQuery {
  is_group?: boolean;
  is_role?: boolean;
  is_user?: boolean;
  page?: number;
  page_size?: number;
  search?: string;
}

export interface IdQuery {
  id: string; // UUID
}

export interface PermissionDropdownQuery {
  is_group?: boolean;
  is_role?: boolean;
  is_user?: boolean;
  limit?: number;
  search?: string;
}

export interface PermissionAttributeQuery {
  permission_type: string; // Tipe permission (e.g. "read" | "write" | "delete")
  search?: string;
}

export interface AttributeListQuery {
  page?: number;
  page_size?: number;
  search?: string;
}

export interface AttributeDropdownQuery {
  limit?: number;
}

export interface UserPermissionListQuery {
  all?: boolean;
  page?: number;
  page_size?: number;
  user_id: string; // UUID pengguna (required)
}

export interface DeleteUserPermissionQuery {
  attribute_id: string; // UUID attribute
  permission_id: string; // UUID permission
  user_id: string; // UUID pengguna
}

// === Request Models ===

export interface PermissionCreateRequest {
  description?: string | null;
  is_group: boolean;
  is_role: boolean;
  is_user: boolean;
  permission_attribute_ids: Array<string /* UUID */>;
  permission_name: string;
}

export interface PermissionUpdateRequest {
  description?: string | null;
  is_group: boolean;
  is_role: boolean;
  is_user: boolean;
  permission_attribute_ids: Array<string /* UUID */>;
  permission_name: string;
}

export interface CreatePermissionAttributeRequest {
  description?: string | null;
  name: string;
}

export interface UpdatePermissionAttributeRequest {
  description?: string | null;
  name: string;
}

export interface UserPermissionCreateRequest {
  attribute_id: string /* UUID */;
  permission_id: string /* UUID */;
  user_id: string /* UUID */;
}

export interface UserPermissionUpsertBulkRequest {
  permissions: Array<UserPermissionItem>;
  user_id: string /* UUID */;
}

// === Response Models ===

export interface DetailPermission {
  created_by?: unknown;
  created_date?: string | null;
  description?: string | null;
  id: string;
  is_group: boolean;
  is_role: boolean;
  is_user: boolean;
  permission_name: string;
  updated_by?: unknown;
  updated_date?: string | null;
}

export interface PermissionDetailResponse {
  created_by?: unknown;
  created_date?: string | null;
  description?: string | null;
  id: string;
  is_group: boolean;
  is_role: boolean;
  is_user: boolean;
  permission_attribute_ids: Array<PermissionAttributeListPermissionDetail>;
  permission_name: string;
  updated_by?: unknown;
  updated_date?: string | null;
}

export interface PermissionAllResponse {
  created_date?: string | null;
  description?: string | null;
  id: string;
  is_group: boolean;
  is_role: boolean;
  is_user: boolean;
  permission_name: string;
  updated_date?: string | null;
}

export interface PermissionDropdownResponse {
  id: string;
  permission_name: string;
}

export interface PermissionAttributeListResponse {
  permission: PermissionItem;
  permission_attributes: Array<PermissionAttributeListItem>;
}

export interface DetailPermissionAttribute {
  description?: string | null;
  id: string;
  name: string;
}

export interface UserPermissionItem {
  attribute_ids: Array<string /* UUID */>;
  permission_id: string /* UUID */;
}

export interface UserPermissionUpsertBulkResponse {
  assigned_count: number;
  user_id: string;
}
```

---

### 2.6 Menu Management

| Method   | Endpoint                | Query / Path Params     | Request Body               | Response 200 OK             | Deskripsi                                      |
| :------- | :---------------------- | :---------------------- | :------------------------- | :-------------------------- | :--------------------------------------------- |
| `GET`    | `/api/core/menu`        | `MenuListQuery` (Query) | —                          | `ArrayData<DetailMenu>`     | Master data konfigurasi navigasi menu sistem   |
| `POST`   | `/api/core/menu`        | —                       | `MenuCreateRequest` (JSON) | `MenuCreateResponse`        | Tambah entri menu baru                         |
| `PUT`    | `/api/core/menu`        | `IdQuery` (Query)       | `MenuUpdateRequest` (JSON) | `MenuUpdateResponse`        | Perbarui konfigurasi entri menu                |
| `DELETE` | `/api/core/menu`        | `IdQuery` (Query)       | —                          | `200 OK` (empty body)       | Hapus entri menu                               |
| `GET`    | `/api/core/menu/detail` | `IdQuery` (Query)       | —                          | `MenuDetailSuccessResponse` | Detail konfigurasi menu dan mapping permission |

#### Skema Object Parameter, Request & Response 200 OK (§2.6)

```typescript
// === Parameter Models (Query / Path) ===

export interface MenuListQuery {
  all?: boolean;
  page?: number;
  page_size?: number;
  parent_id?: string; // UUID parent menu
  search?: string;
}

export interface IdQuery {
  id: string; // UUID
}

// === Request Models ===

export interface MenuCreateRequest {
  description?: string | null;
  icon?: string | null;
  name: string;
  order?: number | null;
  parent_id?: string | null;
  parent_only?: boolean | null;
  permissions?: Array<unknown> | null;
  url?: string | null;
}

export interface MenuUpdateRequest {
  description?: string | null;
  icon?: string | null;
  name: string;
  order?: number | null;
  parent_id?: string | null;
  parent_only?: boolean | null;
  permissions?: Array<unknown> | null;
  url?: string | null;
}

// === Response Models ===

export interface DetailMenu {
  children: Array<DetailMenu>;
  description: string;
  icon: string;
  id: string;
  name: string;
  order: number;
  parent_only: boolean;
  url: string;
}

export interface MenuDetailSuccessResponse {
  description: string;
  icon: string;
  id: string;
  name: string;
  order: number;
  parent?: unknown;
  parent_only: boolean;
  permissions: Array<MenuPermissionDetail>;
  url: string;
}
```

---

### 2.7 System Settings

| Method   | Endpoint                    | Query / Path Params        | Request Body                   | Response 200 OK                 | Deskripsi                                    |
| :------- | :-------------------------- | :------------------------- | :----------------------------- | :------------------------------ | :------------------------------------------- |
| `GET`    | `/api/core/settings/all`    | `SettingsAllQuery` (Query) | —                              | `Array<SettingsAllResponse>`         | Ambil seluruh parameter konfigurasi aplikasi |
| `GET`    | `/api/core/settings/detail` | `IdQuery` (Query)          | —                              | `SettingsDetailSuccessResponse` | Detail satu item konfigurasi setting         |
| `POST`   | `/api/core/settings`        | —                          | `SettingsCreateRequest` (JSON) | `SettingsCreateResponse`        | Buat setting parameter baru                  |
| `PUT`    | `/api/core/settings`        | `IdQuery` (Query)          | `SettingsUpdateRequest` (JSON) | `SettingsUpdateResponse`        | Perbarui nilai setting parameter             |
| `DELETE` | `/api/core/settings`        | `IdQuery` (Query)          | —                              | `200 OK` (empty body)           | Hapus setting parameter                      |

#### Skema Object Parameter, Request & Response 200 OK (§2.7)

```typescript
// === Parameter Models (Query / Path) ===

export interface SettingsAllQuery {
  category?: string; // Filter kategori konfigurasi sistem
  name?: string; // Pencarian nama pengaturan
}

export interface IdQuery {
  id: string; // UUID pengaturan sistem
}

export interface SettingsKeyQuery {
  name: string; // Nama / key pengaturan unik (required)
}

// === Request Models ===

export interface SettingsCreateRequest {
  category: string;
  data_type: string;
  description?: string | null;
  name: string;
  value: string;
}

export interface SettingsUpdateRequest {
  category?: string | null;
  data_type?: string | null;
  description?: string | null;
  name?: string | null;
  value?: string | null;
}

// === Response Models ===

export interface DetailSettings {
  category: string;
  data_type: string;
  description?: string | null;
  id: string;
  name: string;
  value: string;
}

export interface SettingsDetailSuccessResponse {
  category: string;
  data_type: string;
  description?: string | null;
  id: string;
  name: string;
  value: string;
}

export interface SettingsAllResponse {
  data: Array<DetailSettings>;
}
```

---

### 2.8 Auth Providers & External SSO

| Method   | Endpoint                                           | Query / Path Params                    | Request Body                             | Response 200 OK                                     | Deskripsi                                          |
| :------- | :------------------------------------------------- | :------------------------------------- | :--------------------------------------- | :-------------------------------------------------- | :------------------------------------------------- |
| `GET`    | `/api/core/auth/providers`                         | —                                      | —                                        | `{ providers: Array<AuthProviderListResponse> }`         | Daftar konfigurasi SSO / identity providers        |
| `POST`   | `/api/core/auth/providers`                         | —                                      | `AuthProviderUpsertRequest` (JSON)       | `200 OK`                                            | Tambah / simpan provider SSO                       |
| `GET`    | `/api/core/auth/providers/available`               | —                                      | —                                        | `{ providers: Array<PublicAuthProvider> }`               | Provider aktif yang tampil di layar login pengguna |
| `GET`    | `/api/core/auth/providers/templates`               | —                                      | —                                        | `{ templates: Array<AuthProviderTemplateListResponse> }` | Template konfigurasi SSO (OIDC, SAML, Keycloak)    |
| `POST`   | `/api/core/auth/providers/from-template`           | —                                      | `AuthProviderFromTemplateRequest` (JSON) | `AuthProviderAdminResponse`                         | Inisialisasi provider dari template bawaan         |
| `GET`    | `/api/core/auth/providers/{provider}`              | `ProviderPathParam` (Path)             | —                                        | `AuthProviderAdminResponse`                         | Ambil detail konfigurasi provider tertentu         |
| `PUT`    | `/api/core/auth/providers/{provider}`              | `ProviderPathParam` (Path)             | `AuthProviderUpsertRequest` (JSON)       | `AuthProviderAdminResponse`                         | Perbarui konfigurasi provider tertentu             |
| `DELETE` | `/api/core/auth/providers/{provider}`              | `ProviderPathParam` (Path)             | —                                        | `200 OK`                                            | Hapus konfigurasi provider SSO                     |
| `POST`   | `/api/core/auth/providers/{provider}/test`         | `ProviderPathParam` (Path)             | —                                        | `AuthProviderTestResponse`                          | Test koneksi dan verifikasi handshake SSO          |
| `GET`    | `/api/core/auth/settings`                          | —                                      | —                                        | `AuthSettingsResponse`                              | Pengaturan global autentikasi (password vs SSO)    |
| `GET`    | `/api/core/auth/external/{provider}/login`         | `ProviderPathParam` (Path)             | —                                        | `{ redirect_url: string }`                          | Inisiasi alur redirect login eksternal OIDC/SAML   |
| `GET`    | `/api/core/auth/external/{provider}/callback`      | `ProviderCallbackQuery` (Path & Query) | —                                        | `LoginResponse`                                     | Callback OIDC menerima authorization code          |
| `POST`   | `/api/core/auth/external/{provider}/saml/acs`      | `ProviderPathParam` (Path)             | `SamlAcsRequest` (URL-encoded)           | `LoginResponse`                                     | Assertion Consumer Service untuk SAML post-back    |
| `GET`    | `/api/core/auth/external/{provider}/saml/metadata` | `ProviderPathParam` (Path)             | —                                        | `application/octet-stream` (XML)                    | Download SP SAML Metadata XML                      |

#### Skema Object Parameter, Request & Response 200 OK (§2.8)

```typescript
// === Parameter Models (Query / Path) ===

export interface ProviderPathParam {
  provider: string; // Identifier unik provider SSO (e.g. "google", "keycloak", "saml")
}

export interface ProviderCallbackQuery {
  provider: string; // Path parameter provider
  code: string; // Authorization code dari OAuth/OIDC IdP
  state: string; // State verification token
}

export interface IdentityPathParam {
  identity_id: string; // UUID akun identitas eksternal yang ditautkan
}

export interface OAuthCallbackQuery {
  code: string; // Authorization code Keycloak
  state: string; // State token verifikasi sesi
}

// === Request Models ===

export interface AuthProviderUpsertRequest {
  allow_signup?: boolean;
  auto_link_by_email?: boolean;
  config?: unknown; // Runtime configuration without a template; template form inputs when `template_key` is present.
  display_name: string;
  display_order?: number;
  enabled?: boolean;
  icon_url?: string | null;
  protocol: string; // Must match the selected template protocol when `template_key` is supplied.
  provider_key?: string | null;
  require_verified_email?: boolean;
  secret_config?: unknown; // Sensitive values. Send `"***"` or omit it to retain the existing encrypted secret on updates.
  template_key?: string | null; // Selects template mode. When present, `config` contains that template's form inputs and is canonicalized before persistence.
}

export interface AuthProviderFromTemplateRequest {
  allow_signup?: boolean | null;
  auto_link_by_email?: boolean | null;
  display_name?: string | null;
  display_order?: number | null;
  enabled?: boolean | null;
  icon_url?: string | null;
  params?: unknown;
  provider_key?: string | null;
  require_verified_email?: boolean | null;
  secret_config?: unknown;
  template_key: string;
}

// === Response Models ===

export interface AuthProviderAdminResponse {
  allow_signup: boolean;
  auto_link_by_email: boolean;
  config: unknown;
  display_name: string;
  display_order: number;
  enabled: boolean;
  icon_url?: string | null;
  id: string;
  protocol: string;
  provider_key: string;
  require_verified_email: boolean;
  secret_config?: unknown;
  template_key?: string | null;
}

export interface PublicAuthProvider {
  display_order: number;
  icon_url?: string | null;
  key: string;
  login_url: string;
  name: string;
  protocol: string;
  type: string;
}

export interface AuthProviderTestResponse {
  checks: Array<AuthProviderTestCheck>;
  message: string;
  ok: boolean;
  protocol: string;
  provider_key: string;
  safe_config: unknown;
  safe_secret_config?: unknown;
}

export interface AuthSettingsResponse {
  external_password_login_enabled: boolean;
  password_login_enabled: boolean;
  providers: Array<PublicAuthProvider>;
  redirect_login_enabled: boolean;
}
```

---

## 3. Application Business Endpoints (`API_APP`)

Prefix: `/api/v1` — Layanan domain bisnis dan fitur spesifik aplikasi.

Bagian ini adalah **template dan panduan** bagaimana setiap modul domain bisnis proyek baru didokumentasikan. Saat mengembangkan fitur baru, developer atau AI agent wajib mendokumentasikan kontrak endpoint di bagian ini sebelum atau bersamaan dengan penyusunan `./PLAN.md`.

---

### 3.1 Konvensi Endpoint Domain Bisnis

1. **Format Resource RESTful**:
   - Gunakan kata benda jamak huruf kecil kebab-case: `/api/v1/items`, `/api/v1/orders`, `/api/v1/categories`.
   - Pola operasi standar:
     - `GET /api/v1/[resources]` → List data dengan paginasi & filter (`ArrayData<T>`).
     - `GET /api/v1/[resources]/all` → List seluruh data tanpa paginasi untuk opsi dropdown (`Array<TItem>`).
     - `GET /api/v1/[resources]/:id` → Detail data tunggal (`Detail[Entity]Type`).
     - `POST /api/v1/[resources]` → Buat data baru (`[Entity]MutationResponseType`).
     - `PUT /api/v1/[resources]/:id` → Perbarui data (`[Entity]MutationResponseType`).
     - `DELETE /api/v1/[resources]/:id` → Hapus data (`{ message: string }`).

---

### 3.2 Template Spesifikasi Modul CRUD (Contoh: Item / Entity)

Sebagai referensi implementasi pada fitur baru, berikut adalah spesifikasi standar kontrak data:

| Method | Endpoint | Query / Path Params | Request Body | Response 200 OK | Deskripsi |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/items` | `FilterParams` | — | `ArrayData<ItemType>` | Daftar data item berpaginasi |
| `GET` | `/api/v1/items/all` | `StatusParams` | — | `Array<ItemOptionType>` | Daftar ringkas untuk opsi dropdown |
| `GET` | `/api/v1/items/:id` | `id: string` (path) | — | `DetailItemType` | Detail lengkap satu item |
| `POST` | `/api/v1/items` | — | `CreateItemInput` (JSON) | `ItemMutationResponseType` | Tambah data item baru |
| `PUT` | `/api/v1/items/:id` | `id: string` (path) | `UpdateItemInput` (JSON) | `ItemMutationResponseType` | Perbarui data item yang ada |
| `DELETE` | `/api/v1/items/:id` | `id: string` (path) | — | `{ message: string }` | Hapus data item |
| `POST` | `/api/v1/items/upload` | — | `FormData` (Multipart) | `FileUploadResponse` | Unggah lampiran berkas item |

#### Skema Model TypeScript (Contoh: `features/[fitur]/types/schema.ts`)

```typescript
// Model dasar tabel list
export interface ItemType {
  id: string;
  code: string;
  name: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

// Model detail lengkap
export interface DetailItemType extends ItemType {
  description?: string;
  created_by?: string;
}

// Opsi ringkas dropdown (disimpan di src/lib/data/ jika dipakai bersama)
export interface ItemOptionType {
  id: string;
  name: string;
}

// Respon mutasi CUD
export interface ItemMutationResponseType {
  id: string;
  message: string;
}
```

---

### 3.3 Pola Upload File Multipart

Untuk endpoint pengunggahan berkas:
- **Header**: `Content-Type: multipart/form-data`
- **Helper**: Gunakan utilitas `appendFormData()` dari `~/lib/utils/form`.
- **Payload**: Objek dengan properti `file: File | Blob` dan metadata string terkait.
- **Response**: `{ url: string, filename: string, size: number }`.

---


## 4. Standar Kontrak Request & Response

Seluruh struktur payload TypeScript didefinisikan secara terpusat pada [`src/types/common.ts`](./src/types/common.ts), [`src/types/api.ts`](./src/types/api.ts), dan folder schema fitur masing-masing.

### 4.1 Paginated Response Envelope (`ArrayData<T>`)

Semua endpoint list terpaginasi mengembalikan struktur amplop baku:

```typescript
export interface ArrayData<T> {
  counts: number; // Total jumlah seluruh record yang cocok
  page: number; // Nomor halaman saat ini (1-based index)
  page_count: number; // Total halaman yang tersedia
  page_size: number; // Batas jumlah item per halaman (default: 10 / 20)
  results: Array<T>; // Array data record entitas
}
```

### 4.2 Non-Paginated List & Dropdown

- **Flat Array (`Array<T>`)**: Endpoint dengan akhiran `/all` mengembalikan array langsung `Array<T>` tanpa metadata pagination untuk keperluan komparasi atau opsi dropdown bersama.
- **Dropdown List (`ItemOptionType`)**: Endpoint dropdown mengembalikan bentuk ringkas `{ id: string, name: string }` untuk efisiensi transfer data pada komponen Select / Combobox.

### 4.3 Counter Response (`CountType`)

Endpoint `/count/` mengembalikan jumlah total record berdasarkan status:

```typescript
export interface CountType {
  count: number;
}
```

### 4.4 Filter Parameters (`FilterParams` & `CountParams`)

Daftar parameter query standar yang diteruskan ke Layer 2 API:

```typescript
// Parameter standar pencarian & paginasi
export interface FilterParams {
  page?: number; // default: 1
  page_size?: number; // default: 10
  search?: string; // keyword teks pencarian (case-insensitive)
  limit?: number; // batasan untuk dropdown
}

// Parameter status counter
export interface IsActiveParams {
  is_active?: boolean; // misal untuk vendor: true / false
}

export interface StatusParams {
  status?: boolean; // misal untuk pit, stockpile, seam, shift: true / false
}

export type CountParams = IsActiveParams | StatusParams;
```

### 4.5 Error Response Contract (`ApiErrorBody`) & Form Mapping

Saat terjadi kegagalan (HTTP 4xx / 5xx), backend Rust mengembalikan struktur error terpadu:

```json
{
  "code": "VALIDATION_ERROR",
  "data": {
    "errors": [
      {
        "ctx": null,
        "loc": ["body", "vendor_name"],
        "msg": "vendor_name is required",
        "type": "value_error.missing"
      }
    ]
  },
  "message": "Validation failed"
}
```

#### Pemetaan Error ke Frontend:

1. **HTTP 422 Unprocessable Entity (`VALIDATION_ERROR`)**:
   Elemen `loc[1]` memetakan langsung ke nama field input pada form ([`@formisch/solid`](./ARCHITECTURE.md#6-forms--validasi)). Frontend menampilkan pesan `msg` secara inline di bawah input bersangkutan. **Dilarang memunculkan Toast untuk error validasi inline field form.**
2. **HTTP 400 Bad Request**: Pesan `message` ditampilkan via Toast notifikasi global.
3. **HTTP 401 Unauthorized**: Ditangani otomatis oleh `axios-auth-refresh` untuk token refresh atau redirect ke login.
4. **HTTP 403 Forbidden**: Menandakan user tidak memiliki permission untuk aksi tersebut. Tombol aksi yang tidak diizinkan wajib disembunyikan sejak awal menggunakan guard `parsePermission(module).includes(action)` ([`ARCHITECTURE.md` §8](./ARCHITECTURE.md#8-autentikasi--permission)).
5. **HTTP 404 Not Found & HTTP 500 Internal Error**: Ditampilkan via Toast atau error boundary halaman.

### 4.6 Disiplin Request Body: JSON vs Multipart Form Data

| Tipe Data Form          | Format Request                      | Header Axios                                                            | Kapan Digunakan                                                                                                                                                                                                                                          |
| :---------------------- | :---------------------------------- | :---------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **JSON Standar**        | `application/json`                  | Otomatis (`Accept: application/json`, `Content-Type: application/json`) | Seluruh operasi create/update master data standar (`user`, `role`, `truck`, `locations`, `seam`, `shift`, `planning`, dll.).                                                                                                                             |
| **Multipart Form Data** | `multipart/form-data`               | `{ headers: { "Content-Type": "multipart/form-data" } }`                | Form yang memiliki upload berkas fisik/lampiran gambar: `vendor` (dokumen/logo), `driver` (foto KTP/SIM), `avatar` pengguna, serta upload file Excel hauling preview. Gunakan utilitas `appendFormData()` dari [`src/lib/utils.ts`](./src/lib/utils.ts). |
| **URL-Encoded**         | `application/x-www-form-urlencoded` | `{ headers: { "Content-Type": "application/x-www-form-urlencoded" } }`  | Khusus endpoint standar OAuth2 `/api/core/auth/token` dan SAML ACS callback.                                                                                                                                                                             |

### 4.7 File Download & Binary Blob Handling

Untuk seluruh endpoint yang menghasilkan file (`/export/`, `/get-template/`, `/file/`, `/file/image/`):

- Panggilan Axios **wajib** menyertakan opsi `{ responseType: "blob" }`.
- Eksekusi penyimpanan ke file browser menggunakan utilitas `downloadFile(blob, fileName)` dari [`src/lib/utils.ts`](./src/lib/utils.ts).

---

## 5. Konvensi Integrasi Frontend (Pola 3-Lapis)

Sesuai ketetapan [`ARCHITECTURE.md` §4](./ARCHITECTURE.md#4-alur-data--pola-3-lapisan), seluruh integrasi API pada direktori `src/features/[fitur]/lib/data/` wajib dipisahkan ke dalam 3 lapisan simetris:

```
src/features/[fitur]/lib/data/
├── endpoint/index.ts      ← Layer 1: Konstanta URL endpoint & fungsi helper URL param
├── api/index.ts           ← Layer 2: Fungsi async HTTP via Axios instance (~/config/http)
├── query-keys/index.ts    ← Query Key Factory untuk TanStack Query
├── mock/                  ← Mock data dummy (opsional, jika API backend belum aktif)
└── service/index.ts       ← Layer 3: Hook createQuery / createMutation (dikonsumsi UI)
```

> [!WARNING]
> Komponen UI (`*.tsx`) **dilarang keras** mengimpor `http` atau memanggil endpoint URL secara langsung. Komponen hanya diperbolehkan mengonsumsi hooks Layer 3 dari `service/`.

---

## 6. Tata Kelola Dokumen (Living Document Protocol)

Dokumen `API.md` berstatus **Approved Baseline — Living Document**. Dokumen ini bersifat adaptif dan dapat diperbarui mengikuti penambahan endpoint baru, pembaruan skema OpenAPI, atau penyesuaian kebutuhan operasional aplikasi.

### 6.1 Alur Perubahan Kontrak API

```
                     [ 1. Usulan Perubahan Kontrak API ]
       (Endpoint baru dari Rust backend, revisi parameter, atau perubahan payload)
                                     │
                                     ▼
                     [ 2. Analisis & Verifikasi Skema ]
  - Periksa spesifikasi kontrak backend (OpenAPI schema / route definition)
  - Pastikan keselarasan dengan PRD.md (fitur Fase 1 vs Fase 2)
  - Evaluasi dampak pada Layer 1-3 (endpoint, api, query-keys, service)
                                     │
                                     ▼
                      [ 3. Konsensus & ADR Sign-Off ]
   Disetujui oleh Developer / Pemilik Proyek (dan Backend Engineer jika terpisah)
                                     │
                                     ▼
                 [ 4. Update Dokumen & Sinkronisasi Silang ]
  - Perbarui API.md (tabel endpoint, parameter, request/response)
  - Catat riwayat pada Document Revision History (§7)
  - Selaraskan ARCHITECTURE.md, AGENTS.md, atau schema TypeScript (src/types/*)
```

### 6.2 Prinsip Pengelolaan Kontrak API

1. **Sinkronisasi Backend Wajib**: Seluruh endpoint yang tercatat dalam `API.md` wajib bersumber dan terverifikasi dari kontrak route dan skema backend aktual.
2. **Keterbukaan Status Pending**: Jika ada modul yang direncanakan namun belum diimplementasikan di backend (misal fitur Analytics atau Export Data), statusnya wajib dinyatakan secara eksplisit agar pengembang dapat menerapkan strategi mock data yang tepat.
3. **Disiplin Penamaan**: Konvensi penamaan fungsi Layer 2 & 3 wajib mematuhi standar `ARCHITECTURE.md` §4.6 (`get[Entity]List`, `useGet[Entity]List`, `useCreate[Entity]`, dll.).

---

## 7. Document Revision History

| Versi     | Tanggal     | Inisiator / Maintainer         | Ringkasan Perubahan & Catatan                                                                                                                                                                                                                                                                                                          |
| :-------- | :---------- | :----------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1.0.0** | 4 Nov 2026  | Developer & AI Assistant       | **Baseline Resmi SolidStart Boilerplate API Contract**:<br>• Dokumentasi spesifikasi kontrak endpoint universal IAM / Authentication service (`API_CORE`) berbasis microservice terpusat<br>• Template dan konvensi baku integrasi domain aplikasi (`API_APP`) pola 3 lapis data<br>• Standardisasi response envelope (`ArrayData<T>`, `ApiErrorBody`) dan type safety mutasi |

---

_Dokumen ini berstatus **Active Baseline**. Segala perubahan kontrak API lanjutan wajib mengikuti tata kelola pada §6 dan dicatat pada tabel riwayat revisi di atas._
_Versi: 1.0.0 (Boilerplate Baseline) — 4 November 2026_
