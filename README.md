# Book Management — Admin Frontend

Independent React + TypeScript admin application for book management, split from the
public/user frontend (`book_management_frontend_v2`). It talks to the same backend REST API.

## Stack

- React 19 + TypeScript
- Vite
- MUI (Material UI)
- Redux Toolkit (`configureStore` / `createSlice` / `createAsyncThunk`)
- Axios
- React Router
- react-hook-form + Zod (login validation)

## Scripts

```bash
npm install
npm run dev        # start the Vite dev server
npm run build      # type-check + production build
npm run preview     # preview the production build
npm run lint        # oxlint
```

## Environment

Backend domain is configurable via `VITE_API_BASE_URL` (see `.env.development` / `.env.production`).

## Admin area

| Route                     | Page                    |
| ------------------------- | ----------------------- |
| `/login`                  | Admin login            |
| `/logout`                 | Sign-out confirmation   |
| `/admin/dashboard`        | Dashboard              |
| `/admin/dashboard/upload`       | Upload book            |
| `/admin/dashboard/manage`        | Manage books           |
| `/admin/dashboard/manage-users` | Manage users / roles    |
| `/admin/dashboard/edit-books/:id` | Edit book              |

All `/admin/*` routes are protected — unauthenticated users are redirected to `/login`.
Admin-only actions (Upload/Manage/Users) are hidden for non-ADMIN roles.