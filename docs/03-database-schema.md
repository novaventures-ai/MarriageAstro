# 03. Database Schema (Supabase / PostgreSQL)

## 1. Overview
We use **Supabase (PostgreSQL)** to store user data, saved profiles, and generated reports.
*   **Authentication:** Managed via `auth.users` (Supabase generic).
*   **Public Schema:** Custom tables for our application logic.
*   **Security:** Row Level Security (RLS) is ENFORCED on all tables.

## 2. Tables

### 2.1 `users` (Public Profile)
*   *Extends the default `auth.users` table.*
*   `id`: UUID (Primary Key, References `auth.users.id`).
*   `full_name`: Text.
*   `email`: Text.
*   `avatar_url`: Text.
*   `plan_tier`: Enum ('free', 'premium', 'astrologer').
*   `created_at`: Timestamptz.

### 2.2 `charts` (Saved Birth Data)
*   *Stores individual birth details for reuse.*
*   `id`: UUID (Primary Key).
*   `user_id`: UUID (Foreign Key -> `users.id`).
*   `name`: Text (e.g., "Rahul", "Priya").
*   `gender`: Enum ('male', 'female', 'other').
*   `date_of_birth`: Date.
*   `time_of_birth`: Time.
*   `location`: Text (City Name).
*   `latitude`: Float.
*   `longitude`: Float.
*   `timezone`: Text.
*   `ayanamsha`: Text (Default: 'Lahiri').
*   `created_at`: Timestamptz.

### 2.3 `compatibility_reports` (Generated Matches)
*   *Stores the results of compatibility analysis between two charts.*
*   `id`: UUID (Primary Key).
*   `user_id`: UUID (Foreign Key -> `users.id` - The creator).
*   `chart_a_id`: UUID (References `charts.id`).
*   `chart_b_id`: UUID (References `charts.id`).
*   `score`: Integer (0-36 Ashtakoot Score).
*   `status`: Enum ('saved', 'archived').
*   `summary`: JSONB (Stores key takeaways like "Excllent Match", "Mangal Dosha Present").
*   `full_report_data`: JSONB (The complete technical analysis).
*   `notes`: Text (User's private notes).
*   `created_at`: Timestamptz.

## 3. Relationships (ER Diagram)
*   **User** 1 -- * **Charts** (One user has many saved charts).
*   **User** 1 -- * **Reports** (One user has many reports).
*   **Report** * -- 1 **Chart A** / **Chart B** (Many reports reference chart profiles).

## 4. Row Level Security (RLS) Policies
*   **Users:**
    *   `SELECT`: Users can read their own profile.
    *   `UPDATE`: Users can update their own profile.
*   **Charts:**
    *   `SELECT`: Users can see only charts where `user_id` == `auth.uid()`.
    *   `INSERT`: Users can insert charts with their own `user_id`.
    *   `DELETE`: Users can delete their own charts.
*   **Reports:**
    *   `SELECT`: Users can see reports they created.
    *   `INSERT`: Users can create reports.

## 5. Indexes
*   `charts(user_id)`: For faster lookup of a user's library.
*   `compatibility_reports(user_id)`: For faster report history loading.
